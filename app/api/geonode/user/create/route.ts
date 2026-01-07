import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const apiKey = 'geonode.A^ImqMeuTJylnBcp$fLZzfIeohIM!jucRjQB';

  console.log('API Key from env:', process.env.GEONODE_API_KEY);
  console.log('Using API Key:', apiKey);
  console.log('API Key length:', apiKey.length);

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    
    console.log('Request body:', body);
    
    // Update serviceType format to uppercase with hyphen
    if (body.serviceType) {
      body.serviceType = body.serviceType.toUpperCase().replace('_', '-');
    }

    const response = await fetch(
      'https://app-api.geonode.com/api/reseller/user/create',
      {
        method: 'POST',
        headers: {
          'r-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return NextResponse.json(
        { error: 'Failed to create user', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
