'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export default function PurchaseCard(info: any) {
  return (
    <Card className="w-full m- p-2  rounded-xl h-auto bg-gradient-to-b from-black to-gray-900 shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 flex justify-end items-end">
        <CardTitle className="text-2xl font-semibold ">
          {info.price} USD
        </CardTitle>
        <CardDescription className="text-sm text-gray-100">
          Use within 30 Days
        </CardDescription>
      </CardHeader>
      <CardContent className="flex bg-gray-200 justify-center items-center flex-col gap-6 p-6">
        {/* Highlighted Statistic */}
        <div className="text-8xl font-extrabold text-blue-600 text-center">
          {info.data} GB
        </div>

        {/* List of Features */}
        <ul className="text-center text-lg text-gray-700 space-y-1  ">
          <li>
            <span className="font-semibold text-blue-500">195</span> countries
          </li>
          <li>
            <span className="font-semibold text-blue-500">8 million</span> IPs
          </li>
          <li>
            <span className="font-semibold text-blue-500">24/7</span> support
          </li>
          <li>
            <span className="font-semibold text-blue-500">99.9%</span> uptime
          </li>
          <li>
            <span className="font-semibold text-blue-500">
              True Residential Traffic
            </span>
          </li>
        </ul>
      </CardContent>

      <CardFooter className="p-4 bg-gray-200    ">
        <Button
          variant="ringHover"
          className="w-full bg-blue-500 text-white text-xl h-20 font-bold py-3 rounded-md hover:bg-blue-600 transition-all">
          Purchase Now
        </Button>
      </CardFooter>
    </Card>
  );
}
