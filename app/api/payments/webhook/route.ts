import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { encodeEmail } from '@/lib/email-encoding';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  console.log("🔔 WEBHOOK: Received Stripe webhook request");
  console.log("🔔 WEBHOOK: Request URL:", req.url);
  console.log("🔔 WEBHOOK: Request method:", req.method);
  
  const cookieStore = await cookies();

  const supabase: any = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  const reqText = await req.text();
  console.log("🔔 WEBHOOK: Request body length:", reqText.length);
  
  return webhooksHandler(reqText, req, supabase);
}

async function getCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return (customer as Stripe.Customer).email;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

async function handleSubscriptionEvent(
  event: Stripe.Event,
  type: "created" | "updated" | "deleted",
  supabase: ReturnType<typeof createServerClient>
) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerEmail = await getCustomerEmail(subscription.customer as string);

  if (!customerEmail) {
    return NextResponse.json({
      status: 500,
      error: "Customer email could not be fetched",
    });
  }

  const subscriptionData: any = {
    subscription_id: subscription.id,
    stripe_user_id: subscription.customer,
    status: subscription.status,
    start_date: new Date(subscription.created * 1000).toISOString(),
    plan_id: subscription.items.data[0]?.price.id,
    user_id: subscription.metadata?.userId || "",
    email: customerEmail,
  };

  let data, error;
  if (type === "deleted") {
    ({ data, error } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled", email: customerEmail })
      .match({ subscription_id: subscription.id })
      .select());
    if (!error) {
      const { error: userError } = await supabase
        .from("user")
        .update({ subscription: null })
        .eq("email", customerEmail);
      if (userError) {
        console.error("Error updating user subscription status:", userError);
        return NextResponse.json({
          status: 500,
          error: "Error updating user subscription status",
        });
      }
    }
  } else {
    ({ data, error } = await supabase
      .from("subscriptions")
      [type === "created" ? "insert" : "update"](
        type === "created" ? [subscriptionData] : subscriptionData
      )
      .match({ subscription_id: subscription.id })
      .select());
  }

  if (error) {
    console.error(`Error during subscription ${type}:`, error);
    return NextResponse.json({
      status: 500,
      error: `Error during subscription ${type}`,
    });
  }

  return NextResponse.json({
    status: 200,
    message: `Subscription ${type} success`,
    data,
  });
}

async function handleInvoiceEvent(
  event: Stripe.Event,
  status: "succeeded" | "failed",
  supabase: ReturnType<typeof createServerClient>
) {
  const invoice = event.data.object as Stripe.Invoice;
  const customerEmail = await getCustomerEmail(invoice.customer as string);

  if (!customerEmail) {
    return NextResponse.json({
      status: 500,
      error: "Customer email could not be fetched",
    });
  }

  const invoiceData = {
    invoice_id: invoice.id,
    subscription_id: invoice.subscription as string,
    amount_paid: status === "succeeded" ? invoice.amount_paid / 100 : undefined,
    amount_due: status === "failed" ? invoice.amount_due / 100 : undefined,
    currency: invoice.currency,
    status,
    user_id: invoice.metadata?.userId,
    email: customerEmail,
  };

  const { data, error } = await supabase.from("invoices").insert([invoiceData]);

  if (error) {
    console.error(`Error inserting invoice (payment ${status}):`, error);
    return NextResponse.json({
      status: 500,
      error: `Error inserting invoice (payment ${status})`,
    });
  }

  return NextResponse.json({
    status: 200,
    message: `Invoice payment ${status}`,
    data,
  });
}

async function webhooksHandler(
  reqText: string,
  request: NextRequest,
  supabase: ReturnType<typeof createServerClient>
): Promise<NextResponse> {
  console.log("🔧 WEBHOOK HANDLER: Starting webhook processing");
  
  const sig = request.headers.get("Stripe-Signature");
  console.log("🔧 WEBHOOK HANDLER: Stripe signature present:", !!sig);
  console.log("🔧 WEBHOOK HANDLER: Webhook secret configured:", !!process.env.STRIPE_WEBHOOK_SECRET);

  try {
    console.log("🔧 WEBHOOK HANDLER: Constructing Stripe event...");
    const event = await stripe.webhooks.constructEventAsync(
      reqText,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    console.log("✅ WEBHOOK HANDLER: Event constructed successfully");
    console.log("📋 WEBHOOK HANDLER: Event type:", event.type);
    console.log("📋 WEBHOOK HANDLER: Event ID:", event.id);
    console.log("📋 WEBHOOK HANDLER: Event created:", new Date(event.created * 1000).toISOString());

    console.log("🎯 WEBHOOK HANDLER: Processing event type:", event.type);
    
    switch (event.type) {
      case "checkout.session.completed":
        console.log("💳 WEBHOOK: Handling checkout.session.completed");
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        console.log("✅ WEBHOOK: Checkout session completed successfully");
        return NextResponse.json({
          status: 200,
          message: "Checkout session completed successfully",
        });
      case "customer.subscription.created":
        console.log("📋 WEBHOOK: Handling customer.subscription.created");
        return handleSubscriptionEvent(event, "created", supabase);
      case "customer.subscription.updated":
        console.log("📋 WEBHOOK: Handling customer.subscription.updated");
        return handleSubscriptionEvent(event, "updated", supabase);
      case "customer.subscription.deleted":
        console.log("📋 WEBHOOK: Handling customer.subscription.deleted");
        return handleSubscriptionEvent(event, "deleted", supabase);
      case "invoice.payment_succeeded":
        console.log("💰 WEBHOOK: Handling invoice.payment_succeeded");
        return handleInvoiceEvent(event, "succeeded", supabase);
      case "invoice.payment_failed":
        console.log("❌ WEBHOOK: Handling invoice.payment_failed");
        return handleInvoiceEvent(event, "failed", supabase);
      default:
        console.log("❓ WEBHOOK: Unhandled event type:", event.type);
        console.log("❓ WEBHOOK: Full event data:", JSON.stringify(event, null, 2));
        return NextResponse.json({
          status: 400,
          error: "Unhandled event type",
          eventType: event.type
        });
    }
  } catch (err) {
    console.error("💥 WEBHOOK ERROR: Error constructing Stripe event:", err);
    console.error("💥 WEBHOOK ERROR: Request signature:", sig);
    console.error("💥 WEBHOOK ERROR: Request body (first 200 chars):", reqText.substring(0, 200));
    return NextResponse.json({
      status: 500,
      error: "Webhook Error: Invalid Signature",
      details: err instanceof Error ? err.message : "Unknown error"
    });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("💳 CHECKOUT HANDLER: Starting checkout session completion");
  console.log("💳 CHECKOUT HANDLER: Session ID:", session.id);
  console.log("💳 CHECKOUT HANDLER: Payment status:", session.payment_status);
  console.log("💳 CHECKOUT HANDLER: Amount total:", session.amount_total);
  console.log("💳 CHECKOUT HANDLER: Currency:", session.currency);
  console.log("💳 CHECKOUT HANDLER: Metadata:", JSON.stringify(session.metadata, null, 2));

  const customerEmail = session.customer_email || session.customer_details?.email;
  console.log("💳 CHECKOUT HANDLER: Customer email:", customerEmail);

  if (!customerEmail) {
    console.error("❌ CHECKOUT HANDLER: No customer email found in session");
    console.error("❌ CHECKOUT HANDLER: Session customer_email:", session.customer_email);
    console.error("❌ CHECKOUT HANDLER: Session customer_details:", session.customer_details);
    throw new Error("No customer email found");
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const isTrafficPurchase = session.metadata?.type === "traffic_purchase";
  const trafficGB = session.metadata?.trafficGB;

  console.log("📊 CHECKOUT HANDLER: Processing session metadata:", {
    isTrafficPurchase,
    trafficGB,
    email: customerEmail,
    amountPaid: session.amount_total ? session.amount_total / 100 : 0,
    userId: session.metadata?.userId
  });

  if (isTrafficPurchase && trafficGB) {
    console.log("🚀 CHECKOUT HANDLER: Processing traffic purchase for", trafficGB, "GB");
    try {
      await addTrafficToUser(customerEmail, parseInt(trafficGB), supabase);
      console.log("✅ CHECKOUT HANDLER: Traffic added successfully");
    } catch (error) {
      console.error("❌ CHECKOUT HANDLER: Failed to add traffic:", error);
      throw error;
    }
  } else {
    console.log("⚠️ CHECKOUT HANDLER: Skipping traffic processing:", {
      isTrafficPurchase,
      hasTrafficGB: !!trafficGB
    });
  }

  // Record payment in database
  console.log("💾 CHECKOUT HANDLER: Recording payment in database");
  try {
    console.log("💾 CHECKOUT HANDLER: Looking up user by email:", customerEmail);
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("*")
      .eq("email", customerEmail);

    if (userError) {
      console.error("❌ CHECKOUT HANDLER: Error fetching user:", userError);
      throw new Error("Error fetching user");
    }
    
    console.log("💾 CHECKOUT HANDLER: User found:", user?.[0] ? "Yes" : "No");
    if (user?.[0]) {
      console.log("💾 CHECKOUT HANDLER: User ID:", user[0].id);
    }

    const paymentData = {
      user_id: user?.[0]?.id,
      email: customerEmail,
      amount: session.amount_total || 0,
      currency: session.currency,
      status: session.payment_status,
      stripe_session_id: session.id,
      metadata: {
        ...session.metadata,
        trafficGB,
        type: "traffic_purchase",
      },
    };
    
    console.log("💾 CHECKOUT HANDLER: Payment data to insert:", JSON.stringify(paymentData, null, 2));

    const { error: paymentsError } = await supabase.from("payments").insert([paymentData]);

    if (paymentsError) {
      console.error("❌ Error inserting payment:", paymentsError);
    } else {
      console.log("✅ Payment recorded in database");
    }
  } catch (error) {
    console.error("❌ Error recording payment:", error);
  }
}

async function addTrafficToUser(email: string, trafficGB: number, supabase: any) {
  try {
    console.log("📊 TRAFFIC HANDLER: Starting traffic addition process");
    console.log("📊 TRAFFIC HANDLER: Email:", email);
    console.log("� TRAFFIC HANDLER: Using encoded email for Geonode privacy:", encodeEmail(email));
    console.log("�📊 TRAFFIC HANDLER: Traffic to add:", trafficGB, "GB");

    // 1. Get user's resID from database
    console.log("📊 TRAFFIC HANDLER: Looking up user resID in database");
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("resid, email")
      .eq("email", email)
      .single();

    console.log("📊 TRAFFIC HANDLER: Database query result:", {
      userFound: !!user,
      hasResID: !!user?.resid,
      error: userError
    });

    if (userError || !user?.resid) {
      console.error("❌ TRAFFIC HANDLER: User lookup failed:", userError);
      console.error("❌ TRAFFIC HANDLER: User data:", user);
      throw new Error(`No Geonode resID found for user: ${email}`);
    }

    const resID = user.resid;
    console.log("👤 TRAFFIC HANDLER: Found user resID:", resID);

    // 2. Convert GB to MB for Geonode API
    const trafficMB = trafficGB * 1000;
    console.log("🔄 TRAFFIC HANDLER: Converting", trafficGB, "GB to", trafficMB, "MB");

    // 3. Get current traffic limit first
    const geonodeApiKey = process.env.GEONODE_API_KEY;
    if (!geonodeApiKey) {
      console.error("❌ TRAFFIC HANDLER: GEONODE_API_KEY not configured");
      throw new Error("GEONODE_API_KEY not configured");
    }
    console.log("✅ TRAFFIC HANDLER: Geonode API key is configured");

    console.log("🔍 TRAFFIC HANDLER: Getting current traffic limit from Geonode...");
    const getCurrentTrafficUrl = `https://app-api.geonode.com/api/reseller/user/traffic/${resID}`;
    
    const getCurrentTrafficResponse = await fetch(getCurrentTrafficUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "r-api-key": geonodeApiKey,
      },
    });

    console.log("📞 TRAFFIC HANDLER: Get traffic response status:", getCurrentTrafficResponse.status);

    if (!getCurrentTrafficResponse.ok) {
      const errorText = await getCurrentTrafficResponse.text();
      console.error("❌ TRAFFIC HANDLER: Failed to get current traffic:", {
        status: getCurrentTrafficResponse.status,
        statusText: getCurrentTrafficResponse.statusText,
        body: errorText,
      });
      throw new Error(`Failed to get current traffic: ${getCurrentTrafficResponse.status} - ${errorText}`);
    }

    const currentTrafficData = await getCurrentTrafficResponse.json();
    console.log("📊 TRAFFIC HANDLER: Current traffic data:", JSON.stringify(currentTrafficData, null, 2));

    // Extract current limit in bytes and convert to MB (using 1000*1000, not 1024*1024)
    const currentLimitBytes = currentTrafficData.data.trafficLimitInBytes;
    const currentLimitMB = Math.round(currentLimitBytes / (1000 * 1000)); // Convert bytes to MB (Geonode format)
    const usageMB = Math.round(currentTrafficData.data.usageBandwidth / (1000 * 1000)); // Convert usage to MB
    
    console.log("📊 TRAFFIC HANDLER: Current traffic status:", {
      currentLimitMB,
      currentLimitGB: currentLimitMB / 1000,
      usageMB,
      usageGB: usageMB / 1000,
      remainingMB: currentLimitMB - usageMB,
      remainingGB: (currentLimitMB - usageMB) / 1000,
      addingMB: trafficMB,
      addingGB: trafficGB,
    });

    // Calculate new total limit
    const newTotalLimitMB = currentLimitMB + trafficMB;
    console.log("🔢 TRAFFIC HANDLER: New total limit will be:", newTotalLimitMB, "MB (", (newTotalLimitMB / 1000), "GB)");

    // 4. Add traffic using Geonode API
    const addTrafficUrl = `https://app-api.geonode.com/api/reseller/user/${resID}`;
    const requestBody = {
      traffic_limit: newTotalLimitMB,
    };

    console.log("🚀 TRAFFIC HANDLER: Preparing Geonode API request:", {
      url: addTrafficUrl,
      body: requestBody,
      previousLimitMB: currentLimitMB,
      addingMB: trafficMB,
      newTotalLimitMB,
    });

    console.log("🚀 TRAFFIC HANDLER: Sending request to Geonode API...");
    const geonodeResponse = await fetch(addTrafficUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "r-api-key": geonodeApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📞 TRAFFIC HANDLER: Geonode response status:", geonodeResponse.status);
    console.log("📞 TRAFFIC HANDLER: Geonode response ok:", geonodeResponse.ok);

    if (!geonodeResponse.ok) {
      const errorText = await geonodeResponse.text();
      console.error("❌ TRAFFIC HANDLER: Geonode API error:", {
        status: geonodeResponse.status,
        statusText: geonodeResponse.statusText,
        body: errorText,
      });
      throw new Error(`Geonode API error: ${geonodeResponse.status} - ${errorText}`);
    }

    const geonodeData = await geonodeResponse.json();
    console.log("✅ TRAFFIC HANDLER: Traffic added successfully!");
    console.log("✅ TRAFFIC HANDLER: Geonode response data:", JSON.stringify(geonodeData, null, 2));

    return geonodeData;
  } catch (error) {
    console.error("💥 TRAFFIC HANDLER: Error adding traffic to user:", error);
    console.error("💥 TRAFFIC HANDLER: Error stack:", error instanceof Error ? error.stack : "No stack available");
    throw error;
  }
}
