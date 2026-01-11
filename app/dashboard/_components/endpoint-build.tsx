'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import countries from 'world-countries';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

const countryOptions = countries.map((country) => ({
  value: country.cca2.toLowerCase(),
  label: country.name.common,
}));

const protocolOptions = [
  { value: 'http', label: 'HTTP' },
  { value: 'https', label: 'HTTPS' },
  { value: 'socks5', label: 'SOCKS5' },
];

const typeOptions = [
  { value: 'sticky', label: 'Sticky (Session)' },
  { value: 'rotating', label: 'Rotating (Request)' },
];

interface EndpointBuildProps {
  userData?: any;
}

// Generate random session ID
const generateSessionId = (length: number = 12): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function EndpointBuild({ userData }: EndpointBuildProps) {
  const [country, setCountry] = useState<any>({ value: 'us', label: 'United States' });
  const [state, setState] = useState<string>('georgia');
  const [city, setCity] = useState<string>('atlanta');
  const [proxyType, setProxyType] = useState<any>(typeOptions[1]);
  const [protocol, setProtocol] = useState<any>(protocolOptions[0]);
  const [port, setPort] = useState<any>(null);
  const [sessionLifetime, setSessionLifetime] = useState<number>(3);
  const [sessionId, setSessionId] = useState<string>(generateSessionId());
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const proxyHost = 'proxy.ipden.io';

  // Dynamically determine port based on protocol and type
  const getPort = () => {
    const isHttp = protocol.value === 'http' || protocol.value === 'https';
    const isSocks5 = protocol.value === 'socks5';
    const isSticky = proxyType.value === 'sticky';

    if (isHttp && isSticky) {
      return 10000;
    } else if (isHttp && !isSticky) {
      return 9000;
    } else if (isSocks5 && isSticky) {
      return 12000;
    } else if (isSocks5 && !isSticky) {
      return 11000;
    }

    return 9000;
  };

  // Update port and regenerate session ID when protocol or type changes
  useEffect(() => {
    const currentPort = getPort();
    setPort(currentPort);
    if (proxyType.value === 'sticky') {
      setSessionId(generateSessionId());
    }
  }, [protocol, proxyType]); // getPort is not a dependency because it only uses protocol and proxyType

  // Extract username and password from userData when it changes
  useEffect(() => {
    if (userData) {
      const extractedUsername = userData?.authorization?.username || userData?.sub_user_name || userData?.username || '';
      const extractedPassword = userData?.authorization?.password || userData?.sub_user_password || userData?.password || '';
      
      console.log('EndpointBuild - userData updated:', userData);
      console.log('EndpointBuild - extracted username:', extractedUsername);
      console.log('EndpointBuild - extracted password:', extractedPassword);
      
      setUsername(extractedUsername);
      setPassword(extractedPassword);
    }
  }, [userData]);

  // Construct username with parameters
  const constructUsername = () => {
    if (!username) return 'username';
    
    let params: string[] = [username];
    
    if (country) {
      params.push(`country-${country.value}`);
    }
    
    if (state) {
      params.push(`state-${state.toLowerCase().replace(/\s+/g, '')}`);
    }
    
    if (city) {
      params.push(`city-${city.toLowerCase().replace(/\s+/g, '')}`);
    }
    
    // Only add session parameters if sticky/session type is selected
    if (proxyType.value === 'sticky') {
      params.push(`sessionId-${sessionId}`);
      params.push(`lifetime-${sessionLifetime}`);
    }
    
    return params.join('-');
  };

  const fullUsername = constructUsername();
  const fullPassword = password || 'password';
  const proxyUrl = port ? `${protocol.value}://${fullUsername}:${fullPassword}@${proxyHost}:${port}` : '';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Generate cURL test command
  const generateCurlCommand = () => {
    if (!proxyUrl) return '';
    return `curl -x ${protocol.value}://${fullUsername}:${fullPassword}@${proxyHost}:${port} http://ip-api.com`;
  };

  const curlCommand = generateCurlCommand();

  const handleLifetimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 1440) {
      setSessionLifetime(value);
    }
  };

  const regenerateSessionId = () => {
    setSessionId(generateSessionId());
    toast.success('Session ID regenerated!');
  };

  return (
    <div className="w-full p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Proxy Configuration</CardTitle>
          {!userData && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Loading credentials...
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-48">
              <Select
                options={countryOptions}
                placeholder="Select country"
                isSearchable
                value={country}
                onChange={setCountry}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    minHeight: '42px',
                    height: '42px',
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    height: '42px',
                    padding: '0 8px',
                  }),
                  input: (base) => ({
                    ...base,
                    margin: '0px',
                    color: '#e5e7eb',
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: '42px',
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: '#1f2937',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#374151' : '#1f2937',
                    color: '#e5e7eb',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: '#e5e7eb',
                  }),
                }}
              />
            </div>
            
            <input
              type="text"
              placeholder="State (optional)"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-48 h-[42px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <input
              type="text"
              placeholder="City (optional)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-48 h-[42px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="w-48">
              <Select
                options={typeOptions}
                placeholder="Select type"
                value={proxyType}
                onChange={setProxyType}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    minHeight: '42px',
                    height: '42px',
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    height: '42px',
                    padding: '0 8px',
                  }),
                  input: (base) => ({
                    ...base,
                    margin: '0px',
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: '42px',
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: '#1f2937',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#374151' : '#1f2937',
                    color: '#e5e7eb',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: '#e5e7eb',
                  }),
                }}
              />
            </div>
            
            <div className="w-48">
              <Select
                options={protocolOptions}
                placeholder="Select protocol"
                value={protocol}
                onChange={setProtocol}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    minHeight: '42px',
                    height: '42px',
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    height: '42px',
                    padding: '0 8px',
                  }),
                  input: (base) => ({
                    ...base,
                    margin: '0px',
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: '42px',
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: '#1f2937',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#374151' : '#1f2937',
                    color: '#e5e7eb',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: '#e5e7eb',
                  }),
                }}
              />
            </div>
            
            {proxyType.value === 'sticky' && (
              <input
                type="number"
                min="1"
                max="1440"
                value={sessionLifetime}
                onChange={handleLifetimeChange}
                placeholder="Lifetime (min)"
                className="w-48 h-[42px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* {proxyType.value === 'sticky' && (
            <div className="mb-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300 font-semibold">Session ID:</p>
                <code className="text-xs text-purple-200">{sessionId}</code>
              </div>
              <button
                onClick={regenerateSessionId}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors">
                Regenerate
              </button>
            </div>
          )} */}

          {/* <div className="mb-4 p-3 bg-blue-900/20 dark:bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300 dark:text-blue-300">
              <strong>Port Auto-Selected:</strong> {port} (HTTP/HTTPS+Session=10000, HTTP/HTTPS+Rotating=9000, SOCKS5+Session=12000, SOCKS5+Rotating=11000)
            </p>
          </div> */}

          {curlCommand && (
            <div className="mb-4">
              <Card className="bg-gray-50 dark:bg-gray-900 border-green-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center justify-between">
                    <span>Test Your Proxy</span>
                    <button
                      onClick={() => copyToClipboard(curlCommand)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors">
                      <Copy size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Run this cURL command in your terminal to test the proxy connection and see your IP address:
                  </p>
                  <code className="block p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 overflow-x-auto font-mono">
                    {curlCommand}
                  </code>
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 rounded-lg">
                    <p className="text-xs text-green-700 dark:text-green-300">
                      <strong>Expected response:</strong> This will return a JSON object with your proxy&apos;s IP address if the connection is successful.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="space-y-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Proxy URL</label>
                <button
                  onClick={() => copyToClipboard(proxyUrl)}
                  disabled={!proxyUrl}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Copy size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <code className="block p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-200 overflow-x-auto">
                {proxyUrl || 'Configure all options to generate URL'}
              </code>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Username</label>
                <button
                  onClick={() => copyToClipboard(fullUsername)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors">
                  <Copy size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <code className="block p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-200 overflow-x-auto">
                {fullUsername}
              </code>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Password</label>
                <code className="block p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-200">
                  {fullPassword}
                </code>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Host</label>
                <code className="block p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-200">
                  {proxyHost}
                </code>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Port</label>
              <code className="block p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-200">
                {port}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
