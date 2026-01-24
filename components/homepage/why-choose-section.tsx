import { ArrowRight, Globe, Zap, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { OrbitingCirclesComponent } from './orbiting-circles';

export default function WhyChooseSection() {
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || '#';
  
  return (
    <section className="flex flex-col items-center justify-center px-4 py-16">
      {/* Features Grid */}
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Why Choose IPden?
        </h2>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="space-y-6">
            <div className="flex gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Global Coverage</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access proxies from 195+ countries with city and state level targeting
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Premium residential IPs with response times under 600ms
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Secure & Private</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Elite anonymity level with enterprise-grade encryption
                </p>
              </div>
            </div>
          </div>

          {/* Orbiting Circles Visualization */}
          <div className="flex justify-center">
            <OrbitingCirclesComponent />
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="w-full max-w-4xl mx-auto mt-16 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-6">Trusted by developers and businesses worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="font-semibold">16M+ IPs</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span className="font-semibold">195+ Countries</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">99.9% Uptime</span>
          </div>
        </div>
      </div>

      <Link
        href={telegramUrl}
        target="_blank"
        className="mt-5"
        aria-label="Join Telegram (opens in a new tab)">
        <Button variant="outline" className="flex gap-1">
          Join Telegram
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Button>
      </Link>
    </section>
  );
}
