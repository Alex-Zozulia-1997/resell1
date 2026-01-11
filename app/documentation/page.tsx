'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Documentation() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">IPden API Documentation</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete guide to using IPden residential proxies
        </p>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            IPden provides premium residential proxies with global coverage. This documentation will help you integrate our proxies into your applications.
          </p>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Quick Start</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Sign up and purchase a plan</li>
              <li>Get your credentials from the dashboard</li>
              <li>Configure your proxy settings</li>
              <li>Start making requests</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            IPden uses username and password authentication. Your credentials can be found in your dashboard.
          </p>
          
          <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Proxy Format</span>
              <button
                onClick={() => copyToClipboard('protocol://username:password@proxy.ipden.io:port')}
                className="p-1 hover:bg-gray-700 rounded transition-colors">
                <Copy size={14} className="text-gray-400" />
              </button>
            </div>
            <code className="text-sm text-green-400">
              protocol://username:password@proxy.ipden.io:port
            </code>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Available Ports</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li><strong>9000</strong> - HTTP/HTTPS Rotating</li>
              <li><strong>10000</strong> - HTTP/HTTPS Session (Sticky)</li>
              <li><strong>11000</strong> - SOCKS5 Rotating</li>
              <li><strong>12000</strong> - SOCKS5 Session (Sticky)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Available Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Available Locations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            IPden supports a wide range of geographic locations. Here&apos;s how to check available locations and target specific regions.
          </p>

          <div className="space-y-3">
            <h4 className="font-semibold">Supported Countries</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We support 195+ countries worldwide. Use ISO 3166-1 alpha-2 country codes:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">🇺🇸 US - United States</div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">🇬🇧 GB - United Kingdom</div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">🇩🇪 DE - Germany</div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">🇫🇷 FR - France</div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">🇨🇦 CA - Canada</div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">🇯🇵 JP - Japan</div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">🇦🇺 AU - Australia</div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">🇧🇷 BR - Brazil</div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">And 187+ more countries...</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">State/Region Targeting</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Available for major countries including US, CA, GB, AU, DE, and more. Use full state names without spaces:
            </p>
            <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg">
              <code className="text-sm text-green-400">
                username-country-us-state-california
              </code>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">City Targeting</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Target major cities worldwide. Remove spaces from city names:
            </p>
            <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              <code className="text-sm text-green-400 block">
                username-country-us-city-newyork
              </code>
              <code className="text-sm text-green-400 block">
                username-country-gb-city-london
              </code>
              <code className="text-sm text-green-400 block">
                username-country-us-state-california-city-losangeles
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Targeting Options */}
      <Card>
        <CardHeader>
          <CardTitle>Targeting Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Customize your proxy requests by adding parameters to your username.
          </p>

          <Tabs defaultValue="country" className="w-full">
            <TabsList>
              <TabsTrigger value="country">Country</TabsTrigger>
              <TabsTrigger value="state">State</TabsTrigger>
              <TabsTrigger value="city">City</TabsTrigger>
              <TabsTrigger value="session">Session</TabsTrigger>
            </TabsList>

            <TabsContent value="country" className="space-y-3">
              <h4 className="font-semibold">Country Targeting</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Target specific countries by adding the country code to your username.
              </p>
              <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg">
                <code className="text-sm text-green-400">
                  username-country-us
                </code>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use ISO 3166-1 alpha-2 country codes (e.g., us, gb, de, fr)
              </p>
            </TabsContent>

            <TabsContent value="state" className="space-y-3">
              <h4 className="font-semibold">State Targeting</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Target specific states or regions within a country.
              </p>
              <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg">
                <code className="text-sm text-green-400">
                  username-country-us-state-california
                </code>
              </div>
            </TabsContent>

            <TabsContent value="city" className="space-y-3">
              <h4 className="font-semibold">City Targeting</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Target specific cities for precise geo-location.
              </p>
              <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg">
                <code className="text-sm text-green-400">
                  username-country-us-state-california-city-losangeles
                </code>
              </div>
            </TabsContent>

            <TabsContent value="session" className="space-y-3">
              <h4 className="font-semibold">Session Control</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Maintain the same IP address for multiple requests using session IDs.
              </p>
              <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                <code className="text-sm text-green-400 block">
                  username-sessionId-abc123xyz-lifetime-30
                </code>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>sessionId</strong> - Unique identifier for your session (12 characters)</li>
                <li><strong>lifetime</strong> - Session duration in minutes (1-1440)</li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="python" className="w-full">
            <TabsList>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="nodejs">Node.js</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="php">PHP</TabsTrigger>
            </TabsList>

            <TabsContent value="python" className="space-y-3">
              <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm text-green-400">
{`import requests

proxies = {
    "http": "http://username:password@proxy.ipden.io:9000",
    "https": "http://username:password@proxy.ipden.io:9000",
}

response = requests.get("https://api.ipify.org", proxies=proxies)
print(response.text)`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="nodejs" className="space-y-3">
              <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm text-green-400">
{`const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

const proxy = 'http://username:password@proxy.ipden.io:9000';
const agent = new HttpsProxyAgent(proxy);

axios.get('https://api.ipify.org', { httpsAgent: agent })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="curl" className="space-y-3">
              <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm text-green-400">
{`curl -x http://username:password@proxy.ipden.io:9000 \\
     https://api.ipify.org`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="php" className="space-y-3">
              <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm text-green-400">
{`<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.ipify.org");
curl_setopt($ch, CURLOPT_PROXY, "proxy.ipden.io:9000");
curl_setopt($ch, CURLOPT_PROXYUSERPWD, "username:password");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Use Session Proxies for Multiple Requests</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                When making multiple requests to the same website, use session proxies to maintain the same IP address and avoid detection.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Implement Retry Logic</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Always implement retry logic with exponential backoff for failed requests.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Monitor Your Usage</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep track of your bandwidth usage in the dashboard to avoid unexpected overages.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Use Appropriate Timeouts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set reasonable timeout values (30-60 seconds) to handle slow responses gracefully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Authentication Failed</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verify your username and password are correct. Check the dashboard for your current credentials.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Connection Timeout</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Increase your timeout values or check if the target website is blocking proxy requests.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Bandwidth Limit Exceeded</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check your usage in the dashboard. Upgrade your plan or purchase additional bandwidth if needed.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Contact our 24/7 support team for assistance with any issues.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Proxy Endpoints</h4>
              <div className="bg-gray-900 dark:bg-gray-800 p-3 rounded text-xs">
                <code className="text-green-400">proxy.ipden.io:9000</code>
                <div className="text-gray-400 mt-1">HTTP/HTTPS Rotating</div>
              </div>
              <div className="bg-gray-900 dark:bg-gray-800 p-3 rounded text-xs">
                <code className="text-green-400">proxy.ipden.io:10000</code>
                <div className="text-gray-400 mt-1">HTTP/HTTPS Session</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Testing Endpoints</h4>
              <div className="bg-gray-900 dark:bg-gray-800 p-3 rounded text-xs">
                <code className="text-green-400">api.ipify.org</code>
                <div className="text-gray-400 mt-1">Check IP Address</div>
              </div>
              <div className="bg-gray-900 dark:bg-gray-800 p-3 rounded text-xs">
                <code className="text-green-400">ip-api.com/json</code>
                <div className="text-gray-400 mt-1">Geo Location Info</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
