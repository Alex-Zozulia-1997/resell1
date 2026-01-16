import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ip = searchParams.get('ip');
    const apiKey = '86m940-46828d-u5444g-5f46ey';
    
    console.log('API Route - IP parameter:', ip);
    console.log('API Route - Request headers:', request.headers.get('x-forwarded-for'));
    
    // If ip is null or empty, don't include it in the URL
    const url = ip && ip.trim() !== ''
      ? `https://proxycheck.io/v2/${ip}?key=${apiKey}&vpn=1&asn=1&risk=1`
      : `https://proxycheck.io/v2/?key=${apiKey}&vpn=1&asn=1&risk=1`;
    
    console.log('API Route - Calling URL:', url);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; IPChecker/1.0)',
      }
    });
    
    const data = await response.json();
    
    console.log('API Route - Full response:', JSON.stringify(data, null, 2));

    // Check if the response has an error
    if (data.status === 'error') {
      console.error('API Route - ProxyCheck error:', data.message);
      return NextResponse.json(
        { status: 'error', message: data.message || 'ProxyCheck API error' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('IP check error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to check IP', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
