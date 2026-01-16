import { Globe, Zap, Shield, MapPin, Clock, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Pricing from '@/components/homepage/pricing';
import UseCases from '@/components/homepage/use-cases';

const Logo = ({ textSize = 'text-xl', roundness = 'rounded-lg' }) => {
  return (
    <div className={`flex items-center justify-center w-auto bg-gray-200 dark:bg-gray-800 ${roundness} pl-2 pr-1 py-1`}>
      <span className={`${textSize} font-bold text-gray-100 bg-gray-900 dark:bg-white dark:text-gray-900 rounded pl-1 pr-[2px] tracking-widest`}>
        IP
      </span>
      <span className={`${textSize} font-bold text-gray-800 dark:text-gray-200 pl-[2px]`}>
        den
      </span>
    </div>
  );
};

const popularCountries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', cities: '500+' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', cities: '150+' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', cities: '200+' },
  { code: 'FR', name: 'France', flag: '🇫🇷', cities: '180+' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', cities: '120+' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', cities: '100+' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', cities: '150+' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', cities: '200+' },
  { code: 'IN', name: 'India', flag: '🇮🇳', cities: '300+' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', cities: '140+' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', cities: '130+' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', cities: '80+' },
];

export default function ResidentialProxies() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo textSize="text-4xl" roundness="rounded-xl" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Residential Proxies
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Premium residential IP addresses from real devices in 195+ countries. Enjoy 99.9% uptime, unlimited concurrent sessions, and blazing-fast speeds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">16M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Residential IPs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">195+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">&lt;2s</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Our Residential Proxies?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access 16M+ residential IPs across 195+ countries with city and state-level targeting
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Average response time under 2 seconds with unlimited concurrent connections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Elite Anonymity</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Real residential IPs that are indistinguishable from regular users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Geo-Targeting</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Target specific countries, states, and cities for precise location-based access
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Session Control</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose between rotating IPs or sticky sessions lasting up to 24 hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">99.9% Uptime</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enterprise-grade infrastructure with guaranteed high availability
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Popular Countries & Regions
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Access residential IPs from the most popular countries with extensive city coverage
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularCountries.map((country) => (
              <Card key={country.code} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 pb-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{country.flag}</div>
                    <h3 className="font-semibold mb-1">{country.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {country.cities} cities
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              + 183 more countries available
            </p>
            <Link href="/dashboard">
              <Button variant="outline">
                View All Locations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases Component */}
      <UseCases />

      {/* Protocol Support */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Protocol Support
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">HTTP/HTTPS</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Port 9000 - Rotating</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Port 10000 - Session (Sticky)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>SSL/TLS Support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">SOCKS5</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Port 11000 - Rotating</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Port 12000 - Session (Sticky)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>UDP Support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4">
        <Pricing />
      </section>

      {/* Performance Stats */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Performance Metrics
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">1000+</h3>
                <p className="text-gray-600 dark:text-gray-400">Requests per second supported</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Unlimited</h3>
                <p className="text-gray-600 dark:text-gray-400">Concurrent connections</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">24 hours</h3>
                <p className="text-gray-600 dark:text-gray-400">Maximum session duration</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Start with our $0.99 trial and experience the power of premium residential proxies
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact-sales">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
