import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { trafficGB, userId: reqUserId, email, amount } = body; // amount in USD

    console.log("🗋 Creating NOWPayments invoice:", { trafficGB, userId, email, amount });
    console.log("🗋 Full request body:", body);

    if (!trafficGB || !userId || !email || !amount) {
      console.log("❌ NOWPayments validation failed:", { 
        trafficGB: !!trafficGB, 
        userId: !!userId, 
        email: !!email, 
        amount: !!amount
      });
      return NextResponse.json(
        { error: 'Missing required fields: trafficGB, userId, email, or amount' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) {
      console.error('NOWPayments API key not configured');
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    // Create payment invoice (allows user to choose cryptocurrency)
    const paymentData: any = {
      price_amount: amount,
      price_currency: 'usd',
      order_id: `traffic_${userId}_${Date.now()}`,
      order_description: `${trafficGB}GB Residential Proxy Traffic`,
      success_url: `${process.env.FRONTEND_URL}success?payment_type=crypto`,
      cancel_url: `${process.env.FRONTEND_URL}cancel?payment_type=crypto`,
      ipn_callback_url: `${process.env.FRONTEND_URL}api/payments/nowpayments/webhook`,
      // Store metadata for webhook processing
      metadata: {
        userId,
        trafficGB: trafficGB.toString(),
        type: 'traffic_purchase',
        email,
      },
    };

    const response = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('NOWPayments API error:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to create payment' },
        { status: response.status }
      );
    }

    // Store payment metadata in your database if needed
    // You can use the payment_id to track the transaction

    return NextResponse.json({
      paymentId: data.id,
      paymentUrl: data.invoice_url,
      orderId: data.order_id,
      amount: data.price_amount,
      currency: data.price_currency,
    });
  } catch (error) {
    console.error('Error creating NOWPayments payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
