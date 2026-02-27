'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { toast } from 'sonner';
import { Bitcoin, CreditCard, Zap, Star } from 'lucide-react';
import { BorderBeam } from '@/components/magicui/border-beam';
import TrialOffer from './trial-offer';

export default function AddTrafficComponent() {
  const { user, isSignedIn } = useUser();
  const [trafficAmount, setTrafficAmount] = useState<number>(50);
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
    if (gb <= 1000) return 0.7; // $0.70/GB for 201-1000GB
    return 0.6; // $0.60/GB for 1TB+
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
    if (!isSignedIn || !user?.id) {
      toast.info('Sign in to purchase traffic', {
        description: 'Create an account or sign in to get started',
        duration: 4000,
      });
      setTimeout(() => {
        window.location.href = '/sign-up';
      }, 1000);
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
    if (!isSignedIn || !user?.id) {
      toast.info('Sign in to purchase traffic', {
        description: 'Create an account or sign in to get started',
        duration: 4000,
      });
      setTimeout(() => {
        window.location.href = '/sign-up';
      }, 1000);
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
    if (gb <= 1000) return '68% Discount';
    return '73% Discount';
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-2">Buy Custom Amount</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Purchase additional bandwidth with flexible pricing
        </p>
      </div>

      {/* Trial Offer Component */}
      <TrialOffer />

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
                  min={5}
                  max={2000}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                  <span>5 GB</span>
                  <span>1 TB</span>
                  <span>2 TB</span>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                {[
                  { value: 5, label: '5 GB' },
                  { value: 50, label: '50 GB' },
                  { value: 100, label: '100 GB' },
                  { value: 200, label: '200 GB' },
                  { value: 500, label: '500 GB' },
                  { value: 1000, label: '1 TB' },
                  { value: 1500, label: '1.5 TB' },
                  { value: 2000, label: '2 TB' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={trafficAmount === option.value ? 'default' : 'outline'}
                    onClick={() => setTrafficAmount(option.value)}
                    className="w-full text-xs">
                    {option.label}
                  </Button>
                ))}
              </div>

              {/* Volume Discounts Info */}
              <Card className="border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-base bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                        Volume Discounts Applied
                      </h4>
                    
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { range: '5 GB', price: '$2.20/GB', discount: 'Standard', color: 'gray' },
                      { range: '6-50 GB', price: '$1.10/GB', discount: '50% OFF', color: 'blue' },
                      { range: '51-200 GB', price: '$0.80/GB', discount: '64% OFF', color: 'purple' },
                      { range: '201-1000 GB', price: '$0.70/GB', discount: '68% OFF', color: 'indigo' },
                      { range: '1TB+', price: '$0.60/GB', discount: '73% OFF', color: 'green', featured: true }
                    ].map((tier, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                          tier.featured
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-300 dark:border-green-600 shadow-md'
                            : 'bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            tier.color === 'gray' ? 'bg-gray-400' :
                            tier.color === 'blue' ? 'bg-blue-500' :
                            tier.color === 'purple' ? 'bg-purple-500' :
                            tier.color === 'indigo' ? 'bg-indigo-500' :
                            'bg-green-500'
                          } ${tier.featured ? 'animate-pulse' : ''}`}></div>
                          <span className={`text-sm font-medium ${
                            tier.featured ? 'text-green-800 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {tier.range}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${
                            tier.featured ? 'text-green-700 dark:text-green-200' : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {tier.price}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            tier.featured
                              ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                              : tier.color === 'gray'
                              ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              : `bg-${tier.color}-100 text-${tier.color}-800 dark:bg-${tier.color}-800 dark:text-${tier.color}-200`
                          }`}>
                            {tier.discount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Best Value Indicator */}
                 
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
                disabled={loading || !isSignedIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                size="lg">
                {loading ? (
                  'Processing...'
                ) : !isSignedIn ? (
                  'Sign Up to Purchase'
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
                disabled={loading || !isSignedIn}
                variant="outline"
                className="w-full h-12"
                size="lg">
                {loading ? 'Processing...' : !isSignedIn ? 'Sign Up to Purchase' : 'Pay with Crypto'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
