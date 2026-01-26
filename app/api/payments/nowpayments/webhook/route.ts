import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// Import the same addTrafficToUser function from Stripe webhook
async function addTrafficToUser(email: string, trafficGB: number, supabase: any) {
  try {
    console.log("📊 CRYPTO TRAFFIC HANDLER: Starting traffic addition process");
    console.log("📊 CRYPTO TRAFFIC HANDLER: Email:", email);
    console.log("📊 CRYPTO TRAFFIC HANDLER: Traffic to add:", trafficGB, "GB");

    // 1. Get user's resID from database
    console.log("📊 CRYPTO TRAFFIC HANDLER: Looking up user resID in database");
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("resid, email")
      .eq("email", email)
      .single();

    console.log("📊 CRYPTO TRAFFIC HANDLER: Database query result:", {
      userFound: !!user,
      hasResID: !!user?.resid,
      error: userError
    });

    if (userError || !user?.resid) {
      console.error("❌ CRYPTO TRAFFIC HANDLER: User lookup failed:", userError);
      console.error("❌ CRYPTO TRAFFIC HANDLER: User data:", user);
      throw new Error(`No Geonode resID found for user: ${email}`);
    }

    const resID = user.resid;
    console.log("👤 CRYPTO TRAFFIC HANDLER: Found user resID:", resID);

    // 2. Convert GB to MB for Geonode API
    const trafficMB = trafficGB * 1000;
    console.log("🔄 CRYPTO TRAFFIC HANDLER: Converting", trafficGB, "GB to", trafficMB, "MB");

    // 3. Get current traffic limit first
    const geonodeApiKey = process.env.GEONODE_API_KEY;
    if (!geonodeApiKey) {
      console.error("❌ CRYPTO TRAFFIC HANDLER: GEONODE_API_KEY not configured");
      throw new Error("GEONODE_API_KEY not configured");
    }
    console.log("✅ CRYPTO TRAFFIC HANDLER: Geonode API key is configured");

    console.log("🔍 CRYPTO TRAFFIC HANDLER: Getting current traffic limit from Geonode...");
    const getCurrentTrafficUrl = `https://app-api.geonode.com/api/reseller/user/traffic/${resID}`;
    
    const getCurrentTrafficResponse = await fetch(getCurrentTrafficUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "r-api-key": geonodeApiKey,
      },
    });

    console.log("📞 CRYPTO TRAFFIC HANDLER: Get traffic response status:", getCurrentTrafficResponse.status);

    if (!getCurrentTrafficResponse.ok) {
      const errorText = await getCurrentTrafficResponse.text();
      console.error("❌ CRYPTO TRAFFIC HANDLER: Failed to get current traffic:", {
        status: getCurrentTrafficResponse.status,
        statusText: getCurrentTrafficResponse.statusText,
        body: errorText,
      });
      throw new Error(`Failed to get current traffic: ${getCurrentTrafficResponse.status} - ${errorText}`);
    }

    const currentTrafficData = await getCurrentTrafficResponse.json();
    console.log("📊 CRYPTO TRAFFIC HANDLER: Current traffic data:", JSON.stringify(currentTrafficData, null, 2));

    // Extract current limit in bytes and convert to MB (using 1000*1000, not 1024*1024)
    const currentLimitBytes = currentTrafficData.data.trafficLimitInBytes;
    const currentLimitMB = Math.round(currentLimitBytes / (1000 * 1000)); // Convert bytes to MB (Geonode format)
    const usageMB = Math.round(currentTrafficData.data.usageBandwidth / (1000 * 1000)); // Convert usage to MB
    
    console.log("📊 CRYPTO TRAFFIC HANDLER: Current traffic status:", {
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
    console.log("🔢 CRYPTO TRAFFIC HANDLER: New total limit will be:", newTotalLimitMB, "MB (", (newTotalLimitMB / 1000), "GB)");

    // 4. Add traffic using Geonode API
    const addTrafficUrl = `https://app-api.geonode.com/api/reseller/user/${resID}`;
    const requestBody = {
      traffic_limit: newTotalLimitMB,
    };

    console.log("🚀 CRYPTO TRAFFIC HANDLER: Preparing Geonode API request:", {
      url: addTrafficUrl,
      body: requestBody,
      previousLimitMB: currentLimitMB,
      addingMB: trafficMB,
      newTotalLimitMB,
    });

    console.log("🚀 CRYPTO TRAFFIC HANDLER: Sending request to Geonode API...");
    const geonodeResponse = await fetch(addTrafficUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "r-api-key": geonodeApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📞 CRYPTO TRAFFIC HANDLER: Geonode response status:", geonodeResponse.status);
    console.log("📞 CRYPTO TRAFFIC HANDLER: Geonode response ok:", geonodeResponse.ok);

    if (!geonodeResponse.ok) {
      const errorText = await geonodeResponse.text();
      console.error("❌ CRYPTO TRAFFIC HANDLER: Geonode API error:", {
        status: geonodeResponse.status,
        statusText: geonodeResponse.statusText,
        body: errorText,
      });
      throw new Error(`Geonode API error: ${geonodeResponse.status} - ${errorText}`);
    }

    const geonodeData = await geonodeResponse.json();
    console.log("✅ CRYPTO TRAFFIC HANDLER: Traffic added successfully!");
    console.log("✅ CRYPTO TRAFFIC HANDLER: Geonode response data:", JSON.stringify(geonodeData, null, 2));

    return geonodeData;
  } catch (error) {
    console.error("💥 CRYPTO TRAFFIC HANDLER: Error adding traffic to user:", error);
    console.error("💥 CRYPTO TRAFFIC HANDLER: Error stack:", error instanceof Error ? error.stack : "No stack available");
    throw error;
  }
}

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
    console.log("🔔 NOWPAYMENTS WEBHOOK: Received NOWPayments webhook request");
    
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
    
    if (!ipnSecret) {
      console.error('❌ NOWPAYMENTS WEBHOOK: NOWPayments IPN secret not configured');
      return NextResponse.json({ error: 'IPN not configured' }, { status: 500 });
    }

    // Get the raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-nowpayments-sig');

    console.log("🔔 NOWPAYMENTS WEBHOOK: Signature present:", !!signature);

    if (!signature) {
      console.error('❌ NOWPAYMENTS WEBHOOK: Missing NOWPayments signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify signature
    if (!verifyIPNSignature(rawBody, signature, ipnSecret)) {
      console.error('❌ NOWPAYMENTS WEBHOOK: Invalid NOWPayments signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const data = JSON.parse(rawBody);
    
    console.log('💰 NOWPAYMENTS WEBHOOK: IPN received:', {
      payment_id: data.payment_id,
      payment_status: data.payment_status,
      order_id: data.order_id,
      price_amount: data.price_amount,
      price_currency: data.price_currency
    });

    // Initialize Supabase client
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

    // Handle different payment statuses
    console.log("🎯 NOWPAYMENTS WEBHOOK: Processing payment status:", data.payment_status);
    
    switch (data.payment_status) {
      case 'finished':
      case 'confirmed':
        // Payment successful - add traffic to user account
        console.log("✅ NOWPAYMENTS WEBHOOK: Payment successful, processing traffic addition");
        await handleSuccessfulPayment(data, supabase);
        break;
      
      case 'partially_paid':
        // Partially paid - you might want to handle this
        console.log('⚠️ NOWPAYMENTS WEBHOOK: Payment partially paid:', data.payment_id);
        break;
      
      case 'failed':
      case 'expired':
      case 'refunded':
        // Payment failed or cancelled
        console.log("❌ NOWPAYMENTS WEBHOOK: Payment failed/expired/refunded:", data.payment_status);
        await handleFailedPayment(data, supabase);
        break;
      
      case 'waiting':
      case 'sending':
        // Payment in progress - just log it
        console.log('⏳ NOWPAYMENTS WEBHOOK: Payment in progress:', data.payment_id, data.payment_status);
        break;
      
      default:
        console.log('❓ NOWPAYMENTS WEBHOOK: Unknown payment status:', data.payment_status);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('💥 NOWPAYMENTS WEBHOOK: Error processing NOWPayments IPN:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(data: any, supabase: any) {
  try {
    console.log("💰 NOWPAYMENTS SUCCESS: Processing successful crypto payment");
    
    // Extract user info from order_id (format: traffic_userId_timestamp)
    const orderId = data.order_id;
    const match = orderId.match(/traffic_(.+?)_\d+/);
    
    if (!match) {
      console.error('❌ NOWPAYMENTS SUCCESS: Invalid order ID format:', orderId);
      return;
    }

    const userId = match[1];
    const amountPaid = parseFloat(data.price_amount);
    
    console.log("💰 NOWPAYMENTS SUCCESS: Payment details:", {
      userId,
      amountPaid,
      currency: data.price_currency,
      paymentId: data.payment_id
    });
    
    // Calculate GB from amount (based on $0.80/GB pricing)
    const trafficGB = Math.floor(amountPaid / 0.8);
    console.log("💰 NOWPAYMENTS SUCCESS: Calculated traffic:", trafficGB, "GB for $", amountPaid);

    // Get user email from database
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("email")
      .eq("user_id", userId)
      .single();

    if (userError || !user?.email) {
      console.error("❌ NOWPAYMENTS SUCCESS: Failed to get user email:", userError);
      throw new Error(`No user found for ID: ${userId}`);
    }

    const customerEmail = user.email;
    console.log("💰 NOWPAYMENTS SUCCESS: Found user email:", customerEmail);

    // Add traffic to user account using the same function as Stripe
    try {
      await addTrafficToUser(customerEmail, trafficGB, supabase);
      console.log("✅ NOWPAYMENTS SUCCESS: Traffic added successfully");
    } catch (error) {
      console.error("❌ NOWPAYMENTS SUCCESS: Failed to add traffic:", error);
      throw error;
    }

    // Record payment in database
    console.log("💾 NOWPAYMENTS SUCCESS: Recording payment in database");
    try {
      const paymentData = {
        user_id: user?.id,
        email: customerEmail,
        amount: Math.round(amountPaid * 100), // Convert to cents for consistency
        currency: data.price_currency,
        status: data.payment_status,
        stripe_session_id: data.payment_id, // Using same column for NOWPayments ID
        metadata: {
          userId,
          trafficGB: trafficGB.toString(),
          type: "traffic_purchase",
          payment_method: "crypto",
          crypto_currency: data.pay_currency,
        },
      };

      console.log("💾 NOWPAYMENTS SUCCESS: Payment data to insert:", JSON.stringify(paymentData, null, 2));

      const { error: paymentsError } = await supabase.from("payments").insert([paymentData]);

      if (paymentsError) {
        console.error("❌ NOWPAYMENTS SUCCESS: Error inserting payment:", paymentsError);
      } else {
        console.log("✅ NOWPAYMENTS SUCCESS: Payment recorded in database");
      }
    } catch (error) {
      console.error("❌ NOWPAYMENTS SUCCESS: Error recording payment:", error);
    }

    console.log(`✅ NOWPAYMENTS SUCCESS: Successfully processed ${trafficGB}GB for user ${userId}`);
  } catch (error) {
    console.error('💥 NOWPAYMENTS SUCCESS: Error handling successful payment:', error);
    throw error;
  }
}

async function handleFailedPayment(data: any, supabase: any) {
  try {
    console.log('❌ NOWPAYMENTS FAILED: Processing failed payment:', {
      paymentId: data.payment_id,
      status: data.payment_status,
      orderId: data.order_id
    });
    
    // You could log failed payments in database here if needed
    // For now, just log it
  } catch (error) {
    console.error('💥 NOWPAYMENTS FAILED: Error handling failed payment:', error);
  }
}
