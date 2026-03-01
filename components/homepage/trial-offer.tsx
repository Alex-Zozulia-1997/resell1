'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { toast } from 'sonner';
import { Zap, Star, CheckCircle, Sparkles } from 'lucide-react';
import { BorderBeam } from '@/components/magicui/border-beam';

export default function TrialOffer() {
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);

  const handleTrialPurchase = async () => {
    if (!isSignedIn || !user?.id) {
      toast.info('Sign in to purchase trial', {
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
      const { data } = await axios.post(
        `/api/payments/create-checkout-session`,
        {
          userId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          trafficGB: 1,
          amount: 99, // $0.99 in cents
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

  return (
    <div className="max-w-7xl mx-auto mb-8">
      <div className="relative">
        <Card className="border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 shadow-2xl shadow-emerald-500/20">
          <BorderBeam size={250} duration={12} delay={9} />
          <CardContent className="py-4 px-8">
            {/* Trial Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold text-sm">LIMITED TIME TRIAL</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-4">
              {/* Left Section - Price & Title */}
              <div className="flex items-center gap-8 flex-1">
                <div className="text-center">
                  <div className="relative">
                    <div className="text-6xl font-black bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      $0.99
                    </div>
                    <div className="absolute -top-2 -right-8">
                      <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full transform rotate-12 font-bold">
                        55% OFF
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-semibold">
                    1 GB Trial Package
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 line-through">
                    Regular: $2.20
                  </div>
                </div>
                
                <div className="border-l-2 border-gradient-to-b from-emerald-300 to-teal-300 h-20 hidden lg:block bg-gradient-to-b from-emerald-300 to-teal-300 w-0.5"></div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                      Try IPden Risk-Free
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2 text-lg">
                    Experience premium residential proxies with our exclusive trial offer
                  </p>
                  
                  {/* Feature List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium">All countries included</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium">24/7 premium support</span>
                    </div> */}
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium">14-day validity</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium">High-speed proxies</span>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Right Section - CTA */}
              <div className="flex flex-col items-center gap-2">
                {/* <div className="text-center mb-">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Join our satisfied customers</div>
                  <div className="flex items-center gap-1 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-2">4.9/5</span>
                  </div>
                </div> */}
                
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 py-4 text-lg font-bold shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105 rounded-xl"
                  onClick={handleTrialPurchase}
                  disabled={loading}
                >
                  <Zap className="w-5 h-5 mr-3" />
                  {loading ? 'Processing...' : 'Start Your Trial Now'}
                </Button>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
                  ✨ No commitment • Cancel anytime • Instant activation
                </div>
              </div>
            </div>

         
          </CardContent>
        </Card>
      </div>
    </div>
  );
}