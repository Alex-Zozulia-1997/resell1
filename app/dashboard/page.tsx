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

interface UserData {
  usageBandwidth: number;
  traffic_limit: number;
  sub_user_name?: string;
  username?: string;
  sub_user_password?: string;
  password?: string;
  resID?: string;
  // Add other properties as needed
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export default function Dashboard() {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [traffic, setTraffic] = useState<number>(0);

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
                const usageBandwidth = trafficData?.data?.usageBandwidth || 0;
                const trafficInGB = usageBandwidth / 1000000000;
                setTraffic(trafficInGB);
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
        if (!dbResponse.ok)
          throw new Error('Failed to fetch user from database');
        const dbData = await dbResponse.json();
        const resID = dbData.resID;

        if (!resID) {
          setError('No Geonode user ID found');
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
        
        const usageBandwidth = trafficData?.data?.usageBandwidth || 0;
        const trafficInGB = usageBandwidth / 1000000000;
        setTraffic(trafficInGB);

        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-start flex-wrap px-1 pt-4 gap-4 w-full">
      <div className="text-3xl lg:text-5xl font-bold  w-full text-center py-2">
        <h1>Overview</h1>
      </div>
      <div className="flex justify-center items-center gap-2 w-full">
        <UsernameCard userData={userData} />
        <PasswordCard userData={userData} />
      </div>

      {/* Charts */}
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <GaugeChartComponent
          used={Number(traffic.toFixed(2))}
          total={Number(
            userData?.traffic_limit ? userData?.traffic_limit / 1000 : 1
          )}
        />
        <div className="flex-1">
          <BarChartBetter />
        </div>
      </div>

      {/* Proxy Configuration */}
      <EndpointBuild userData={userData} />
    </div>
  );
}
