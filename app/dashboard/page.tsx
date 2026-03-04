'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GaugeChartComponent } from './_components/bar-chart';
import { BarChartBetter } from './_components/bar-chart-better';
import CurlTest from './_components/curl-test';
import UsernameCard from './_components/username';
import PasswordCard from './_components/password';
import EndpointBuild from './_components/endpoint-build';
import { Globe, Zap, Clock, CheckCircle, Plus, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import TrafficStatistics from './_components/traffic-statistics';

interface UserData {
  usageBandwidth: number;
  traffic_limit: number;
  sub_user_name?: string;
  username?: string;
  sub_user_password?: string;
  password?: string;
  resID?: string;
  authorization?: {
    username: string;
    password: string;
  };
  // Add other properties as needed
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [traffic, setTraffic] = useState<number>(0);
  const [trafficLimit, setTrafficLimit] = useState<number>(0);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) {
        setLoading(false);
        return;
      }

      try {
        // Check cache first
        const cachedData = localStorage.getItem('userData');
        const cacheTimestamp = localStorage.getItem('userDataTimestamp');
        
        if (cachedData && cacheTimestamp) {
          const parsedData = JSON.parse(cachedData);
          const timestamp = parseInt(cacheTimestamp);
          const now = Date.now();
          
          // If cache is still valid (less than 5 minutes old)
          if (now - timestamp < CACHE_DURATION) {
            console.log('Using cached data');
            setUserData(parsedData);
            
            // Fetch only traffic data (which changes frequently)
            if (parsedData.resID) {
              const trafficResponse = await fetch(`/api/geonode/user/traffic/${parsedData.resID}`);
              if (trafficResponse.ok) {
                const trafficData = await trafficResponse.json();
                console.log("🔍 DASHBOARD (cached): Traffic API response:", trafficData);
                
                const usageBandwidth = trafficData?.data?.usageBandwidth || 0;
                const trafficLimitInBytes = trafficData?.data?.trafficLimitInBytes || 0;
                
                console.log("🔍 DASHBOARD (cached): Usage bandwidth:", usageBandwidth);
                
                const trafficInGB = usageBandwidth / (1000 * 1000 * 1000);
                const limitInGB = trafficLimitInBytes / (1000 * 1000 * 1000);
                
                console.log("🔍 DASHBOARD (cached): Traffic in GB:", trafficInGB);
                console.log("🔍 DASHBOARD (cached): Limit in GB:", limitInGB);
                
                setTraffic(trafficInGB);
                setTrafficLimit(limitInGB);
              }
            }
            
            setLoading(false);
            return;
          }
        }

        // Cache miss or expired - fetch fresh data
        console.log('Cache miss or expired - fetching fresh data');
        
        const dbResponse = await fetch(
          `/api/user?email=${user.emailAddresses[0].emailAddress}`
        );
        if (!dbResponse.ok) {
          setError('It takes us a few minutes after your registration to add you to our database. Please refresh this page in 1-2 minutes.');
          setLoading(false);
          return;
        }
        const dbData = await dbResponse.json();
        const resID = dbData.resID;

        if (!resID) {
          setError('No Proxy user ID found');
          setLoading(false);
          return;
        }

        // Fetch user data from Geonode
        const response = await fetch(`/api/geonode/user/${resID}`);
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data = await response.json();
        
        const userDataWithResID = { ...data.data, resID };
        setUserData(userDataWithResID);
        
        // Cache the user data with timestamp
        localStorage.setItem('userData', JSON.stringify(userDataWithResID));
        localStorage.setItem('userDataTimestamp', Date.now().toString());

        // Fetch traffic data
        const trafficResponse = await fetch(`/api/geonode/user/traffic/${resID}`);
        if (!trafficResponse.ok)
          throw new Error(`Request failed: ${trafficResponse.status}`);
        const trafficData = await trafficResponse.json();
        
        console.log("🔍 DASHBOARD: Traffic API response:", trafficData);
        
        const usageBandwidth = trafficData?.data?.usageBandwidth || 0;
        const trafficLimitInBytes = trafficData?.data?.trafficLimitInBytes || 0;
        
        console.log("🔍 DASHBOARD: Raw values:", {
          usageBandwidth,
          trafficLimitInBytes
        });
        
        // Convert bytes to GB (using 1000*1000*1000 for GB, not GiB)
        const trafficInGB = usageBandwidth / (1000 * 1000 * 1000);
        const limitInGB = trafficLimitInBytes / (1000 * 1000 * 1000);
        
        console.log("🔍 DASHBOARD: Converted values:", {
          trafficInGB,
          limitInGB
        });
        
        setTraffic(trafficInGB);
        setTrafficLimit(limitInGB);

        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleBillingPortal = async () => {
    try {
      const { data } = await axios.post('/api/payments/create-portal-session', {
        userId: user?.id,
        email: user?.emailAddresses?.[0]?.emailAddress,
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to open billing portal');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      toast.error('Failed to open billing portal');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Card className="w-full max-w-md border-blue-200 dark:border-blue-800">
          <CardContent className="flex flex-col items-center text-center p-8">
            <Clock className="w-16 h-16 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Setting up your account...
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {error}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-start flex-wrap px-1 pt-4 gap-4 w-full">
      {/* Header with branding */}
      <div className="w-full">
        <div className="flex items-center justify-between w-full border-b pb-4">
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold">Overview</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor your proxy usage and manage your account
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button 
              onClick={handleBillingPortal}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="text-xs text-gray-600 dark:text-gray-400">Manage</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400">Billing</p>
              </div>
            </Button>
            <Button 
              onClick={() => router.push('/dashboard/addTraffic')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-5 h-5" />
              <div className="text-left">
                <p className="text-xs opacity-90">Buy More</p>
                <p className="font-semibold">Add Traffic</p>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Credentials Cards */}
      <div className="flex justify-center items-center gap-2 w-full">
        <UsernameCard userData={userData} />
        <PasswordCard userData={userData} />
      </div>

      {/* Stats Overview */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Globe className="w-10 h-10 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available Countries</p>
              <p className="text-2xl font-bold">195+</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Zap className="w-10 h-10 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connection Type</p>
              <p className="text-2xl font-bold">Premium</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Clock className="w-10 h-10 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Response Time</p>
              <p className="text-2xl font-bold">&lt;550ms</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Charts */}
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <div className="w-full md:w-2/5">
          <GaugeChartComponent
            used={traffic}
            total={trafficLimit}
          />
        </div>
        <div className="flex-1">
          <BarChartBetter 
            username={userData?.authorization?.username}
            dateFrom={dateRange.from}
            dateTo={dateRange.to}
          />
        </div>
      </div>

      {/* Traffic Statistics */}
      <TrafficStatistics 
        username={userData?.authorization?.username}
        onDateRangeChange={(from, to) => setDateRange({ from, to })}
      />

      {/* Proxy Configuration */}
      <EndpointBuild userData={userData} />
    </div>
  );
}
