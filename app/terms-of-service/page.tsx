import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | IPden',
  description: 'Terms and conditions governing the use of IPden proxy services.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              These are the terms and conditions governing the use of IPden (the Service) and the agreement that operates 
              between us and you (the Terms). The Service is owned and operated by IPden (us/our/we), and these Terms 
              set out the rights and obligations of all users (you/your) concerning your use of the Service.
            </p>
            <p>
              Please read these Terms and our Privacy Policy carefully. By using the Service, you are consenting to be 
              bound by the current Terms and our Privacy Policy. We may revise the Terms and information contained in 
              the Service at any time and without notice. If you do not agree to these Terms or the Privacy Policy, 
              please refrain from using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
            <p>
              IPden provides residential and datacenter proxy services that allow users to route their internet traffic 
              through our proxy network. Our services are designed for legitimate use cases including web scraping, 
              data collection, market research, ad verification, and other lawful business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptable Use Policy</h2>
            <p>You may use our Service only for lawful purposes. You may not use our Service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>In any way that breaches any applicable local, national, or international law or regulation;</li>
              <li>In any way that is unlawful or fraudulent, or has any illegal or fraudulent purpose or effect;</li>
              <li>To transmit any data that contains viruses, malware, or any other harmful programs;</li>
              <li>To access or attempt to access accounts, systems, or networks without proper authorization;</li>
              <li>To engage in any form of harassment, abuse, or spamming;</li>
              <li>To violate the terms of service of third-party websites or services;</li>
              <li>To engage in any activity that could damage, disable, or impair our Service or interfere with other users;</li>
              <li>To resell or redistribute our services without explicit written permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Account Registration and Security</h2>
            <p>
              To access certain features of our Service, you must register for an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing accurate, current, and complete information during registration;</li>
              <li>Maintaining the security of your account credentials;</li>
              <li>All activities that occur under your account;</li>
              <li>Notifying us immediately of any unauthorized use of your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Payment Terms</h2>
            <p>
              Our Service operates on a prepaid basis. You must purchase traffic credits before using our proxy services. 
              Payment terms include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All payments are processed securely through Stripe or NOWPayments;</li>
              <li>Traffic credits are non-refundable unless required by applicable law;</li>
              <li>Unused traffic credits do not expire but are tied to your account;</li>
              <li>We reserve the right to modify pricing with 30 days notice to existing customers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
            <p>
              While we strive to maintain high availability, we do not guarantee uninterrupted access to our Service. 
              We may temporarily suspend or restrict access for maintenance, security, or other operational reasons. 
              We are not liable for any losses resulting from service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p>
              All content, features, and functionality of our Service, including but not limited to text, graphics, 
              logos, and software, are owned by IPden and are protected by copyright, trademark, and other intellectual 
              property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Privacy and Data Protection</h2>
            <p>
              We respect your privacy and are committed to protecting your personal information. Our Privacy Policy, 
              which is incorporated into these Terms by reference, describes how we collect, use, and protect your information. 
              By using our Service, you consent to our privacy practices as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p>
              To the extent permitted by law, IPden shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Loss of profits, revenue, or business;</li>
              <li>Loss of data or information;</li>
              <li>Business interruption;</li>
              <li>Loss of goodwill or reputation;</li>
              <li>Any other commercial losses.</li>
            </ul>
            <p>
              Our total liability to you for any claims related to the Service shall not exceed the amount you paid 
              for the Service in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless IPden, its officers, directors, employees, and agents 
              from any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorney fees) 
              arising from your use of the Service, your violation of these Terms, or your violation of any rights of a third party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice, 
              if you breach these Terms. Upon termination, your right to use the Service will cease immediately. 
              You may terminate your account at any time by contacting our support team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant changes 
              by email or through our Service. Your continued use of the Service after changes become effective 
              constitutes acceptance of the revised Terms. You can always review the most current version on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where 
              IPden is incorporated, without regard to conflict of law principles. Any disputes arising from these 
              Terms or your use of the Service shall be resolved in the courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be 
              limited or eliminated to the minimum extent necessary so that the remaining provisions remain in 
              full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us through our support system 
              or email us. We will respond to your inquiries as promptly as possible.
            </p>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>Last updated: January 26, 2026</p>
          <p className="mt-2">
            For questions about these terms, please{' '}
            <a href="/contact-sales" className="text-primary hover:underline">
              contact our support team
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}