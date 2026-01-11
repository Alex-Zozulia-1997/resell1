'use client';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap, ArrowRight } from 'lucide-react';

interface PurchaseCardProps {
  price: number;
  data: number;
}

export default function PurchaseCard({ price, data }: PurchaseCardProps) {
  return (
    <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-3xl font-bold">{data} GB</h3>
          <p className="text-sm text-muted-foreground">Traffic Package</p>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>

        {/* Features */}
        <ul className="space-y-3">
          <li className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <span>Premium residential proxies</span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <span>99.9% uptime guarantee</span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <span>Instant activation</span>
          </li>
          <li className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <span>24/7 support</span>
          </li>
        </ul>

        {/* CTA Button */}
        <Button 
          className="w-full group/btn relative overflow-hidden"
          size="lg"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Get Started
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </span>
        </Button>

        {/* Popular badge for specific plans */}
        {data === 10 && (
          <div className="absolute -top-1 -right-1">
            <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              Popular
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
