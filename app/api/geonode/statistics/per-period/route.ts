import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const subUserFilter = searchParams.get('subUserFilter');

  // console.log('📊 Per-Period Statistics API Request:', {
  //   dateFrom,
  //   dateTo,
  //   subUserFilter,
  // });

  if (!dateFrom || !dateTo || !subUserFilter) {
    console.error('❌ Missing required parameters:', { dateFrom, dateTo, subUserFilter });
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  // Calculate granularity based on time range
  const fromDate = new Date(dateFrom);
  const toDate = new Date(dateTo);
  const diffInHours = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60);
  
  let granularity: 'minute' | 'hour' | 'day';
  if (diffInHours <= 1) {
    granularity = 'minute';
  } else if (diffInHours <= 48) {
    granularity = 'hour';
  } else {
    granularity = 'day';
  }

  // console.log('📏 Calculated granularity:', { diffInHours, granularity });

  const apiKey = process.env.GEONODE_API_KEY;
  if (!apiKey) {
    console.error('❌ GEONODE_API_KEY not configured');
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  const url = `https://monitor.geonode.com/statistics/RESIDENTIAL-PREMIUM/per-period?granularity=${granularity}&dateFrom=${dateFrom}&dateTo=${dateTo}&subUserFilter=${subUserFilter}`;

  // console.log('🌐 Geonode Per-Period Request URL:', url);

  try {
    const headers = {
      'Content-Type': 'application/json',
      'r-api-key': apiKey,
    };

    const response = await fetch(url, { headers });

    // console.log('📡 Geonode Per-Period Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Geonode API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Geonode API error: ${response.status}`);
    }

    const data = await response.json();
    // // console.log('✅ Geonode Per-Period Response Data:', {
    //   dateFrom: data.dateFrom,
    //   dateTo: data.dateTo,
    //   total: data.total,
    //   documentsCount: data.documents?.length || 0,
    // });

    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 Error fetching per-period statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
