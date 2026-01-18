"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import config from '@/config';
import { useUser } from '@clerk/nextjs'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function Settings() {
  let user = null;
    /* eslint-disable react-hooks/rules-of-hooks */
  if (config?.auth?.enabled) {
      user = useUser();
  }

  const [envCheck, setEnvCheck] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkEnvVars = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-env');
      const data = await response.json();
      setEnvCheck(data.variables);
      console.log('Environment Variables Check:', data);
    } catch (error) {
      console.error('Failed to check env vars:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-start items-center flex-wrap px-4 pt-5 gap-4'>
      <div className="flex flex-col gap-3 mb-[5rem] w-full max-w-[700px]">
        <h2 className="mt-10 scroll-m-20 border-b pb-2 w-full text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          My Profile
        </h2>
        <div className='flex w-full gap-3 mt-3'>
          <div className='flex flex-col gap-3 w-full'>
            <Label>First Name</Label>
            <Input disabled defaultValue={user?.user?.firstName ? user?.user?.firstName : ""} />
          </div>
          <div className='flex flex-col gap-3 w-full'>
            <Label>Last Name</Label>
            <Input disabled defaultValue={user?.user?.lastName ? user?.user?.lastName : ""} />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-3'>
            <Label>E-mail</Label>
            <Input disabled defaultValue={user?.user?.emailAddresses?.[0]?.emailAddress!} />
          </div>
        </div>
      </div>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Environment Variables Check</h3>
              <Button onClick={checkEnvVars} disabled={loading}>
                {loading ? 'Checking...' : 'Test Environment Variables'}
              </Button>
            </div>

            {envCheck && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Results:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(envCheck).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      {value === '✓ Set' || typeof value === 'string' && !value.includes('Missing') ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">
                        <strong>{key}:</strong> {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
