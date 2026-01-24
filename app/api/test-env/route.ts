import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    clerk: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 15) + '...',
      secretKey: process.env.CLERK_SECRET_KEY?.substring(0, 15) + '...',
      webhookSecret: process.env.CLERK_WEBHOOK_SECRET?.substring(0, 15) + '...',
      webhookSecretFull: process.env.CLERK_WEBHOOK_SECRET, // Full secret for debugging
    },
    supabase: {
      url: process.env.SUPABASE_URL,
      serviceKey: process.env.SUPABASE_SERVICE_KEY?.substring(0, 20) + '...',
      publicKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
    },
    geonode: {
      apiKey: process.env.GEONODE_API_KEY?.substring(0, 20) + '...',
      apiUrl: process.env.GEONODE_API_URL,
    },
    frontend: {
      url: process.env.FRONTEND_URL,
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY?.substring(0, 15) + '...',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 15) + '...',
    },
  };

  // Check which variables are missing
  const missing = [];
  if (!process.env.CLERK_WEBHOOK_SECRET) missing.push('CLERK_WEBHOOK_SECRET');
  if (!process.env.CLERK_SECRET_KEY) missing.push('CLERK_SECRET_KEY');
  if (!process.env.GEONODE_API_KEY) missing.push('GEONODE_API_KEY');
  if (!process.env.SUPABASE_SERVICE_KEY) missing.push('SUPABASE_SERVICE_KEY');

  return NextResponse.json({
    status: 'ok',
    envVars,
    missing,
    nodeEnv: process.env.NODE_ENV,
  });
}
