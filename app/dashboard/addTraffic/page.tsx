'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { toast } from 'sonner';
import { Bitcoin, CreditCard, Zap } from 'lucide-react';

export default function AddTraffic() {
  const { user } = useUser();
  const [trafficAmount, setTrafficAmount] = useState<number>(10);
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!));
  }, []);

  // Price per GB calculation (with volume discounts)
  const getPricePerGB = (gb: number): number => {
    if (gb <= 5) return 2.2; // $2.20/GB
    if (gb <= 50) return 1.1; // $1.10/GB
    if (gb <= 200) return 0.8; // $0.80/GB
    return 0.7; // $0.70/GB for 500GB+
  };

  const pricePerGB = getPricePerGB(trafficAmount);
  const totalPrice = Math.ceil(trafficAmount * pricePerGB * 100) / 100;

  // Get the appropriate Stripe price ID based on amount
  const getPriceId = (gb: number): string => {
    if (gb >= 3 && gb <= 7) return process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_10GB || ''; // 5GB plan
    if (gb >= 40 && gb <= 60) return process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_30GB || ''; // 50GB plan
    if (gb >= 180 && gb <= 220) return process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_200GB || ''; // 200GB plan
    if (gb >= 450 && gb <= 550) return process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_500GB || ''; // 500GB plan
    return ''; // Custom amount - will need manual handling
  };

  const handleCheckout = async () => {
    if (!user?.id) {
      toast.error('Please sign in to purchase traffic');
      return;
    }

    setLoading(true);
    const priceId = getPriceId(trafficAmount);

    try {
      const { data } = await axios.post(
        `/api/payments/create-checkout-session`,
        {
          userId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          trafficGB: trafficAmount,
          amount: Math.round(totalPrice * 100), // Convert to cents
        }
      );

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Error during checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoPayment = async () => {
    if (!user?.id) {
      toast.error('Please sign in to purchase traffic');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post('/api/payments/nowpayments/create-payment', {
        amount: totalPrice,
        trafficGB: trafficAmount,
        email: user.emailAddresses?.[0]?.emailAddress,
      });

      if (data.paymentUrl) {
        // Redirect to NOWPayments checkout
        window.location.href = data.paymentUrl;
      } else {
        toast.error('Failed to create crypto payment');
      }
    } catch (error) {
      console.error('Error creating crypto payment:', error);
      toast.error('Error creating crypto payment');
    } finally {
      setLoading(false);
    }
  };

  const getDiscountTier = (gb: number): string => {
    if (gb <= 5) return 'Standard Rate';
    if (gb <= 50) return '50% Discount';
    if (gb <= 200) return '64% Discount';
    return '68% Discount';
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-2">Add More Traffic</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Purchase additional bandwidth for your proxy service
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Traffic Selector */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Select Traffic Amount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Display */}
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {trafficAmount}
                  <span className="text-3xl font-semibold text-blue-500 ml-2">GB</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {getDiscountTier(trafficAmount)}
                </div>
              </div>

              {/* Slider */}
              <div className="px-4">
                <Slider
                  value={[trafficAmount]}
                  onValueChange={(value) => setTrafficAmount(value[0])}
                  min={2}
                  max={1000}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                  <span>2 GB</span>
                  <span>250 GB</span>
                  <span>500 GB</span>
                  <span>1000 GB</span>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {[5, 50, 100, 200, 300, 500].map((amount) => (
                  <Button
                    key={amount}
                    variant={trafficAmount === amount ? 'default' : 'outline'}
                    onClick={() => setTrafficAmount(amount)}
                    className="w-full">
                    {amount} GB
                  </Button>
                ))}
              </div>

              {/* Volume Discounts Info */}
              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1 text-sm">Volume Discounts Applied</h4>
                      <div className="grid grid-cols-2 gap-x-4 text-xs text-gray-700 dark:text-gray-300">
                        <div>• 2-5 GB: $2.20/GB</div>
                        <div>• 6-50 GB: $1.10/GB (50% off)</div>
                        <div>• 51-200 GB: $0.80/GB (64% off)</div>
                        <div className="col-span-2">• 200+ GB: $0.70/GB (68% off)</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Price & Payment */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">Traffic Amount</span>
                <span className="font-semibold">{trafficAmount} GB</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">Price per GB</span>
                <span className="font-semibold">${pricePerGB}/GB</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600 dark:text-gray-400">Validity</span>
                <span className="font-semibold">1 Year</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-3xl font-bold text-blue-600">${totalPrice}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card className="border-2 border-blue-600">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Pay with Card</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Instant activation
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                size="lg">
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Pay ${totalPrice}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <Bitcoin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Pay with Crypto</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Bitcoin, USDT, and more
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCryptoPayment}
                disabled={loading}
                variant="outline"
                className="w-full h-12"
                size="lg">
                {loading ? 'Processing...' : 'Pay with Crypto'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
