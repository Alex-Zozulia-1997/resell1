import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  console.log('✅ Stripe webhook event received:', event.type);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentSucceeded(invoice);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('💳 Checkout session completed:', session.id);

  const customerEmail = session.customer_email || session.customer_details?.email;
  const amountTotal = session.amount_total; // in cents
  
  if (!customerEmail) {
    console.error('❌ No customer email found in session');
    return;
  }

  // Get metadata from the session (we'll need to add this when creating checkout)
  const trafficAmount = session.metadata?.trafficAmount; // in MB
  const userId = session.metadata?.userId;

  if (!trafficAmount || !userId) {
    console.error('❌ Missing metadata in session:', { trafficAmount, userId });
    return;
  }

  await addTrafficToUser(customerEmail, userId, parseInt(trafficAmount));
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('💰 Invoice payment succeeded:', invoice.id);

  const customerEmail = invoice.customer_email;
  const userId = invoice.metadata?.userId;
  const trafficAmount = invoice.metadata?.trafficAmount;

  if (!customerEmail || !trafficAmount || !userId) {
    console.error('❌ Missing required data in invoice:', { customerEmail, userId, trafficAmount });
    return;
  }

  await addTrafficToUser(customerEmail, userId, parseInt(trafficAmount));
}

async function addTrafficToUser(email: string, userId: string, trafficMB: number) {
  try {
    console.log('📊 Adding traffic to user:', { email, userId, trafficMB });

    // 1. Get user's resID from your database
    const dbResponse = await fetch(`${process.env.FRONTEND_URL}/api/user?email=${email}`);
    if (!dbResponse.ok) {
      throw new Error('Failed to fetch user from database');
    }
    const dbData = await dbResponse.json();
    const resID = dbData.resID;

    if (!resID) {
      throw new Error('No Geonode resID found for user');
    }

    console.log('👤 Found user resID:', resID);

    // 2. Add traffic using Geonode API
    const geonodeApiKey = process.env.GEONODE_API_KEY;
    if (!geonodeApiKey) {
      throw new Error('GEONODE_API_KEY not configured');
    }

    const addTrafficUrl = 'https://api.geonode.com/api/reseller-user-traffic';
    const requestBody = {
      id: resID,
      trafficLimit: trafficMB, // in MB
    };

    console.log('🚀 Sending request to Geonode:', { url: addTrafficUrl, body: requestBody });

    const geonodeResponse = await fetch(addTrafficUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'r-api-key': geonodeApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!geonodeResponse.ok) {
      const errorText = await geonodeResponse.text();
      console.error('❌ Geonode API error:', {
        status: geonodeResponse.status,
        body: errorText,
      });
      throw new Error(`Geonode API error: ${geonodeResponse.status}`);
    }

    const geonodeData = await geonodeResponse.json();
    console.log('✅ Traffic added successfully:', geonodeData);

    // 3. Optionally update your database to track the transaction
    // await updateUserTrafficHistory(userId, trafficMB, geonodeData);

    return geonodeData;
  } catch (error) {
    console.error('💥 Error adding traffic to user:', error);
    throw error;
  }
}
