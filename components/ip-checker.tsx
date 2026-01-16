'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, Shield, Wifi, Loader2 } from 'lucide-react';

interface IPCheckResult {
  status: string;
  [key: string]: {
    asn?: string;
    provider?: string;
    country?: string;
    isocode?: string;
    city?: string;
    region?: string;
    latitude?: string;
    longitude?: string;
    proxy?: string;
    type?: string;
    risk?: number;
  } | string;
}

export default function IPChecker() {
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IPCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkIP = async (ip?: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let targetIP = '';
      
      if (ip !== undefined) {
        targetIP = ip;
      } else {
        targetIP = ipAddress;
      }
      
      const url = targetIP && targetIP.trim() !== ''
        ? `/api/check-ip?ip=${encodeURIComponent(targetIP)}`
        : `/api/check-ip`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok') {
        setResult(data);
      } else if (data.status === 'error') {
        setError(data.message || 'Failed to check IP');
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      setError('Failed to check IP. Please try again.');
      console.error('IP check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIPData = () => {
    if (!result) return null;
    const ipKey = Object.keys(result).find((key) => key !== 'status');
    return ipKey ? { ip: ipKey, ...result[ipKey] } : null;
  };

  const ipData = getIPData();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-600" />
          IP Address Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter IP address (leave empty to check your IP)"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkIP()}
            disabled={loading}
          />
          <Button onClick={() => checkIP()} disabled={loading} className="min-w-[100px]">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking
              </>
            ) : (
              'Check IP'
            )}
          </Button>
        </div>

        {/* Note for localhost */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> "Check My IP" may not work correctly on localhost. For best results, enter a specific IP address or deploy to production.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {ipData && (
          <div className="space-y-4">
            {/* IP Address */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">IP Address</p>
                  <code className="text-2xl font-bold text-blue-600">{ipData.ip}</code>
                </div>
                {ipData.proxy === 'yes' && (
                  <Badge variant="destructive" className="text-sm">
                    Proxy Detected
                  </Badge>
                )}
                {ipData.proxy === 'no' && (
                  <Badge variant="default" className="text-sm bg-green-600">
                    Direct Connection
                  </Badge>
                )}
              </div>
            </div>

            {/* Location Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Location</p>
                    <div className="space-y-1">
                      {ipData.city && (
                        <p className="text-sm font-medium">
                          {ipData.city}, {ipData.region}
                        </p>
                      )}
                      {ipData.country && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {ipData.country} ({ipData.isocode})
                        </p>
                      )}
                      {ipData.latitude && ipData.longitude && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {ipData.latitude}, {ipData.longitude}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <div className="flex items-start gap-3">
                  <Wifi className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Provider</p>
                    <div className="space-y-1">
                      {ipData.provider && (
                        <p className="text-sm font-medium">{ipData.provider}</p>
                      )}
                      {ipData.asn && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">ASN: {ipData.asn}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            {(ipData.type || ipData.risk !== undefined) && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Security Analysis</p>
                    <div className="grid grid-cols-2 gap-4">
                      {ipData.type && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Connection Type</p>
                          <Badge variant="outline" className="text-sm">
                            {ipData.type.toUpperCase()}
                          </Badge>
                        </div>
                      )}
                      {ipData.risk !== undefined && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Risk Score</p>
                          <Badge
                            variant={ipData.risk > 50 ? 'destructive' : 'default'}
                            className={ipData.risk > 50 ? '' : 'bg-green-600'}>
                            {ipData.risk}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setIpAddress('');
              checkIP('');
            }} 
            disabled={loading}>
            Check My IP
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIpAddress('8.8.8.8');
              checkIP('8.8.8.8');
            }}
            disabled={loading}>
            Test with 8.8.8.8
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIpAddress('1.1.1.1');
              checkIP('1.1.1.1');
            }}
            disabled={loading}>
            Test with 1.1.1.1
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
