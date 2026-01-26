'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';

export default function AddTrafficPage() {
  const { user } = useUser();
  const [trafficGB, setTrafficGB] = useState<number>(10);
  const [loading, setLoading] = useState(false);

  // Price calculation happens here on the frontend
  const pricePerGB = 0.80; // $0.80 per GB
  const totalPrice = trafficGB * pricePerGB;
  const amountInCents = Math.round(totalPrice * 100); // Convert to cents

  const handlePurchase = async () => {
    if (!user || !trafficGB || trafficGB <= 0) {
      toast.error('Please enter a valid traffic amount');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post('/api/payments/create-checkout-session', {
        trafficGB,
        userId: user.id,
        email: user.emailAddresses[0].emailAddress,
        amount: amountInCents, // Pass the calculated amount
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Add Proxy Traffic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Traffic Amount (GB)
            </label>
            <Input
              type="number"
              min="1"
              max="10000"
              value={trafficGB}
              onChange={(e) => setTrafficGB(parseInt(e.target.value) || 0)}
              placeholder="Enter GB amount"
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Price per GB:
              </span>
              <span className="font-semibold">${pricePerGB.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total:
              </span>
              <span className="text-2xl font-bold text-blue-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            onClick={handlePurchase}
            disabled={loading || trafficGB <= 0}
            className="w-full"
          >
            {loading ? 'Processing...' : `Purchase ${trafficGB}GB for $${totalPrice.toFixed(2)}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
