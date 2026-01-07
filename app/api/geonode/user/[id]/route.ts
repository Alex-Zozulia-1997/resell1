import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: subuserId } = await params;
  const apiKey = 'geonode.A^ImqMeuTJylnBcp$fLZzfIeohIM!jucRjQB';

  console.log('Env var exists:', !!process.env.GEONODE_API_KEY);
  console.log('Using key:', apiKey?.substring(0, 15) + '...');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://app-api.geonode.com/api/reseller/user/${subuserId}`,
      {
        method: 'GET',
        headers: {
          'r-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to fetch user data', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: subuserId } = await params;
  const apiKey = 'geonode.A^ImqMeuTJylnBcp$fLZzfIeohIM!jucRjQB';

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `https://app-api.geonode.com/api/reseller/user/${subuserId}`,
      {
        method: 'PATCH',
        headers: {
          'r-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to update user', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
