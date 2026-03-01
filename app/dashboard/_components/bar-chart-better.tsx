'use client';

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface PeriodData {
  periodStart: string;
  totalRequests: number;
  successfulRequests: number;
  bandwidthBytes: number;
  failedRequests: number;
  successRate: number;
}

interface PerPeriodResponse {
  dateFrom: string;
  dateTo: string;
  total: number;
  documents: PeriodData[];
}

interface BarChartBetterProps {
  username?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function BarChartBetter({
  username,
  dateFrom,
  dateTo,
}: BarChartBetterProps) {
  const [data, setData] = useState<PerPeriodResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!username || !dateFrom || !dateTo) {
        console.log('⚠️ [BAR CHART] Missing required params:', {
          username,
          dateFrom,
          dateTo,
        });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const url = `/api/geonode/statistics/per-period?dateFrom=${dateFrom}&dateTo=${dateTo}&subUserFilter=${username}`;
        console.log('📊 [BAR CHART] Fetching:', url);

        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: 'Unknown error' }));
          throw new Error(
            errorData.error || `HTTP ${response.status}: Failed to fetch data`
          );
        }

        const result = await response.json();
        console.log('✅ [BAR CHART] Data received:', result);
        setData(result);
      } catch (err) {
        console.error('💥 [BAR CHART] Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, dateFrom, dateTo]);

  const formatBytes = (bytes: number | undefined): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1000; // Use decimal units to match gauge chart
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - new Date(dateFrom || '').getTime()) / (1000 * 60 * 60);

    if (diffInHours <= 1) {
      // Show minutes for 1 hour range
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours <= 48) {
      // Show hours for up to 2 days
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      // Show date for longer ranges
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const chartData =
    data?.documents.map((doc) => ({
      period: formatDate(doc.periodStart),
      bandwidth: doc.bandwidthBytes / (1024 * 1024), // Convert to MB
      requests: doc.totalRequests,
      successRate: doc.successRate,
    })) || [];

  const totalBandwidth = data?.documents.reduce((sum, doc) => sum + doc.bandwidthBytes, 0);
  const totalRequests = data?.documents.reduce((sum, doc) => sum + doc.totalRequests, 0);

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-[300px] w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Over Time</CardTitle>
        <CardDescription>
          {data
            ? `${formatDate(data.dateFrom)} - ${formatDate(data.dateTo)}`
            : 'Loading...'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <LoadingSkeleton />}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 font-medium">Error loading chart data</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        )}
        {!loading && !error && chartData.length === 0 && (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            No data available for the selected period
          </div>
        )}
        {!loading && !error && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-xs"
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)} GB`;
                  }
                  return `${value.toFixed(0)} MB`;
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground text-xs">
                              Period
                            </span>
                            <span className="font-bold text-xs">
                              {payload[0].payload.period}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground text-xs">
                              Bandwidth
                            </span>
                            <span className="font-bold text-xs">
                              {payload[0].payload.bandwidth.toFixed(2)} MB
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground text-xs">
                              Requests
                            </span>
                            <span className="font-bold text-xs">
                              {payload[0].payload.requests}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground text-xs">
                              Success Rate
                            </span>
                            <span className="font-bold text-xs">
                              {payload[0].payload.successRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="bandwidth"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      {!loading && !error && data && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Total: {formatBytes(totalBandwidth)} bandwidth,{' '}
            {(totalRequests ?? 0).toLocaleString()} requests
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing traffic statistics for the selected period
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
