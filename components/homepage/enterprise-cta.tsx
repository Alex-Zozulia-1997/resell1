import { Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EnterpriseCTA() {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <Zap className="w-8 h-8" />
                <h3 className="text-3xl md:text-4xl font-bold">
                  Need 1TB+ Per Month?
                </h3>
              </div>
              <p className="text-lg text-white/90 mb-6">
                Get custom pricing, dedicated support, and enterprise-grade infrastructure tailored to your needs.
              </p>
              <ul className="space-y-2 text-white/80 text-left max-w-md mx-auto md:mx-0">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  Custom bandwidth packages
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  Dedicated account manager
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  Priority 24/7 support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  Flexible payment terms
                </li>
              </ul>
            </div>
            
            {/* CTA Button */}
            <div className="flex flex-col gap-4">
              <Link href="/contact-sales">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
                  Contact Sales
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <p className="text-sm text-white/70 text-center">
                Response within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
