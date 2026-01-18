import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { userId, email, priceId, subscription, customAmount, trafficGB } = await req.json();

  if (subscription) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { userId, email, subscription },
        mode: "subscription",
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        allow_promotion_codes: true,
      });


      return NextResponse.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return NextResponse.json({ error: "Failed to create checkout session" });
    }
  } else {
    try {
      let lineItems;

      // Handle custom amounts with dynamic pricing
      if (customAmount && trafficGB) {
        lineItems = [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${trafficGB}GB Traffic Package`,
                description: `Add ${trafficGB}GB of traffic to your account (valid for 1 year)`,
              },
              unit_amount: Math.round(customAmount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ];
      } else if (priceId) {
        // Use predefined price ID
        lineItems = [{ price: priceId, quantity: 1 }];
      } else {
        return NextResponse.json(
          { error: "Either priceId or customAmount with trafficGB is required" },
          { status: 400 }
        );
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        metadata: { 
          userId, 
          email, 
          subscription: 'false',
          trafficGB: trafficGB?.toString() || '0',
          type: 'traffic_purchase',
        },
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      });

      return NextResponse.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return NextResponse.json({ error: "Failed to create checkout session" });
    }
  }
}
