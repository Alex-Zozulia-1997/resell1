"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import config from '@/config';
import { useUser } from '@clerk/nextjs'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  let user = null;
    /* eslint-disable react-hooks/rules-of-hooks */
  if (config?.auth?.enabled) {
      user = useUser();
  }

  const [envCheck, setEnvCheck] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(user?.user?.firstName || "");
  const [lastName, setLastName] = useState(user?.user?.lastName || "");
  const [updating, setUpdating] = useState(false);

  const checkEnvVars = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-env');
      const data = await response.json();
      setEnvCheck(data.variables);

    } catch (error) {
      console.error('Failed to check env vars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?.user) return;
    
    setUpdating(true);
    try {
      await user.user.update({
        firstName: firstName,
        lastName: lastName,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
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
            <Input 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name" 
            />
          </div>
          <div className='flex flex-col gap-3 w-full'>
            <Label>Last Name</Label>
            <Input 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name" 
            />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-3'>
            <Label>E-mail</Label>
            <Input disabled defaultValue={user?.user?.emailAddresses?.[0]?.emailAddress!} />
          </div>
        </div>
        <div className="flex justify-start mt-4">
          <Button 
            onClick={handleUpdateProfile}
            disabled={updating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {updating ? 'Updating...' : 'Save Changes'}
          </Button>
        </div>
      </div>
     
    </div>
  )
}
