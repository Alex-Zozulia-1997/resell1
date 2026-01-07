'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
    <div className="flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-4 w-full">
      <div className="flex justify-center items-center gap-2 w-full">
        <Card className="w-full ">
          <CardHeader className="flex flex- items-center justify-between =-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <h2 className="pt-2 text-xl">Code Examples</h2>
            </CardTitle>
            <CardContent className="w-full">
              <div className="flex w-full">
                <div
                  className={`text-xs border-1 fllex flex-col gap-1 border border-gray-700 w-1/5 text-muted-foreground `}>
                  {code.map((c, index) => (
                    <div
                      key={index}
                      onClick={() => handleClick(index)}
                      role="button"
                      tabIndex={0}
                      aria-pressed={c.iscurrent}
                      className={`${
                        c.iscurrent
                          ? 'border-gray-500 text-gray-200 bg-gray-900 font-extrabold'
                          : 'text-gray-300'
                      } h-auto flex justify-center items-center border border-gray-700 text-lg truncate px-4`}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleClick(index)
                      }>
                      <div className="flex justify-center flex-col items-center gap-0 m-2">
                        <Image alt="fuck" src={c.svg} width={50} height={50} />
                        {c.lang}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-1 border border-gray-700 w-full">
                  <div className="">
                    {code.map((c, index) => (
                      <div
                        key={index}
                        className={` h-full w-full ${
                          c.iscurrent ? 'text-gray-100' : 'hidden'
                        }`}>
                        <SyntaxHighlighter
                          language={c.lang}
                          style={vscDarkPlus} // You can replace this with other styles
                        >
                          {c.content}
                        </SyntaxHighlighter>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
