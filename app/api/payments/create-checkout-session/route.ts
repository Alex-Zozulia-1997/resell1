import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trafficGB, userId, email, amount } = body; // amount in cents

    console.log("📦 Creating checkout session:", { trafficGB, userId, email, amount });
    console.log("📦 Full request body:", body);

    if (!trafficGB || !userId || !email || !amount) {
      console.log("❌ Validation failed:", { 
        trafficGB: !!trafficGB, 
        userId: !!userId, 
        email: !!email, 
        amount: !!amount,
        trafficGBValue: trafficGB,
        userIdValue: userId,
        emailValue: email,
        amountValue: amount
      });
      return NextResponse.json(
        { 
          error: "Missing required fields: trafficGB, userId, email, or amount",
          details: {
            trafficGB: !!trafficGB,
            userId: !!userId,
            email: !!email,
            amount: !!amount
          }
        },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Proxy Traffic - ${trafficGB}GB`,
              description: `One-time purchase of ${trafficGB}GB residential proxy traffic`,
            },
            unit_amount: amount, // Amount in cents, passed from frontend
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        trafficGB: trafficGB.toString(),
        type: "traffic_purchase",
        email,
      },
      success_url: `${process.env.FRONTEND_URL}success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}cancel?canceled=true`,
    });

    console.log("✅ Checkout session created:", session.id);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
