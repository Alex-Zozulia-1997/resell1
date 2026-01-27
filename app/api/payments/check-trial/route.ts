import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Get the email from search params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    console.log('🔍 TRIAL CHECK: Checking trial eligibility for email:', email);

    // Initialize Supabase client with service key (no cookies needed)
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        cookies: {},
      }
    );

    // Check if user has any payment of $1.00 (100 cents) which indicates trial usage
    const { data: trialPayments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('email', email)
      .eq('amount', 100) // $1.00 in cents
      .eq('status', 'paid'); // Only count successful payments

    if (error) {
      console.error('❌ TRIAL CHECK: Error checking trial payments:', error);
      return NextResponse.json({ error: 'Failed to check trial eligibility' }, { status: 500 });
    }

    const hasUsedTrial = trialPayments && trialPayments.length > 0;

    console.log('✅ TRIAL CHECK: Trial eligibility result:', {
      email,
      hasUsedTrial,
      trialPaymentsCount: trialPayments?.length || 0
    });

    return NextResponse.json({
      hasUsedTrial,
      trialPaymentsCount: trialPayments?.length || 0
    });

  } catch (error) {
    console.error('💥 TRIAL CHECK: Error in trial check:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}