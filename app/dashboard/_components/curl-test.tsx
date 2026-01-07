import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CurlTest({ userData }: { userData: any }) {
  const handleCopy = (code: any) => {
    navigator.clipboard.writeText(code).then(
      () => alert('Code copied to clipboard!'),
      (err) => console.error('Failed to copy code:', err)
    );
  };

  const listTests = [
    {
      name: 'HTTP Request',
      code: `curl -x proxy.ipden.io:9000 -U ${userData?.authorization?.username}-country-us-state-nevada:${userData?.authorization?.password} http://ip-api.com`,
    },
    {
      name: 'HTTP Session',
      code: `curl -x proxy.ipden.io:10000 -U ${userData?.authorization?.username}-country-us:${userData?.authorization?.password} http://ip-api.com`,
    },
    {
      name: 'Socks5 Request',
      code: `curl -x socks5://${userData?.authorization?.username}-country-us:${userData?.authorization?.password}@proxy.ipden.io:11000 http://ip-api.com  `,
    },
    {
      name: 'Socks5 Session',
      code: `curl -x socks5://${userData?.authorization?.username}-country-us:${userData?.authorization?.password}@proxy.ipden.io:12000 http://ip-api.com  `,
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center gap-2 mt-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-1">
          <CardTitle className="text-center font- w-full p-2">
            Test Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {listTests.map((test, index) => (
            <Card className="w-full pb-1 mb-1 " key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-1">
                <CardTitle className="text-md font-medium">
                  {test.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <p
                  className="text-sm px-6 py-4 bg-gray-900 text-green-400 rounded-md font-mono break-words overflow-wrap cursor-pointer hover:bg-gray-800"
                  onClick={() => handleCopy(test.code)} // Pass the specific code to copy
                >
                  {test.code}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to copy
                </p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
