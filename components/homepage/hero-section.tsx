'use client';

import { ArrowRight, CheckCircle2, Globe, Zap, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { BorderBeam } from '../magicui/border-beam';
import { Button } from '../ui/button';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import Logo from '@/components/Logo';

export default function HeroSection() {
  const { user } = useUser();
  const router = useRouter();

  const handleTrialCheckout = async () => {
    if (!user?.id) {
      toast('Please login or sign up to purchase', {
        description: 'You must be logged in to start the trial',
        action: {
          label: 'Sign Up',
          onClick: () => router.push('/sign-up'),
        },
      });
      return;
    }

    try {
      // Check if user has already used their trial
      const { data: existingTrial } = await axios.get(`/api/payments/check-trial?email=${encodeURIComponent(user.emailAddresses?.[0]?.emailAddress || '')}`);
      
      if (existingTrial?.hasUsedTrial) {
        toast('Trial already used', {
          description: 'You have already used your $1 trial. Please purchase a regular plan.',
          action: {
            label: 'Buy Custom Amount',
            onClick: () => router.push('/dashboard/addTraffic'),
          },
        });
        return;
      }

      const { data } = await axios.post(
        `/api/payments/create-checkout-session`,
        {
          userId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          trafficGB: 1,
          amount: 100, // $1.00 in cents
        }
      );

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session');
        toast('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast('Error during checkout');
    }
  };

const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || '#';
  return (
    <section
      className="flex flex-col items-center justify-center px-4 py-4 lg:py-8"
      aria-label="IPden Hero Section">
      
      {/* Main Hero Content */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="flex justify-center mb-8">
          <Logo textSize="text-6xl lg:text-8xl" roundness="rounded-2xl" />
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto leading-tight">
          Premium Residential Proxies for Your Business
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          Access 195+ countries with 99.9% uptime. Fast, secure, and reliable proxy network for all your needs.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <Link href="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
              Get Started 
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-6 text-lg"
            onClick={handleTrialCheckout}
          >
            Try Proxies for $1
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Instant activation</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="w-full max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-1">195+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-1">16M+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Residential IPs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-1">99.9%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-1">&lt;600ms</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="w-full max-w-6xl mx-auto mb-16">
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl">
          <Image
            src="/db.png"
            alt="IPden Dashboard Preview"
            width={1100}
            height={550}
            priority={true}
            className="w-full h-auto"
          />
          <BorderBeam size={350} duration={18} delay={9} />
        </div>
      </div>
    </section>
  );
}
