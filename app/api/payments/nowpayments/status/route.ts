import { NextRequest, NextResponse } from 'next/server';

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    // Get payment status from NOWPayments
    const response = await fetch(
      `${NOWPAYMENTS_API_URL}/payment/${paymentId}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('NOWPayments API error:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to fetch payment status' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      paymentId: data.payment_id,
      paymentStatus: data.payment_status,
      payAmount: data.pay_amount,
      payCurrency: data.pay_currency,
      priceAmount: data.price_amount,
      priceCurrency: data.price_currency,
      orderId: data.order_id,
      orderDescription: data.order_description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      paymentUrl: data.payment_url || data.invoice_url,
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
