import IPChecker from '@/components/ip-checker';

export default function IPCheckerPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">IP Address Checker</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Check any IP address for location, provider, and proxy detection
          </p>
        </div>
        
        <IPChecker />

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="text-3xl mb-2">🌍</div>
            <h3 className="font-semibold mb-2">Geolocation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Accurate location data including city, region, and coordinates
            </p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-semibold mb-2">Proxy Detection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Identify VPN, proxy, and datacenter connections
            </p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold mb-2">Instant Results</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fast and reliable IP information lookup
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
