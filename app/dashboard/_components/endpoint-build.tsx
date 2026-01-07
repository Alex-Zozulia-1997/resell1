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

import { useState } from 'react';
import Select from 'react-select';
import countries from 'world-countries';

const countryOptions = countries.map((country) => ({
  value: country.cca2,
  label: `${country.name.common} (${country.cca2})`,
}));
const protocolOptions = [
  { value: 'HTTP', label: 'HTTP' },
  { value: 'HTTPS', label: 'HTTPS' },
  { value: 'SOCKS5', label: 'SOCKS5' },
];

const typeOptions = [
  { value: 'Sticky', label: 'Sticky' },
  { value: 'Datacenter', label: 'Datacenter' },
];

export default function EndpointBuild() {
  return (
    <div>
      <h2 className="pt-2 text-xl">Configuration</h2>
      <div className="flex flex- p-4  gap-4">
        <Select
          className=" w-48 bg-gray-900 color-gray-900 text-gray-500"
          options={countryOptions}
          placeholder="Select a country"
          isSearchable
        />
        <Select
          className=" w-48 bg-gray-900 color-gray-900 text-gray-500"
          options={countryOptions}
          placeholder="Select a region"
          isSearchable
        />
        <Select
          className=" w-48 bg-gray-900 color-gray-900 text-gray-500"
          options={countryOptions}
          placeholder="Select a city"
          isSearchable
        />
        <Select
          className=" w-48 bg-gray-900 color-gray-900 text-gray-500"
          options={typeOptions}
          placeholder="Select a type"
          isSearchable
        />
        <Select
          className=" w-48 bg-gray-900 color-gray-900 text-gray-500"
          options={protocolOptions}
          placeholder="Select a protocol"
          isSearchable
        />
      </div>
    </div>
  );
}
