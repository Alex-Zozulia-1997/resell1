'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

export default function Code() {
  const [code, setCode] = useState([
    {
      lang: 'Python',
      svg: '/python.svg',
      content: `
import requests

proxies = {
    "http": "http://username:password@proxy_address:port",
    "https": "http://username:password@proxy_address:port",
}

response = requests.get("http://example.com", proxies=proxies)
print(response.text)
      `,
      iscurrent: false,
    },
    {
      lang: 'Javascript',
      svg: '/javascript.svg',
      content: `
const fetch = require('node-fetch');

const proxyUrl = 'http://username:password@proxy_address:port';
const targetUrl = 'http://example.com';

fetch(targetUrl, {
  method: 'GET',
  agent: new (require('https-proxy-agent'))(proxyUrl),
})
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
      `,
      iscurrent: true,
    },
    {
      lang: 'Typescript',
      svg: '/typescript.svg',
      content: `
import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";

const proxyUrl = 'http://username:password@proxy_address:port';
const targetUrl = 'http://example.com';

const agent = new HttpsProxyAgent(proxyUrl);

(async () => {
  const response = await fetch(targetUrl, { agent });
  const data = await response.text();
  console.log(data);
})();
      `,
      iscurrent: false,
    },
    {
      lang: 'cURL',
      svg: '/curl.svg',

      content: `curl -x http://username:password@proxy_address:port http://example.com`,
      iscurrent: false,
    },
  ]);

  const handleClick = (index: number) => {
    setCode(
      code.map((c, i) => {
        if (i === index) {
          return { ...c, iscurrent: true };
        }
        return { ...c, iscurrent: false };
      })
    );
  };

  return (
    <div className="flex flex-col justify-center items-start px-4 pt-4 gap-4 w-full">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold">Code Examples</CardTitle>
        </CardHeader>
        <CardContent className="w-full p-0">
          <div className="flex w-full">
            <div className="flex flex-col border-r border-gray-700 w-1/5 min-w-[140px]">
              {code.map((c, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className={`${
                    c.iscurrent
                      ? 'bg-gray-900 text-gray-100 border-l-4 border-blue-500'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  } flex flex-col justify-center items-center gap-2 py-6 px-4 transition-all duration-200 border-b border-gray-700`}>
                  <Image
                    alt={`${c.lang} icon`}
                    src={c.svg}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <span className="text-sm font-medium">{c.lang}</span>
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden">
              {code.map((c, index) => (
                <div
                  key={index}
                  className={`${c.iscurrent ? 'block' : 'hidden'}`}>
                  <SyntaxHighlighter
                    language={c.lang.toLowerCase()}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      maxHeight: '500px',
                    }}>
                    {c.content}
                  </SyntaxHighlighter>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
