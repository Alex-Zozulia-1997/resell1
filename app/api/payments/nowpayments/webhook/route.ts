import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// Verify IPN signature
function verifyIPNSignature(
  payload: string,
  receivedSignature: string,
  ipnSecret: string
): boolean {
  const hmac = crypto.createHmac('sha512', ipnSecret);
  hmac.update(payload);
  const calculatedSignature = hmac.digest('hex');
  return calculatedSignature === receivedSignature;
}

export async function POST(req: NextRequest) {
  try {
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
    
    if (!ipnSecret) {
      console.error('NOWPayments IPN secret not configured');
      return NextResponse.json({ error: 'IPN not configured' }, { status: 500 });
    }

    // Get the raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-nowpayments-sig');

    if (!signature) {
      console.error('Missing NOWPayments signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify signature
    if (!verifyIPNSignature(rawBody, signature, ipnSecret)) {
      console.error('Invalid NOWPayments signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const data = JSON.parse(rawBody);
    
    console.log('NOWPayments IPN received:', {
      payment_id: data.payment_id,
      payment_status: data.payment_status,
      order_id: data.order_id,
    });

    // Handle different payment statuses
    switch (data.payment_status) {
      case 'finished':
      case 'confirmed':
        // Payment successful - add traffic to user account
        await handleSuccessfulPayment(data);
        break;
      
      case 'partially_paid':
        // Partially paid - you might want to handle this
        console.log('Payment partially paid:', data.payment_id);
        break;
      
      case 'failed':
      case 'expired':
      case 'refunded':
        // Payment failed or cancelled
        await handleFailedPayment(data);
        break;
      
      case 'waiting':
      case 'sending':
        // Payment in progress - just log it
        console.log('Payment in progress:', data.payment_id);
        break;
      
      default:
        console.log('Unknown payment status:', data.payment_status);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing NOWPayments IPN:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(data: any) {
  try {
    // Extract user ID from order_id (format: traffic_userId_timestamp)
    const orderId = data.order_id;
    const match = orderId.match(/traffic_(.+?)_\d+/);
    
    if (!match) {
      console.error('Invalid order ID format:', orderId);
      return;
    }

    const userId = match[1];
    const amountPaid = parseFloat(data.price_amount);
    
    // Calculate GB from amount (based on your pricing tiers)
    const trafficGB = calculateTrafficFromAmount(amountPaid);

    // TODO: Add traffic to user's account in your database
    // Example using your existing database structure:
    /*
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        trafficGB: { increment: trafficGB },
        trafficExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });

    // Log the transaction
    await prisma.transaction.create({
      data: {
        userId,
        type: 'CRYPTO',
        amount: amountPaid,
        currency: data.price_currency,
        trafficGB,
        paymentId: data.payment_id,
        status: 'COMPLETED',
      },
    });
    */

    console.log(`Successfully added ${trafficGB}GB to user ${userId}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleFailedPayment(data: any) {
  try {
    // TODO: Log failed payment in your database
    console.log('Payment failed:', data.payment_id, data.payment_status);
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

function calculateTrafficFromAmount(amount: number): number {
  // Reverse calculate GB from amount based on your pricing tiers
  if (amount <= 11) return 5; // $11 for 5GB
  if (amount <= 55) return 50; // $55 for 50GB
  if (amount <= 160) return 200; // $160 for 200GB
  if (amount <= 350) return 500; // $350 for 500GB
  
  // For custom amounts, calculate based on best tier
  return Math.floor(amount / 0.7); // Use the best rate
}
