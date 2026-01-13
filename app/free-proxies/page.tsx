'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const Logo = ({ textSize = 'text-xl', roundness = 'rounded-lg' }) => {
  return (
    <div className={`flex items-center justify-center w-auto bg-gray-200 dark:bg-gray-800 ${roundness} pl-2 pr-1 py-1`}>
      <span className={`${textSize} font-bold text-gray-100 bg-gray-900 dark:bg-white dark:text-gray-900 rounded pl-1 pr-[2px] tracking-widest`}>
        IP
      </span>
      <span className={`${textSize} font-bold text-gray-800 dark:text-gray-200 pl-[2px]`}>
        den
      </span>
    </div>
  );
};

interface Proxy {
  _id: string;
  ip: string;
  port: string;
  protocols: string[];
  country: string;
  city: string;
  anonymityLevel: string;
  speed: number;
  upTime: number;
  lastChecked: number;
  latency: number;
  responseTime: number;
  google: boolean;
  isp: string;
}

export default function FreeProxies() {
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterProtocol, setFilterProtocol] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchProxies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://proxylist.geonode.com/api/proxy-list?limit=50&page=${page}&sort_by=lastChecked&sort_type=desc`
      );
      const data = await response.json();
      setProxies(data.data);
      setTotalCount(data.total);
    } catch (error) {
      console.error('Error fetching proxies:', error);
      toast.error('Failed to fetch proxies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProxies();
  }, [page]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getCountries = () => {
    const countries = new Set(proxies.map((p) => p.country));
    return Array.from(countries).sort();
  };

  const getProtocols = () => {
    const protocols = new Set(proxies.flatMap((p) => p.protocols));
    return Array.from(protocols).sort();
  };

  const filteredProxies = proxies.filter((proxy) => {
    const matchesCountry = filterCountry === 'all' || proxy.country === filterCountry;
    const matchesProtocol = filterProtocol === 'all' || proxy.protocols.includes(filterProtocol);
    const matchesSearch = searchTerm === '' || 
      proxy.ip.includes(searchTerm) || 
      proxy.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCountry && matchesProtocol && matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ['IP', 'Port', 'Protocol', 'Country', 'City', 'Anonymity', 'Speed', 'Uptime'];
    const rows = filteredProxies.map(p => [
      p.ip,
      p.port,
      p.protocols.join(','),
      p.country,
      p.city,
      p.anonymityLevel,
      p.speed,
      p.upTime.toFixed(2)
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proxies.csv';
    a.click();
    toast.success('Exported to CSV!');
  };

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'CA': '🇨🇦',
      'JP': '🇯🇵', 'AU': '🇦🇺', 'BR': '🇧🇷', 'RU': '🇷🇺', 'NL': '🇳🇱',
      'CO': '🇨🇴', 'SG': '🇸🇬', 'BZ': '🇧🇿',
    };
    return flags[countryCode] || '🌍';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Logo textSize="text-3xl" roundness="rounded-lg" />
            <div>
              <h1 className="text-4xl font-bold">Free Proxy List</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Fresh, updated proxies from around the world • Updated every minute
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{totalCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Proxies</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{filteredProxies.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Filtered Results</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-600">{getCountries().length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-orange-600">{getProtocols().length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Protocols</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search by IP or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {getCountries().map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterProtocol} onValueChange={setFilterProtocol}>
                <SelectTrigger>
                  <SelectValue placeholder="All Protocols" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Protocols</SelectItem>
                  {getProtocols().map((protocol) => (
                    <SelectItem key={protocol} value={protocol}>
                      {protocol.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={fetchProxies} variant="outline" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={exportToCSV} variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proxy List */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">IP:Port</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Protocol</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Anonymity</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Speed</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Uptime</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-800">
                    {filteredProxies.map((proxy) => (
                      <tr key={proxy._id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <td className="px-6 py-4">
                          <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {proxy.ip}:{proxy.port}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {proxy.protocols.map((protocol) => (
                              <Badge key={protocol} variant="secondary">
                                {protocol.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getCountryFlag(proxy.country)}</span>
                            <div>
                              <div className="text-sm font-medium">{proxy.city}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{proxy.country}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={proxy.anonymityLevel === 'elite' ? 'default' : 'outline'}>
                            {proxy.anonymityLevel}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min((proxy.speed / 1000) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {proxy.responseTime}ms
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${proxy.upTime > 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {proxy.upTime.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(`${proxy.ip}:${proxy.port}`)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          <Button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            variant="outline">
            Previous
          </Button>
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page}
            </span>
          </div>
          <Button
            onClick={() => setPage(page + 1)}
            variant="outline">
            Next
          </Button>
        </div>

        {/* CTA */}
        <Card className="mt-8 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Need Premium Proxies?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get access to 195+ countries, 99.9% uptime, and dedicated support
              </p>
              <Link href="/#pricing">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  View Premium Plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
