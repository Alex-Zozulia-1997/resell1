import { userCreate } from '@/utils/data/user/userCreate';
import { userUpdate } from '@/utils/data/user/userUpdate';
import { updateUser } from '@/utils/data/user/userUpdate1';
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { v4 as uuidv4 } from 'uuid';
import { encodeEmail, createEmailMapping } from '@/lib/email-encoding';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  console.log('=== Webhook Request Received ===');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('WEBHOOK_SECRET configured:', !!WEBHOOK_SECRET, WEBHOOK_SECRET?.substring(0, 10) + '...');

  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET not configured');
    throw new Error(
      'Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
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
          `Failed to create proxy user: ${response.status} ${response.statusText} - ${text}`
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

        // Add validation
        if (!userEmail) {
          console.error('No email found in event data:', JSON.stringify(eventData));
          return NextResponse.json({
            status: 400,
            message: 'No email found in webhook data',
          });
        }

        console.log('Processing user creation for email:', userEmail);

        // Check if user already exists in Supabase
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          'https://exunxrckgdmnawgtjdwj.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dW54cmNrZ2RtbmF3Z3RqZHdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5MjQwNSwiZXhwIjoyMDc5NTY4NDA1fQ.vpNYa2UPWt7cwcp2Ur2Qx6gf-DGChBzzNAHJv7AJ2So'
        );

        const { data: existingUser, error: checkError } = await supabase
          .from('user')
          .select('resid, email')
          .eq('email', userEmail)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing user:', checkError);
          // Continue anyway, don't fail here
        }

        if (existingUser?.resid) {
          console.log('User already exists with resID:', existingUser.resid);
          return NextResponse.json({
            status: 200,
            message: 'User already exists',
          });
        }

        // Insert the initial user info
        console.log('Attempting to create user in Supabase...');
        try {
          await userCreate({
            email: userEmail,
            first_name: eventData?.first_name,
            last_name: eventData?.last_name,
            profile_image_url: eventData?.profile_image_url,
            user_id: eventData?.id,
          });
          console.log('User info inserted into Supabase successfully');
        } catch (createError) {
          console.error('Failed to create user in Supabase:', createError);
          throw new Error(`Supabase userCreate failed: ${createError}`);
        }

        // Prepare base data for API call
        const originalEmail = eventData?.email_addresses?.[0]?.email_address;
        const encodedEmail = encodeEmail(originalEmail);
        
        // Create email mapping for future reference
        const emailMapping = createEmailMapping(originalEmail, encodedEmail);
        console.log('📧 EMAIL ENCODING: Created mapping:', { original: originalEmail, encoded: encodedEmail });
        
        const baseUserData = {
          email: encodedEmail, // Use encoded email for Geonode
          serviceType: 'RESIDENTIAL-PREMIUM',
          traffic_limit: 50,
          password: uuidv4(), 
          current_period_end: '2029-12-31T23:59:59.000Z',
        } as any;

        // Try creating subuser with retries on username collision
        let createResponse: any = null;
        let attempts = 0;
        const maxAttempts = 5;
        let lastError: any = null;

        while (attempts < maxAttempts) {
          attempts += 1;
          const userData = {
            ...baseUserData,
            username: generateUsername(),
          };

          console.log(
            'Attempting to create subuser on Geonode. Attempt:',
            attempts,
            'username:',
            userData.username
          );

          try {
            createResponse = await createUserOnAPI(userData);
            console.log('API Response:', createResponse);
            break; // success
          } catch (err: any) {
            lastError = err;
            const msg = String(err?.message || err || '');
            console.error('Create attempt failed:', attempts, msg);

            if (
              msg.includes('username') ||
              msg.toLowerCase().includes('username')
            ) {
              console.warn('Username conflict, retrying with a new username');
              continue;
            }

            if (msg.includes('Email already') || msg.toLowerCase().includes('email')) {
              console.error('Email already exists on proxy service; aborting create');
              break;
            }

            throw err;
          }
        }

        if (!createResponse && attempts >= maxAttempts) {
          console.error('Failed to create user on Geonode after', maxAttempts, 'attempts');
          throw new Error(`Failed to create proxy user after ${maxAttempts} attempts: ${lastError}`);
        }

        const resId = createResponse?.data?.id;
        console.log('Geonode User ID (resId):', resId);

        if (resId) {
          const { error: updateError } = await supabase
            .from('user')
            .update({ resid: resId })
            .eq('email', userEmail);

          if (updateError) {
            console.error('Failed to update resid:', updateError);
            throw new Error(`Failed to update proxy user ID in database: ${updateError.message}`);
          } else {
            console.log('resId updated successfully in user table');
          }
        } else {
          console.warn('resID not found in API response - user may not have been created on Geonode');
          throw new Error('Proxy user ID not found in API response');
        }

        return NextResponse.json({
          status: 200,
          message: 'User info inserted and resId updated',
        });
      } catch (error) {
        console.error('Error handling user.created:', error);
        console.error('Full error details:', JSON.stringify(error, null, 2));
        return NextResponse.json({
          status: 500,
          message: `Failed to create user: ${error instanceof Error ? error.message : String(error)}`,
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
