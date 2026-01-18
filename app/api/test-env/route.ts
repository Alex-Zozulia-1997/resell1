import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    // Clerk
    clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✓ Set' : '✗ Missing',
    clerkSecretKey: process.env.CLERK_SECRET_KEY ? '✓ Set' : '✗ Missing',
    clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET ? '✓ Set' : '✗ Missing',
    
    // Supabase
    supabaseUrl: process.env.SUPABASE_URL ? '✓ Set' : '✗ Missing',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY ? '✓ Set' : '✗ Missing',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing',
    
    // Upstash
    upstashUrl: process.env.UPSTASH_REDIS_REST_URL ? '✓ Set' : '✗ Missing',
    upstashToken: process.env.UPSTASH_REDIS_REST_TOKEN ? '✓ Set' : '✗ Missing',
    
    // Frontend
    frontendUrl: process.env.FRONTEND_URL || '✗ Missing',
    
    // Stripe
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ? '✓ Set' : '✗ Missing',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? '✓ Set' : '✗ Missing',
    stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ? '✓ Set' : '✗ Missing',
    
    // Stripe Price IDs
    stripePriceIdTrial: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TRIAL ? '✓ Set' : '✗ Missing',
    stripePriceId10GB: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_10GB ? '✓ Set' : '✗ Missing',
    stripePriceId30GB: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_30GB ? '✓ Set' : '✗ Missing',
    stripePriceId500GB: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_500GB ? '✓ Set' : '✗ Missing',
    
    // Geonode
    geonodeApiKey: process.env.GEONODE_API_KEY ? '✓ Set' : '✗ Missing',
    geonodeApiUrl: process.env.GEONODE_API_URL || '✗ Missing',
    
    // Proxy
    proxyHost: process.env.NEXT_PUBLIC_PROXY_HOST || '✗ Missing',
    
    // ProxyCheck
    proxycheckApiKey: process.env.PROXYCHECK_API_KEY ? '✓ Set' : '✗ Missing',
    
    // Contact
    contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '✗ Missing',
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '✗ Missing',
    discordUrl: process.env.NEXT_PUBLIC_DISCORD_URL || '✗ Missing',
  };

  console.log('=== Environment Variables Check ===');
  console.log(JSON.stringify(envVars, null, 2));
  console.log('===================================');

  return NextResponse.json({
    status: 'success',
    message: 'Environment variables checked',
    variables: envVars,
  });
}
