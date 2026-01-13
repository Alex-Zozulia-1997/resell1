import { 
  Search, 
  ShoppingCart, 
  BarChart3, 
  Shield, 
  Database, 
  Globe 
} from 'lucide-react';

const useCases = [
  {
    icon: Search,
    title: 'Web Scraping',
    description: 'Extract data from any website without getting blocked. Perfect for market research and competitive analysis.',
    features: ['Unlimited requests', 'Rotate IPs automatically', 'No CAPTCHA blocks']
  },
  {
    icon: ShoppingCart,
    title: 'Price Comparison',
    description: 'Monitor competitor pricing across multiple regions and platforms in real-time.',
    features: ['Real-time data', 'Multi-region access', 'Accurate pricing']
  },
  {
    icon: BarChart3,
    title: 'SEO Monitoring',
    description: 'Track search engine rankings and monitor SERP changes from different locations.',
    features: ['Location-specific results', 'Keyword tracking', 'SERP analysis']
  },
  {
    icon: Shield,
    title: 'Ad Verification',
    description: 'Verify ad placement and detect fraud across different geos and devices.',
    features: ['Ad fraud detection', 'Compliance checking', 'Campaign monitoring']
  },
  {
    icon: Database,
    title: 'Market Research',
    description: 'Gather market intelligence and consumer insights from global sources.',
    features: ['Global data access', 'Trend analysis', 'Competitor insights']
  },
  {
    icon: Globe,
    title: 'Brand Protection',
    description: 'Monitor unauthorized use of your brand and intellectual property worldwide.',
    features: ['Trademark monitoring', 'Counterfeit detection', 'Brand mentions']
  },
];

export default function UseCases() {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Perfect for Every Use Case
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our premium residential proxies are trusted by businesses worldwide for various applications
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                {/* Icon */}
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {useCase.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                  {useCase.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {useCase.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ready to get started with your use case?
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Start Free Trial
          </a>
        </div>
      </div>
    </section>
  );
}
