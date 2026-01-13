import { ArrowRight, CheckCircle2, Globe, Zap, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { BorderBeam } from '../magicui/border-beam';
import { Button } from '../ui/button';
import Image from 'next/image';

const Logo = ({
  textSize = 'text-xl',
  roundness = 'rounded-lg',
}) => {
  return (
    <div
      className={`flex items-center justify-center w-auto bg-gray-200 dark:bg-gray-800 ${roundness} pl-2 pr-1 py-1`}>
      <span
        className={`${textSize} font-bold text-gray-100 bg-gray-900 dark:bg-white dark:text-gray-900 rounded pl-1 pr-[2px] tracking-widest`}>
        IP
      </span>
      <span className={`${textSize} font-bold text-gray-800 dark:text-gray-200 pl-[2px]`}>
        den
      </span>
    </div>
  );
};

export default function HeroSection() {
  return (
    <section
      className="flex flex-col items-center justify-center px-4 py-16 lg:py-24"
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
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/free-proxies">
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
              Try Free Proxies
            </Button>
          </Link>
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
            <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-1">&lt;2s</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="w-full max-w-6xl mx-auto mb-16">
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl">
          <Image
            src="https://utfs.io/f/31dba2ff-6c3b-4927-99cd-b928eaa54d5f-5w20ij.png"
            alt="IPden Dashboard Preview"
            width={1100}
            height={550}
            priority={true}
            className="w-full h-auto"
          />
          <BorderBeam size={250} duration={18} delay={9} />
        </div>
      </div>

      {/* Features Grid */}
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Why Choose IPden?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Global Coverage</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access proxies from 195+ countries with city and state level targeting
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Lightning Fast</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Premium residential IPs with response times under 2 seconds
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Elite anonymity level with enterprise-grade encryption
            </p>
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
    </section>
  );
}
