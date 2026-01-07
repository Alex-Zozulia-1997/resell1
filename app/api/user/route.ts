import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://exunxrckgdmnawgtjdwj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dW54cmNrZ2RtbmF3Z3RqZHdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5MjQwNSwiZXhwIjoyMDc5NTY4NDA1fQ.vpNYa2UPWt7cwcp2Ur2Qx6gf-DGChBzzNAHJv7AJ2So'
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  console.log('Fetching user for email:', email);
  console.log('Supabase URL exists:', !!process.env.SUPABASE_URL);
  console.log('Supabase Key exists:', !!process.env.SUPABASE_SERVICE_KEY);

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('user')
      .select('resid, email')
      .eq('email', email)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'User not found', resID: null },
        { status: 404 }
      );
    }

    // Return with consistent casing for frontend
    return NextResponse.json({
      resID: data.resid,
      email: data.email
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
