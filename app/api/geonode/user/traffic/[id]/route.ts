import { NextRequest, NextResponse } from 'next/server';

export async function GET(
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
    console.log("🔍 TRAFFIC API: Fetching traffic data for user:", subuserId);
    
    const response = await fetch(
      `https://app-api.geonode.com/api/reseller/user/traffic/${subuserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'r-api-key': apiKey,
        },
      }
    );

    console.log("📞 TRAFFIC API: Geonode response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ TRAFFIC API: Geonode API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return NextResponse.json(
        { error: 'Failed to fetch traffic data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ TRAFFIC API: Traffic data received:", {
      usageBandwidth: data.data?.usageBandwidth,
      trafficLimitInBytes: data.data?.trafficLimitInBytes
    });
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
