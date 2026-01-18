import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, trafficGB, email } = await req.json();

    if (!amount || !trafficGB) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
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
    // For new accounts, consider adding specific currencies to avoid availability issues
    const paymentData: any = {
      price_amount: amount,
      price_currency: 'usd',
      order_id: `traffic_${userId}_${Date.now()}`,
      order_description: `${trafficGB}GB Traffic Package`,
      success_url: `${process.env.FRONTEND_URL}success?type=crypto`,
      cancel_url: `${process.env.FRONTEND_URL}cancel?type=crypto`,
      ipn_callback_url: `${process.env.FRONTEND_URL}api/payments/nowpayments/webhook`,
      // Uncomment to restrict to specific currencies for new accounts:
      // pay_currency: 'btc', // or 'usdttrc20' for USDT
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
