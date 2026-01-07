import { userCreate } from '@/utils/data/user/userCreate';
import { userUpdate } from '@/utils/data/user/userUpdate';
import { updateUser } from '@/utils/data/user/userUpdate1';
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  console.log('=== Webhook Request Received ===');

  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET not configured');
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  console.log('Svix headers present:', {
    hasId: !!svix_id,
    hasTimestamp: !!svix_timestamp,
    hasSignature: !!svix_signature,
  });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error(
      'Missing svix headers - this is not a valid Clerk webhook request'
    );
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the raw body text (Svix requires the exact raw payload for signature verification)
  const body = await req.text();
  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch (e) {
    payload = {};
  }

  // Create a new SVIX instance with your secret. Do not log the secret in production.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured - invalid signature', {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
  console.log('Received event type:', eventType);
  // PI CAL DEF++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const createUserOnAPI = async (data: {
    email: string;
    serviceType: string; // "RESIDENTIAL-PREMIUM", "HTML-SCRAPPER", "SHARED-DATACENTER"
    traffic_limit: number;
    username: string; // Only letters, numbers, underscores allowed
    password: string; // UUID or similar, 36 chars
    current_period_end: string; // "YYYY-MM-DD"
  }) => {
    // Use your internal API route instead of calling Geonode directly
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/geonode/user/create`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Create user failed:', response.status, text);
        throw new Error(
          `Failed to create user: ${response.status} ${response.statusText} - ${text}`
        );
      }

      const result = await response.json();
      console.log('User created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating user on API:', error);
      throw error;
    }
  };
  function generateUsername(prefix = 'proxy') {
    const randomNumber = Math.floor(Math.random() * 100); // Random number 0-99
    return `${prefix}${randomNumber}`;
  }
  // API CALl++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  switch (eventType) {
    case 'user.created':
      try {
        const eventData: any = (evt as any).data || payload?.data;
        const userEmail = eventData?.email_addresses?.[0]?.email_address;

        // Check if user already exists in Supabase
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          'https://exunxrckgdmnawgtjdwj.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dW54cmNrZ2RtbmF3Z3RqZHdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5MjQwNSwiZXhwIjoyMDc5NTY4NDA1fQ.vpNYa2UPWt7cwcp2Ur2Qx6gf-DGChBzzNAHJv7AJ2So'
        );

        const { data: existingUser } = await supabase
          .from('user')
          .select('resid, email')
          .eq('email', userEmail)
          .maybeSingle(); // Use maybeSingle() to handle 0 rows

        if (existingUser?.resid) {
          console.log('User already exists with resID:', existingUser.resid);
          return NextResponse.json({
            status: 200,
            message: 'User already exists',
          });
        }

        // Insert the initial user info
        await userCreate({
          email: userEmail,
          first_name: eventData?.first_name,
          last_name: eventData?.last_name,
          profile_image_url: eventData?.profile_image_url,
          user_id: eventData?.id,
        });

        console.log('User info inserted');

        // Prepare base data for API call
        const baseUserData = {
          email: eventData?.email_addresses?.[0]?.email_address,
          serviceType: 'RESIDENTIAL-PREMIUM',
          traffic_limit: 1500,
          password: uuidv4(), // UUID, 36 characters
          current_period_end: '2026-12-31T23:59:59.000Z',
        } as any;

        // Try creating subuser with retries on username collision
        let createResponse: any = null;
        let attempts = 0;
        const maxAttempts = 5;
        while (attempts < maxAttempts) {
          attempts += 1;
          const userData = {
            ...baseUserData,
            username: generateUsername(),
          };

          console.log(
            'Attempting to create subuser on Geonode. Attempt:',
            attempts,
            'body:',
            JSON.stringify(userData)
          );

          try {
            createResponse = await createUserOnAPI(userData);
            console.log('API Response:', createResponse);
            break; // success
          } catch (err: any) {
            const msg = String(err?.message || err || '');
            console.error('Create attempt failed:', attempts, msg);

            // If conflict due to username, retry with a new username
            if (
              msg.includes('username') ||
              msg.toLowerCase().includes('username')
            ) {
              console.warn('Username conflict, retrying with a new username');
              continue;
            }

            // If email already exists or other terminal error, abort
            if (msg.includes('Email already') || msg.toLowerCase().includes('email')) {
              console.error('Email already exists on Geonode; aborting create');
              break;
            }

            // For other errors, abort and surface
            throw err;
          }
        }

        const resId = createResponse?.data?.id;
        console.log('User ID:', resId);

        // Update the user table with the resId - use direct Supabase update
        if (resId) {
          const { error: updateError } = await supabase
            .from('user')
            .update({ resid: resId })
            .eq('email', userEmail);

          if (updateError) {
            console.error('Failed to update resid:', updateError);
          } else {
            console.log('resId updated successfully in user table');
          }
        } else {
          console.warn('resID not found in API response');
        }

        return NextResponse.json({
          status: 200,
          message: 'User info inserted and resId updated',
        });
      } catch (error) {
        console.error('Error handling user.created:', error);
        return NextResponse.json({
          status: 400,
          message: String(error),
        });
      }

    case 'user.updated':
      try {
        await userUpdate({
          email: payload?.data?.email_addresses?.[0]?.email_address,
          first_name: payload?.data?.first_name,
          last_name: payload?.data?.last_name,
          profile_image_url: payload?.data?.profile_image_url,
          user_id: payload?.data?.id,
        });

        return NextResponse.json({
          status: 200,
          message: 'User info updated',
        });
      } catch (error: any) {
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }

    default:
      return new Response('Error occured -- unhandeled event type', {
        status: 400,
      });
  }
}
