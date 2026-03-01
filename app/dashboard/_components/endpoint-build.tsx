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
import { Copy, Download, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => (
  <div className="group relative inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

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

const formatOptions = [
  { value: 'login:password@host:port', label: 'login:password@host:port' },
  { value: 'login:password:host:port', label: 'login:password:host:port' },
  { value: 'protocol://login:password@host:port', label: 'protocol://login:password@host:port' },
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
  const [country, setCountry] = useState<any>(countryOptions.find(c => c.value === 'us') || null);
  const [state, setState] = useState<string>('georgia');
  const [city, setCity] = useState<string>('atlanta');
  const [proxyType, setProxyType] = useState<any>(typeOptions[1]);
  const [protocol, setProtocol] = useState<any>(protocolOptions[0]);
  const [port, setPort] = useState<any>(null);
  const [sessionLifetime, setSessionLifetime] = useState<number>(3);
  const [sessionId, setSessionId] = useState<string>(generateSessionId());
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [format, setFormat] = useState<any>(formatOptions[2]);
  const [quantity, setQuantity] = useState<number>(10);
  const [generatedProxies, setGeneratedProxies] = useState<string[]>([]);

  // Use environment variable with fallback
  const proxyHost = process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.ipden.io';
  // const proxyHost = 'proxy.ipden.io'; // OLD: Hardcoded value

  // Log to verify env var is loaded
  useEffect(() => {
    console.log('EndpointBuild - NEXT_PUBLIC_PROXY_HOST:', process.env.NEXT_PUBLIC_PROXY_HOST);
    console.log('EndpointBuild - Using proxyHost:', proxyHost);
  }, []);

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

  // Auto-generate proxies whenever configuration changes
  useEffect(() => {
    if (!username || !password || !port) {
      setGeneratedProxies([]);
      return;
    }

    const proxies: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const sessionIdForProxy = proxyType.value === 'sticky' ? generateSessionId() : '';
      
      let usernameForProxy = username;
      if (country && country.value) {
        usernameForProxy += `-country-${country.value}`;
      }
      if (state && state.trim()) {
        usernameForProxy += `-state-${state.toLowerCase().replace(/\s+/g, '-')}`;
      }
      if (city && city.trim()) {
        usernameForProxy += `-city-${city.toLowerCase().replace(/\s+/g, '-')}`;
      }
      if (proxyType.value === 'sticky' && sessionIdForProxy) {
        usernameForProxy += `-session-${sessionIdForProxy}`;
        usernameForProxy += `-lifetime-${sessionLifetime}`;
      }

      const proxyString = generateProxyFormat(
        usernameForProxy,
        password,
        proxyHost,
        port,
        protocol.value,
        format.value
      );
      proxies.push(proxyString);
    }

    setGeneratedProxies(proxies);
  }, [username, password, port, quantity, country, state, city, proxyType, protocol, format, sessionLifetime, proxyHost]);

  // Construct username with parameters
  const constructUsername = () => {
    if (!username) return 'username';
    
    let params: string[] = [username];
    
    if (country && country.value) {
      params.push(`country-${country.value}`);
    }
    
    if (state && state.trim()) {
      params.push(`state-${state.toLowerCase().replace(/\s+/g, '-')}`);
    }
    
    if (city && city.trim()) {
      params.push(`city-${city.toLowerCase().replace(/\s+/g, '-')}`);
    }
    
    // Only add session parameters if sticky/session type is selected
    if (proxyType.value === 'sticky') {
      params.push(`session-${sessionId}`);
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

  const generateProxyFormat = (username: string, password: string, host: string, port: number, protocol: string, format: string): string => {
    switch (format) {
      case 'login:password@host:port':
        return `${username}:${password}@${host}:${port}`;
      case 'login:password:host:port':
        return `${username}:${password}:${host}:${port}`;
      case 'protocol://login:password@host:port':
        return `${protocol}://${username}:${password}@${host}:${port}`;
      default:
        return `${protocol}://${username}:${password}@${host}:${port}`;
    }
  };

  const copyProxiesToClipboard = () => {
    if (generatedProxies.length === 0) {
      toast.error('No proxies generated yet');
      return;
    }
    navigator.clipboard.writeText(generatedProxies.join('\n'));
    toast.success(`Copied ${generatedProxies.length} proxy endpoint${generatedProxies.length > 1 ? 's' : ''} to clipboard!`);
  };

  const downloadProxies = () => {
    if (generatedProxies.length === 0) {
      toast.error('No proxies generated yet');
      return;
    }

    const blob = new Blob([generatedProxies.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proxies-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Proxy list downloaded!');
  };

  return (
    <div className="w-full p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Proxy Configuration & Export</CardTitle>
          {!userData && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Loading credentials...
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-48">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Country</label>
                <Tooltip text="Select the country where you want your proxy IP to be located. This determines which country's IP addresses you'll receive.">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <Select
                options={countryOptions}
                placeholder="Select country"
                isSearchable
                isClearable
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
            
            <div className="w-48">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">State</label>
                <Tooltip text="Specify a state or region within the selected country for more precise geolocation. This is optional but helps target specific regions.">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <input
                type="text"
                placeholder="State (optional)"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full h-[42px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="w-48">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">City</label>
                <Tooltip text="Specify a city within the selected state/country for the most precise geolocation targeting. This is optional and provides city-level IP targeting.">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <input
                type="text"
                placeholder="City (optional)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-[42px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="w-48">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Connection Type</label>
                <Tooltip text="Sticky (Session) - maintains the same IP for the duration of the session. Rotating (Request) - changes IP with each request for maximum anonymity.">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
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
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Protocol</label>
                <Tooltip text="HTTP/HTTPS - standard web protocols for most applications. SOCKS5 - more versatile protocol supporting various traffic types and applications.">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
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
              <div className="w-48">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Session Lifetime</label>
                  <Tooltip text="Duration in minutes for how long the same IP address will be maintained in sticky session mode. Range: 1-1440 minutes (24 hours).">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="number"
                  min="1"
                  max="1440"
                  value={sessionLifetime}
                  onChange={handleLifetimeChange}
                  placeholder="Lifetime (min)"
                  className="w-full h-[42px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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

          {/* Proxy List Generator Section - Always Visible */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Export Proxy List
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Format
                </label>
                <Select
                  options={formatOptions}
                  value={format}
                  onChange={setFormat}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: '#1f2937',
                      borderColor: '#374151',
                      minHeight: '42px',
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

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full h-[42px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {generatedProxies.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Generated Proxies ({generatedProxies.length})
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={copyProxiesToClipboard}
                      className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                    >
                      <Copy size={14} />
                      Copy All
                    </button>
                    <button
                      onClick={downloadProxies}
                      className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3">
                  {generatedProxies.map((proxy, index) => (
                    <div
                      key={index}
                      className="font-mono text-xs text-gray-900 dark:text-gray-200 py-1 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      {proxy}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generatedProxies.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Configure all required fields to generate proxy list
              </div>
            )}
          </div>

          {/* ...existing cURL test section... */}
        </CardContent>
      </Card>
    </div>
  );
}
