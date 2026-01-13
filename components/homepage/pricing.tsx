'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';
import { useRouter } from 'next/navigation';

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
};

type PricingCardProps = {
  user: any;
  handleCheckout: any;
  priceIdMonthly: any;
  priceIdYearly: any;
  isYearly?: boolean;
  title: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  exclusive?: boolean;
  traffic?: number;
};

const PricingHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <section className="text-center">
    <h1
      className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}>
      {title}
    </h1>
    <p className="text-gray-600 dark:text-gray-400 pt-1">{subtitle}</p>
    <br />
  </section>
);

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="w-40 mx-auto" onValueChange={onSwitch}>
    <TabsList className="py-6 px-2">
      <TabsTrigger value="0" className="text-base">
        <p className="text-black dark:text-white">1 Year Validity</p>
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base">
        <p className="text-black dark:text-white">Unlimited</p>
      </TabsTrigger>
    </TabsList>
  </Tabs>
);

const PricingCard = ({
  user,
  handleCheckout,
  isYearly,
  title,
  priceIdMonthly,
  priceIdYearly,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  actionLabel,
  popular,
  exclusive,
  traffic,
}: PricingCardProps) => {
  const router = useRouter();
  return (
    <Card
      className={cn(
        `w-72 flex flex-col justify-between py-1 ${
          popular ? 'border-rose-400' : 'border-zinc-700'
        } mx-auto sm:mx-0`,
        {
          'animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors':
            exclusive,
        }
      )}>
      <div>
        <CardHeader className="pb-8 pt-4">
          <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg mb-4">
            {title}
          </CardTitle>

          {traffic > 0 ? (
            <div className="text-center my-6">
              <div className="text-5xl font-bold text-blue-600">
                {traffic >= 1000 ? traffic / 1000 : traffic}
                <span className="text-2xl font-semibold text-blue-500">
                  {traffic >= 1000 ? 'TB' : 'GB'}
                </span>
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                Traffic Included
              </div>
            </div>
          ) : (
            <div className="text-center my-6">
              <div className="text-4xl font-bold text-blue-600">Custom</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                Unlimited Traffic
              </div>
            </div>
          )}

          {isYearly && yearlyPrice && monthlyPrice && (
            <div className="flex justify-center mb-4">
              <div
                className={cn(
                  'px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white',
                  {
                    'bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ':
                      popular,
                  }
                )}>
                Save ${monthlyPrice * 12 - yearlyPrice}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <div className="text-center">
              {yearlyPrice && isYearly && traffic > 0 ? (
                <>
                  <div className="text-xl font-bold text-zinc-700 dark:text-zinc-300">
                    ${Math.ceil((yearlyPrice / traffic) * 100) / 100}/GB
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    ${yearlyPrice} billed yearly
                  </div>
                </>
              ) : monthlyPrice && traffic > 0 ? (
                <>
                  <div className="text-xl font-bold text-zinc-700 dark:text-zinc-300">
                    ${Math.ceil((monthlyPrice / traffic) * 100) / 100}/GB
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    ${monthlyPrice} billed monthly
                  </div>
                </>
              ) : (
                <div className="text-xl font-bold text-zinc-700 dark:text-zinc-300">
                  Contact for pricing
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {features.map((feature: string) => (
            <CheckItem key={feature} text={feature} />
          ))}
        </CardContent>
      </div>
      <CardFooter className="mt-2">
        <Button
          onClick={() => {
            if (user?.id) {
              handleCheckout(isYearly ? priceIdYearly : priceIdMonthly, true);
            } else {
              toast('Please login or sign up to purchase', {
                description: 'You must be logged in to make a purchase',
                action: {
                  label: 'Sign Up',
                  onClick: () => {
                    router.push('/sign-up');
                  },
                },
              });
            }
          }}
          className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          type="button">
          <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b fr om-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
  </div>
);

export default function Pricing() {
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const togglePricingPeriod = (value: string) =>
    setIsYearly(parseInt(value) === 1);
  const { user } = useUser();
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!));
  }, []);

  const handleCheckout = async (priceId: string, subscription: boolean) => {
    try {
      const { data } = await axios.post(
        `/api/payments/create-checkout-session`,
        {
          userId: user?.id,
          email: user?.emailAddresses?.[0]?.emailAddress,
          priceId,
          subscription,
        }
      );

      if (data.sessionId) {
        const stripe = await stripePromise;

        const response = await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        });

        return response;
      } else {
        console.error('Failed to create checkout session');
        toast('Failed to create checkout session');
        return;
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast('Error during checkout');
      return;
    }
  };

  const plans = [
    {
      title: 'Trial',
      monthlyPrice: 0.99,
      traffic: 1,
      yearlyPrice: 0.99,
      description: 'Perfect for testing our service',
      features: [
        '14 days validity',
        'All countries',
        'Premium Residential Proxies',
        '24/7 support',
      ],
      actionLabel: 'Start Trial - $0.99',
      priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      popular: false,
    },
    {
      title: 'Junior - 10 GBs',
      monthlyPrice: 19,
      traffic: 10,
      yearlyPrice: 19,
      description: 'Perfect for small projects',
      features: [
        '1 year validity',
        'All countries',
        'Premium Residential Proxies',
        '24/7 support',
      ],
      actionLabel: 'Get Started',
      priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_10GB,
      priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_10GB,
      popular: false,
    },
    {
      title: 'Mid - 50 GBs',
      monthlyPrice: 70,
      traffic: 40,
      yearlyPrice: 70,
      description: 'Perfect for small & medium businesses',
      features: [
        '1 year validity',
        'All countries',
        'Premium Residential Proxies',
        '24/7 support',
      ],
      actionLabel: 'Get Started',
      priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_30GB,
      priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_30GB_YEARLY,
      popular: true,
    },
    {
      title: 'Team Lead - 500 GBs',
      monthlyPrice: 550,
      traffic: 500,
      yearlyPrice: 550,
      description: 'Perfect for growing teams',
      features: [
        'Unlimited validity',
        'All countries',
        'Premium Residential Proxies',
        '24/7 support',
        'Priority support',
      ],
      actionLabel: 'Get Started',
      priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_500GB,
      priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_500GB_YEARLY,
      popular: true,
    },
    {
      title: 'CTO - 1TB',
      monthlyPrice: 710,
      traffic: 1000,
      yearlyPrice: 710,
      description: 'For high-volume operations',
      features: [
        'Unlimited validity',
        'All countries',
        'Premium Residential Proxies',
        '24/7 support',
        'Priority support',
      ],
      actionLabel: 'Get Started',
      priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      popular: true,
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      traffic: 0,
      description: 'Dedicated support and infrastructure',
      features: [
        'Custom deal',
        'Unlimited validity',
        'All countries',
        'Premium Residential Proxies',
        '24/7 support',
        'Dedicated account manager',
      ],
      actionLabel: 'Contact Sales',
      priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      exclusive: true,
    },
  ];

  return (
    <div>
      <PricingHeader
        title="Select the Best Plan for You"
        subtitle="Choose between 1 year validity or unlimited validity"
      />
      <PricingSwitch onSwitch={togglePricingPeriod} />
      <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
        {plans.map((plan) => {
          return (
            <PricingCard
              user={user}
              handleCheckout={handleCheckout}
              key={plan.title}
              {...plan}
              isYearly={isYearly}
            />
          );
        })}
      </section>
    </div>
  );
}
