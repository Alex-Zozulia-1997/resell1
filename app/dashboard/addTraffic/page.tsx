'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import PurchaseCard from '../_components/purchase-card';
import { Zap, TrendingUp, Package } from 'lucide-react';

const offerings = [
  { price: 10, data: 3 },
  { price: 20, data: 5 },
  { price: 30, data: 10 },
  { price: 30, data: 10 },
];

export default function Category() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Traffic Plans
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Get More Traffic
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the perfect plan to boost your proxy traffic. All plans include
            premium residential proxies.
          </p>
        </div>

        {/* Offerings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {offerings.map((offering, index) => (
            <div
              key={index}
              className="transform transition-all duration-300 hover:scale-105"
            >
              <PurchaseCard {...offering} />
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-card border-2 border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Instant Activation</h3>
            <p className="text-sm text-muted-foreground">
              Your traffic is added immediately after purchase
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-card border-2 border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Premium Quality</h3>
            <p className="text-sm text-muted-foreground">
              High-speed residential proxies with 99.9% uptime
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-card border-2 border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Flexible Plans</h3>
            <p className="text-sm text-muted-foreground">
              Choose from multiple plans that fit your needs
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
