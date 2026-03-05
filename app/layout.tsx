import Provider from '@/app/provider'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import AuthWrapper from '@/components/wrapper/auth-wrapper'
import CookieConsentWrapper from '@/components/cookie-consent-wrapper'
import { Analytics } from "@vercel/analytics/react"
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL("https://ipden.io"),
  title: {
    default: 'IPden - Premium Residential Proxies',
    template: `%s | IPden`
  },
  description: 'Premium residential proxy service with unlimited validity. Purchase traffic, no subscriptions, no recurring payments. High-quality residential proxies from all countries.',
  openGraph: {
    description: 'Premium residential proxy service with unlimited validity. Purchase traffic, no subscriptions, no recurring payments. High-quality residential proxies from all countries.',
    images: ['https://utfs.io/f/8a428f85-ae83-4ca7-9237-6f8b65411293-eun6ii.png'],
    url: 'https://ipden.com'
  },
 
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthWrapper>
      <html lang="en" suppressHydrationWarning>
        <head>
        </head>
        <body className={GeistSans.className}>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              forcedTheme="light"
              disableTransitionOnChange
            >
              {children}
              <Toaster />
              
              {/* Cookie Consent Banner */}
              <CookieConsentWrapper />
            </ThemeProvider>
          </Provider>
          <Analytics />
          
          {/* Tawk.to Live Chat */}
          <Script
            id="tawk-to-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/697780cf644c08197db0c7c3/1jftcube1';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
                })();
              `,
            }}
          />

        </body>
      </html>
    </AuthWrapper>
  )
}