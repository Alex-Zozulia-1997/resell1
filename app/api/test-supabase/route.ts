import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  // Hardcoded values to test
  const hardcodedUrl = 'https://exunxrckgdmnawgtjdwj.supabase.co';
  const hardcodedKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dW54cmNrZ2RtbmF3Z3RqZHdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5MjQwNSwiZXhwIjoyMDc5NTY4NDA1fQ.vpNYa2UPWt7cwcp2Ur2Qx6gf-DGChBzzNAHJv7AJ2So';

  console.log('=== Environment Variables ===');
  console.log('URL from env:', supabaseUrl);
  console.log('Key from env:', supabaseKey?.substring(0, 50) + '...');
  console.log('URL matches:', supabaseUrl === hardcodedUrl);
  console.log('Key matches:', supabaseKey === hardcodedKey);

  try {
    // Try with hardcoded values first
    const supabase = createClient(hardcodedUrl, hardcodedKey);

    const { data, error, count } = await supabase
      .from('user')
      .select('*', { count: 'exact', head: false })
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Supabase query failed',
        details: error,
        usingHardcoded: true,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful with hardcoded values',
      tableExists: true,
      recordCount: count,
      sampleData: data,
    });
  } catch (error) {
    console.error('Supabase test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
