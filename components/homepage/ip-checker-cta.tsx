import { Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function IPCheckerCTA() {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 border-2 border-blue-600">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Icon */}
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Globe className="w-10 h-10 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Check Any IP Address
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Get detailed information about any IP including location, provider, and proxy detection. Free to use!
              </p>
            </div>
            
            {/* CTA Button */}
            <Link href="/ip-checker">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Try IP Checker
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
