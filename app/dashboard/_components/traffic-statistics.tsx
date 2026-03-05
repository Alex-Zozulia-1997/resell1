'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, TrendingUp, Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface StatisticsDocument {
  subUserId: string;
  host: string;
  country: string;
  totalRequests: number;
  successfulRequests: number;
  avgLatency: number;
  avgDuration: number;
  bandwidthBytes: number;
  failedRequests: number;
  successRate: number;
  email: string;
}

interface StatisticsResponse {
  dateFrom: string;
  dateTo: string;
  total: number;
  documents: StatisticsDocument[];
}

type TimeRange = '1h' | '24h' | '7d' | '90d' | 'custom';

interface TrafficStatisticsProps {
  username?: string;
  onDateRangeChange?: (dateFrom: string, dateTo: string) => void;
}

export default function TrafficStatistics({ username, onDateRangeChange }: TrafficStatisticsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [customDateFrom, setCustomDateFrom] = useState<Date>();
  const [customDateTo, setCustomDateTo] = useState<Date>();
  const [data, setData] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDateRange = () => {
    const now = new Date();
    const dateTo = now.toISOString();
    let dateFrom: string;

    switch (timeRange) {
      case '1h':
        dateFrom = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
        break;
      case '24h':
        dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case '7d':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '90d':
        dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case 'custom':
        dateFrom = customDateFrom?.toISOString() || dateTo;
        break;
      default:
        dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }

    return { dateFrom, dateTo: timeRange === 'custom' && customDateTo ? customDateTo.toISOString() : dateTo };
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      // console.log('🔍 [CLIENT] TrafficStatistics - Username:', username);
      
      if (!username) {

        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { dateFrom, dateTo } = getDateRange();
        
        const url = `/api/geonode/statistics?dateFrom=${dateFrom}&dateTo=${dateTo}&subUserFilter=${username}&limit=100&offset=0`;
        
        // console.log('📤 [CLIENT] Fetching statistics:', { 
        //   dateFrom, 
        //   dateTo, 
        //   username,
        //   fullUrl: url 
        // });
        
        const response = await fetch(url);

        // console.log('📥 [CLIENT] Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('❌ [CLIENT] Response not OK:', errorData);
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch statistics`);
        }

        const result = await response.json();
        // console.log('✅ [CLIENT] Statistics result:', {
        //   total: result.total,
        //   documentsCount: result.documents?.length,
        //   fullData: result
        // });
        setData(result);
      } catch (err) {
        console.error('💥 [CLIENT] Error fetching statistics:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [username, timeRange, customDateFrom, customDateTo]);

  // Notify parent of date range changes separately
  useEffect(() => {
    if (onDateRangeChange) {
      const { dateFrom, dateTo } = getDateRange();
      onDateRangeChange(dateFrom, dateTo);
    }
  }, [timeRange, customDateFrom, customDateTo]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const totalBandwidth = data?.documents.reduce((sum, doc) => sum + doc.bandwidthBytes, 0) || 0;
  const totalRequests = data?.documents.reduce((sum, doc) => sum + doc.totalRequests, 0) || 0;
  const avgSuccessRate = data?.documents.length
    ? data.documents.reduce((sum, doc) => sum + doc.successRate, 0) / data.documents.length
    : 0;

  const topHosts = data?.documents.sort((a, b) => b.bandwidthBytes - a.bandwidthBytes).slice(0, 10) || [];

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div>
        <Skeleton className="h-6 w-48 mb-3" />
        <div className="overflow-x-auto">
          <div className="w-full">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-t-lg p-3 flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Traffic Statistics
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={timeRange === '1h' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('1h')}
              >
                1 Hour
              </Button>
              <Button
                variant={timeRange === '24h' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('24h')}
              >
                24 Hours
              </Button>
              <Button
                variant={timeRange === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('7d')}
              >
                7 Days
              </Button>
              <Button
                variant={timeRange === '90d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('90d')}
              >
                90 Days
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={timeRange === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    className={cn('justify-start text-left font-normal')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Custom
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="end">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">From</label>
                      <Calendar
                        mode="single"
                        selected={customDateFrom}
                        onSelect={(date) => {
                          setCustomDateFrom(date);
                          setTimeRange('custom');
                        }}
                        initialFocus
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">To</label>
                      <Calendar
                        mode="single"
                        selected={customDateTo}
                        onSelect={(date) => {
                          setCustomDateTo(date);
                          setTimeRange('custom');
                        }}
                        initialFocus
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <LoadingSkeleton />}
          {error && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-500 font-medium">Error loading statistics</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{error}</p>
            </div>
          )}
          {!loading && !error && !data && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No data available</p>
            </div>
          )}
          {!loading && !error && data && data.documents && data.documents.length === 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No traffic data for the selected period</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try selecting a different time range</p>
            </div>
          )}
          {!loading && !error && data && data.documents && data.documents.length > 0 && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Used Traffic</p>
                      <p className="text-2xl font-bold">{formatBytes(totalBandwidth)}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
                      <p className="text-2xl font-bold">{totalRequests.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                      <p className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Hosts Table */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Top Targets by Traffic</h3>
                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="text-left p-3 rounded-tl-lg">Host</th>
                        <th className="text-right p-3">Requests</th>
                        <th className="text-right p-3">Bandwidth</th>
                        <th className="text-right p-3">Success Rate</th>
                        <th className="text-right p-3 rounded-tr-lg">Avg Latency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topHosts.map((host, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="p-3 font-medium">{host.host}</td>
                          <td className="text-right p-3">{host.totalRequests.toLocaleString()}</td>
                          <td className="text-right p-3">{formatBytes(host.bandwidthBytes)}</td>
                          <td className="text-right p-3">
                            <span className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              host.successRate >= 95 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              host.successRate >= 80 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            )}>
                              {host.successRate.toFixed(1)}%
                            </span>
                          </td>
                          <td className="text-right p-3">{host.avgLatency}ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
