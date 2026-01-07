'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import Code from '../_components/code';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EndpointBuild from '../_components/endpoint-build';
import UsernameCard from '../_components/username';
import PasswordCard from '../_components/password';
export default function ProjectsPage() {
  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      <div className="text-3xl lg:text-5xl font-bold  w-full text-center py-2">
        <h1>SetUp</h1>
      </div>
      <div className="flex justify-center items-center gap-2 w-full">
        {/* <UsernameCard />
        <PasswordCard /> */}
      </div>
      <div>Host</div>

      <div className="flex flex- items-center justify-center rounded-lg border border-dashed shadow-sm">
        <EndpointBuild />
      </div>
      <div className="flex flex- items-center justify-center rounded-lg border border-dashed shadow-sm">
        <Code />
      </div>
    </main>
  );
}
