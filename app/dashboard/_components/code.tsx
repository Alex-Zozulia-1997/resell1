'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { Copy, Check, Code2, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface CodeExample {
  lang: string;
  svg: string;
  examples: {
    title: string;
    description: string;
    content: string;
    tag?: string;
  }[];
  iscurrent: boolean;
}

export default function Code() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [code, setCode] = useState<CodeExample[]>([
    {
      lang: 'Python',
      svg: '/python.svg',
      examples: [
        {
          title: 'Basic Request with Requests',
          description: 'Simple HTTP request using the requests library',
          tag: 'Most Popular',
          content: `import requests

# Your proxy credentials
USERNAME = "your_username"
PASSWORD = "your_password"
PROXY_HOST = "${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}"
PROXY_PORT = "12321"

proxies = {
    "http": f"http://{USERNAME}:{PASSWORD}@{PROXY_HOST}:{PROXY_PORT}",
    "https": f"http://{USERNAME}:{PASSWORD}@{PROXY_HOST}:{PROXY_PORT}",
}

try:
    response = requests.get("https://api.ipify.org?format=json", proxies=proxies, timeout=10)
    print(f"Your IP: {response.json()['ip']}")
    print(f"Status: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")`,
        },
        {
          title: 'Rotating Proxies with Sessions',
          description: 'Use sessions for better performance with multiple requests',
          content: `import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

USERNAME = "your_username"
PASSWORD = "your_password"
PROXY_HOST = "${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}"
PROXY_PORT = "12321"

# Create session with retry strategy
session = requests.Session()
retry = Retry(total=3, backoff_factor=0.3)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)

proxies = {
    "http": f"http://{USERNAME}:{PASSWORD}@{PROXY_HOST}:{PROXY_PORT}",
    "https": f"http://{USERNAME}:{PASSWORD}@{PROXY_HOST}:{PROXY_PORT}",
}

# Make multiple requests efficiently
urls = [
    "https://api.ipify.org?format=json",
    "https://httpbin.org/ip",
    "https://ifconfig.me/ip"
]

for url in urls:
    try:
        response = session.get(url, proxies=proxies, timeout=10)
        print(f"Response from {url}: {response.text[:100]}")
    except Exception as e:
        print(f"Error with {url}: {e}")`,
        },
        {
          title: 'BeautifulSoup Web Scraping',
          description: 'Scrape websites with rotating proxies',
          content: `import requests
from bs4 import BeautifulSoup

USERNAME = "your_username"
PASSWORD = "your_password"
PROXY_HOST = "${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}"
PROXY_PORT = "12321"

proxies = {
    "http": f"http://{USERNAME}:{PASSWORD}@{PROXY_HOST}:{PROXY_PORT}",
    "https": f"http://{USERNAME}:{PASSWORD}@{PROXY_HOST}:{PROXY_PORT}",
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

try:
    response = requests.get(
        "https://example.com",
        proxies=proxies,
        headers=headers,
        timeout=15
    )
    
    soup = BeautifulSoup(response.content, 'html.parser')
    title = soup.find('title').text
    print(f"Page Title: {title}")
    
except Exception as e:
    print(f"Scraping error: {e}")`,
        },
        {
          title: 'Async Requests with aiohttp',
          description: 'High-performance async requests for faster scraping',
          content: `import aiohttp
import asyncio

USERNAME = "your_username"
PASSWORD = "your_password"
PROXY_HOST = "${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}"
PROXY_PORT = "12321"

proxy_url = f"http://{USERNAME}:{PASSWORD}@{PROXY_HOST}:{PROXY_PORT}"

async def fetch(session, url):
    try:
        async with session.get(url, proxy=proxy_url, timeout=10) as response:
            return await response.text()
    except Exception as e:
        return f"Error: {e}"

async def main():
    urls = [
        "https://api.ipify.org",
        "https://httpbin.org/ip",
        "https://ifconfig.me/ip"
    ]
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        
        for url, result in zip(urls, results):
            print(f"{url}: {result[:100]}")

# Run the async function
asyncio.run(main())`,
        },
      ],
      iscurrent: true,
    },
    {
      lang: 'Node.js',
      svg: '/javascript.svg',
      examples: [
        {
          title: 'Axios with Proxy',
          description: 'HTTP client with full proxy support',
          tag: 'Recommended',
          content: `const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

const USERNAME = 'your_username';
const PASSWORD = 'your_password';
const PROXY_HOST = '${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}';
const PROXY_PORT = '12321';

const proxyUrl = \`http://\${USERNAME}:\${PASSWORD}@\${PROXY_HOST}:\${PROXY_PORT}\`;
const agent = new HttpsProxyAgent(proxyUrl);

axios.get('https://api.ipify.org?format=json', {
  httpsAgent: agent,
  httpAgent: agent,
  timeout: 10000
})
.then(response => {
  console.log('Your IP:', response.data.ip);
  console.log('Status:', response.status);
})
.catch(error => {
  console.error('Error:', error.message);
});`,
        },
        {
          title: 'Fetch API with Proxy',
          description: 'Modern fetch with proxy agent',
          content: `const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');

const USERNAME = 'your_username';
const PASSWORD = 'your_password';
const PROXY_HOST = '${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}';
const PROXY_PORT = '12321';

const proxyUrl = \`http://\${USERNAME}:\${PASSWORD}@\${PROXY_HOST}:\${PROXY_PORT}\`;
const agent = new HttpsProxyAgent(proxyUrl);

async function makeRequest() {
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    
    const data = await response.json();
    console.log('IP Address:', data.ip);
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

makeRequest();`,
        },
        {
          title: 'Puppeteer Web Scraping',
          description: 'Browser automation with proxy support',
          content: `const puppeteer = require('puppeteer');

const USERNAME = 'your_username';
const PASSWORD = 'your_password';
const PROXY_HOST = '${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}';
const PROXY_PORT = '12321';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      \`--proxy-server=http://\${PROXY_HOST}:\${PROXY_PORT}\`
    ]
  });
  
  const page = await browser.newPage();
  
  // Authenticate
  await page.authenticate({
    username: USERNAME,
    password: PASSWORD
  });
  
  // Navigate and scrape
  await page.goto('https://example.com', { waitUntil: 'networkidle2' });
  
  const title = await page.title();
  const content = await page.content();
  
  console.log('Page Title:', title);
  console.log('Content Length:', content.length);
  
  await browser.close();
})();`,
        },
        {
          title: 'Multiple Concurrent Requests',
          description: 'Parallel requests for maximum throughput',
          content: `const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

const USERNAME = 'your_username';
const PASSWORD = 'your_password';
const PROXY_HOST = '${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}';
const PROXY_PORT = '12321';

const proxyUrl = \`http://\${USERNAME}:\${PASSWORD}@\${PROXY_HOST}:\${PROXY_PORT}\`;
const agent = new HttpsProxyAgent(proxyUrl);

const urls = [
  'https://api.ipify.org?format=json',
  'https://httpbin.org/ip',
  'https://ifconfig.me/ip',
  'https://ipinfo.io/json'
];

async function fetchAll() {
  const requests = urls.map(url => 
    axios.get(url, { 
      httpsAgent: agent,
      httpAgent: agent,
      timeout: 10000
    })
    .then(res => ({ url, data: res.data, status: res.status }))
    .catch(err => ({ url, error: err.message }))
  );
  
  const results = await Promise.all(requests);
  results.forEach(result => {
    console.log('URL:', result.url);
    console.log('Result:', result.data || result.error);
    console.log('---');
  });
}

fetchAll();`,
        },
      ],
      iscurrent: false,
    },
    {
      lang: 'TypeScript',
      svg: '/typescript.svg',
      examples: [
        {
          title: 'Typed Axios Client',
          description: 'Type-safe HTTP requests with proxy',
          content: `import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

interface ProxyConfig {
  username: string;
  password: string;
  host: string;
  port: string;
}

interface IPResponse {
  ip: string;
}

class ProxyClient {
  private client: AxiosInstance;

  constructor(config: ProxyConfig) {
    const proxyUrl = \`http://\${config.username}:\${config.password}@\${config.host}:\${config.port}\`;
    const agent = new HttpsProxyAgent(proxyUrl);

    this.client = axios.create({
      httpsAgent: agent,
      httpAgent: agent,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
  }

  async getIP(): Promise<string> {
    try {
      const response: AxiosResponse<IPResponse> = await this.client.get(
        'https://api.ipify.org?format=json'
      );
      return response.data.ip;
    } catch (error) {
      throw new Error(\`Failed to get IP: \${error}\`);
    }
  }

  async get<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url);
    return response.data;
  }
}

// Usage
const proxyClient = new ProxyClient({
  username: 'your_username',
  password: 'your_password',
  host: '${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}',
  port: '12321'
});

proxyClient.getIP()
  .then(ip => console.log('Your IP:', ip))
  .catch(err => console.error('Error:', err.message));`,
        },
        {
          title: 'Next.js API Route with Proxy',
          description: 'Server-side proxy requests in Next.js',
          content: `import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

export async function GET(req: NextRequest) {
  const proxyUrl = \`http://\${process.env.PROXY_USERNAME}:\${process.env.PROXY_PASSWORD}@\${process.env.PROXY_HOST}:\${process.env.PROXY_PORT}\`;
  
  const agent = new HttpsProxyAgent(proxyUrl);

  try {
    const response = await axios.get(
      'https://api.example.com/data',
      {
        httpsAgent: agent,
        httpAgent: agent,
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    return NextResponse.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Request failed' },
      { status: 500 }
    );
  }
}`,
        },
      ],
      iscurrent: false,
    },
    {
      lang: 'cURL',
      svg: '/curl.svg',
      examples: [
        {
          title: 'Basic cURL Request',
          description: 'Simple command-line proxy request',
          content: `# Basic GET request
curl -x http://username:password@${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}:12321 \\
  https://api.ipify.org?format=json

# With custom headers
curl -x http://username:password@${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}:12321 \\
  -H "User-Agent: Mozilla/5.0" \\
  -H "Accept: application/json" \\
  https://api.example.com/data`,
        },
        {
          title: 'POST Request with Data',
          description: 'Send POST data through proxy',
          content: `# POST with JSON data
curl -x http://username:password@${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}:12321 \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"key":"value","data":"example"}' \\
  https://api.example.com/endpoint

# POST with form data
curl -x http://username:password@${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}:12321 \\
  -X POST \\
  -F "file=@/path/to/file.txt" \\
  -F "field=value" \\
  https://api.example.com/upload`,
        },
        {
          title: 'Advanced cURL Options',
          description: 'Timeouts, retries, and verbose output',
          content: `# With timeout and retry
curl -x http://username:password@${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}:12321 \\
  --max-time 30 \\
  --retry 3 \\
  --retry-delay 2 \\
  https://api.example.com/data

# Verbose output for debugging
curl -x http://username:password@${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}:12321 \\
  -v \\
  -H "Accept: application/json" \\
  https://api.ipify.org

# Save response to file
curl -x http://username:password@${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}:12321 \\
  -o output.json \\
  https://api.example.com/data`,
        },
      ],
      iscurrent: false,
    },
    {
      lang: 'PHP',
      svg: '/curl.svg',
      examples: [
        {
          title: 'cURL in PHP',
          description: 'PHP cURL with proxy configuration',
          content: `<?php

$username = 'your_username';
$password = 'your_password';
$proxyHost = '${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}';
$proxyPort = '12321';

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 'https://api.ipify.org?format=json');
curl_setopt($ch, CURLOPT_PROXY, "$proxyHost:$proxyPort");
curl_setopt($ch, CURLOPT_PROXYUSERPWD, "$username:$password");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch);
} else {
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    echo "Status Code: $httpCode\\n";
    echo "Response: $response\\n";
    
    $data = json_decode($response, true);
    echo "Your IP: " . $data['ip'] . "\\n";
}

curl_close($ch);

?>`,
        },
        {
          title: 'Guzzle HTTP Client',
          description: 'Modern PHP HTTP client with proxy',
          content: `<?php

require 'vendor/autoload.php';

use GuzzleHttp\\Client;

$username = 'your_username';
$password = 'your_password';
$proxyHost = '${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}';
$proxyPort = '12321';

$client = new Client([
    'proxy' => "http://$username:$password@$proxyHost:$proxyPort",
    'timeout' => 30,
    'headers' => [
        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept' => 'application/json'
    ]
]);

try {
    $response = $client->get('https://api.ipify.org?format=json');
    $data = json_decode($response->getBody(), true);
    
    echo "Your IP: " . $data['ip'] . "\\n";
    echo "Status: " . $response->getStatusCode() . "\\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\\n";
}

?>`,
        },
      ],
      iscurrent: false,
    },
    {
      lang: 'Go',
      svg: '/curl.svg',
      examples: [
        {
          title: 'HTTP Client with Proxy',
          description: 'Go net/http package with proxy support',
          content: `package main

import (
    "fmt"
    "io/ioutil"
    "net/http"
    "net/url"
    "time"
)

func main() {
    username := "your_username"
    password := "your_password"
    proxyHost := "${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}"
    proxyPort := "12321"

    // Create proxy URL
    proxyURL, err := url.Parse(
        fmt.Sprintf("http://%s:%s@%s:%s", 
            username, password, proxyHost, proxyPort))
    if err != nil {
        fmt.Println("Error parsing proxy URL:", err)
        return
    }

    // Create HTTP client with proxy
    client := &http.Client{
        Transport: &http.Transport{
            Proxy: http.ProxyURL(proxyURL),
        },
        Timeout: 30 * time.Second,
    }

    // Make request
    req, err := http.NewRequest("GET", "https://api.ipify.org?format=json", nil)
    if err != nil {
        fmt.Println("Error creating request:", err)
        return
    }

    req.Header.Set("User-Agent", "Mozilla/5.0")

    resp, err := client.Do(req)
    if err != nil {
        fmt.Println("Error making request:", err)
        return
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        fmt.Println("Error reading response:", err)
        return
    }

    fmt.Println("Status:", resp.Status)
    fmt.Println("Response:", string(body))
}`,
        },
      ],
      iscurrent: false,
    },
    {
      lang: 'Ruby',
      svg: '/curl.svg',
      examples: [
        {
          title: 'Net::HTTP with Proxy',
          description: 'Ruby HTTP requests through proxy',
          content: `require 'net/http'
require 'uri'
require 'json'

username = 'your_username'
password = 'your_password'
proxy_host = '${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}'
proxy_port = 12321

# Target URL
uri = URI('https://api.ipify.org?format=json')

# Create HTTP object with proxy
Net::HTTP.start(
  uri.host,
  uri.port,
  proxy_host,
  proxy_port,
  username,
  password,
  use_ssl: uri.scheme == 'https',
  open_timeout: 10,
  read_timeout: 30
) do |http|
  
  request = Net::HTTP::Get.new(uri)
  request['User-Agent'] = 'Mozilla/5.0'
  
  response = http.request(request)
  
  if response.is_a?(Net::HTTPSuccess)
    data = JSON.parse(response.body)
    puts "Your IP: #{data['ip']}"
    puts "Status: #{response.code}"
  else
    puts "Error: #{response.code} - #{response.message}"
  end
end`,
        },
      ],
      iscurrent: false,
    },
    {
      lang: 'Java',
      svg: '/curl.svg',
      examples: [
        {
          title: 'OkHttp with Proxy',
          description: 'Modern Java HTTP client with proxy support',
          content: `import okhttp3.*;
import java.io.IOException;
import java.net.*;

public class ProxyExample {
    public static void main(String[] args) {
        String username = "your_username";
        String password = "your_password";
        String proxyHost = "${process.env.NEXT_PUBLIC_PROXY_HOST || 'proxy.example.com'}";
        int proxyPort = 12321;

        // Create proxy
        Proxy proxy = new Proxy(
            Proxy.Type.HTTP,
            new InetSocketAddress(proxyHost, proxyPort)
        );

        // Create authenticator
        Authenticator proxyAuthenticator = new Authenticator() {
            @Override
            public Request authenticate(Route route, Response response) {
                String credential = Credentials.basic(username, password);
                return response.request().newBuilder()
                    .header("Proxy-Authorization", credential)
                    .build();
            }
        };

        // Create client
        OkHttpClient client = new OkHttpClient.Builder()
            .proxy(proxy)
            .proxyAuthenticator(proxyAuthenticator)
            .build();

        // Make request
        Request request = new Request.Builder()
            .url("https://api.ipify.org?format=json")
            .header("User-Agent", "Mozilla/5.0")
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                String responseBody = response.body().string();
                System.out.println("Response: " + responseBody);
            } else {
                System.out.println("Error: " + response.code());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`,
        },
      ],
      iscurrent: false,
    },
  ]);

  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);

  const handleClick = (index: number) => {
    setCode(
      code.map((c, i) => {
        if (i === index) {
          return { ...c, iscurrent: true };
        }
        return { ...c, iscurrent: false };
      })
    );
    setCurrentExampleIndex(0);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content.trim());
    setCopiedIndex(id);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentLanguage = code.find(c => c.iscurrent);
  const currentExample = currentLanguage?.examples[currentExampleIndex];

  return (
    <div className="flex flex-col justify-center items-start px-4 pt-4 gap-4 w-full">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Code2 className="w-6 h-6" />
                Code Examples
              </CardTitle>
              <CardDescription className="mt-2">
                Production-ready code snippets for all major languages and frameworks
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="w-full p-0">
          <div className="flex flex-col lg:flex-row w-full min-h-[600px]">
            {/* Language Selector */}
            <div className="flex lg:flex-col border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 overflow-x-auto lg:overflow-x-visible lg:w-[180px] bg-gray-50 dark:bg-transparent">
              {code.map((c, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className={`${
                    c.iscurrent
                      ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-b-4 lg:border-b-0 lg:border-l-4 border-blue-500 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                  } flex flex-col justify-center items-center gap-2 py-5 px-6 transition-all duration-200 border-b border-gray-200 dark:border-gray-700 whitespace-nowrap`}>
                  <Image
                    alt={`${c.lang} icon`}
                    src={c.svg}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                  <span className="text-sm font-medium">{c.lang}</span>
                  <Badge variant="outline" className="text-xs">
                    {c.examples.length} examples
                  </Badge>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-full bg-white dark:bg-transparent">
              {/* Example Selector */}
              {currentLanguage && currentLanguage.examples.length > 1 && (
                <div className="border-b border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex gap-2 overflow-x-auto">
                    {currentLanguage.examples.map((example, idx) => (
                      <Button
                        key={idx}
                        variant={currentExampleIndex === idx ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentExampleIndex(idx)}
                        className="whitespace-nowrap flex-shrink-0">
                        {example.tag && currentExampleIndex === idx && (
                          <Zap className="w-3 h-3 mr-1" />
                        )}
                        {example.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Example Details */}
              {currentExample && (
                <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-900/30">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{currentExample.title}</h3>
                        {currentExample.tag && (
                          <Badge variant="secondary" className="text-xs">
                            {currentExample.tag}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{currentExample.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(currentExample.content, `${currentLanguage.lang}-${currentExampleIndex}`)}
                      className="flex-shrink-0">
                      {copiedIndex === `${currentLanguage.lang}-${currentExampleIndex}` ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Code Display */}
              <div className="overflow-auto flex-1 bg-gray-900 dark:bg-gray-950">
                {currentLanguage && currentExample && (
                  <SyntaxHighlighter
                    language={currentLanguage.lang.toLowerCase() === 'node.js' ? 'javascript' : currentLanguage.lang.toLowerCase()}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: '14px',
                      lineHeight: '1.5',
                      height: '100%',
                      minHeight: '500px',
                      background: 'transparent',
                    }}
                    showLineNumbers={true}
                    wrapLines={true}>
                    {currentExample.content.trim()}
                  </SyntaxHighlighter>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
