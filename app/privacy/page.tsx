import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | IPden',
  description: 'Privacy policy for IPden proxy services - how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              This Privacy Policy describes how Riterio Gambitas, MB (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects, uses, and shares 
              information about you when you use our website and proxy services (collectively, the &quot;Service&quot;). This 
              Privacy Policy applies to information we collect when you access or use our Service.
            </p>
            <p>
              We are committed to protecting your privacy and ensuring that your personal information is handled in a 
              safe and responsible manner. By using our Service, you agree to the collection and use of information in 
              accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">Information You Provide to Us</h3>
            <p>We collect information you provide directly to us, such as when you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create an account or register for our Service</li>
              <li>Make a purchase or transaction</li>
              <li>Contact us for customer support</li>
              <li>Subscribe to our newsletters or promotional communications</li>
              <li>Participate in surveys, contests, or promotions</li>
            </ul>
            <p>This information may include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Payment information (credit card details, billing address)</li>
              <li>Communications with us (support tickets, emails)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">Information We Collect Automatically</h3>
            <p>When you access or use our Service, we automatically collect certain information, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage information (pages visited, time spent on pages, click data)</li>
              <li>Log information (access times, error logs, performance data)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">Proxy Usage Information</h3>
            <p>When you use our proxy services, we may collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Connection logs and metadata (timestamps, data usage, connection duration)</li>
              <li>IP addresses used for proxy connections</li>
              <li>Bandwidth and traffic statistics</li>
              <li>Geographic location data related to proxy usage</li>
            </ul>
            <p>
              <strong>Important:</strong> We do not monitor, log, or store the content of your internet traffic when 
              using our proxy services. We only collect metadata necessary for service operation and billing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Communicate with you about products, services, offers, and events</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Comply with legal obligations and resolve disputes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Sharing and Disclosure</h2>
            <p>We may share information about you in the following situations:</p>
            
            <h3 className="text-xl font-semibold mb-3">With Your Consent</h3>
            <p>We may share your information when you give us explicit consent to do so.</p>

            <h3 className="text-xl font-semibold mb-3 mt-4">For Legal Reasons</h3>
            <p>We may share your information if we believe it&apos;s necessary to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Comply with applicable law, regulation, legal process, or governmental request</li>
              <li>Enforce our Terms of Service and other agreements</li>
              <li>Protect the security or integrity of our Service</li>
              <li>Protect the rights, property, or safety of us, our users, or others</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">Service Providers</h3>
            <p>
              We may share your information with third-party service providers who perform services on our behalf, 
              such as payment processing, data analysis, email delivery, hosting services, and customer service.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Business Transfers</h3>
            <p>
              If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as 
              part of that transaction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>
              We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized 
              access, disclosure, alteration, and destruction. However, no internet or electronic storage system is 100% 
              secure, so we cannot guarantee absolute security.
            </p>
            <p>Security measures we implement include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p>
              We retain personal information for as long as necessary to provide our services, comply with legal 
              obligations, resolve disputes, and enforce our agreements. When we no longer need personal information, 
              we will securely delete or anonymize it.
            </p>
            <p>Specific retention periods include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information: Retained while your account is active and for 2 years after closure</li>
              <li>Transaction records: Retained for 7 years for tax and accounting purposes</li>
              <li>Usage logs: Retained for 30 days for service operation and debugging</li>
              <li>Support communications: Retained for 3 years for quality assurance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
            <p>You have certain rights regarding your personal information, including:</p>
            
            <h3 className="text-xl font-semibold mb-3">Access and Portability</h3>
            <p>You can request access to the personal information we hold about you and receive a copy in a portable format.</p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Correction</h3>
            <p>You can request that we correct inaccurate or incomplete personal information.</p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Deletion</h3>
            <p>
              You can request that we delete your personal information, subject to certain exceptions such as legal 
              obligations or legitimate business purposes.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4">Communication Preferences</h3>
            <p>
              You can opt out of receiving promotional communications from us by following the unsubscribe instructions 
              in those communications or contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect information about your browsing activities 
              and provide personalized experiences. Cookies are small data files stored on your device.
            </p>
            <p>We use the following types of cookies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential cookies:</strong> Necessary for the website to function properly</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors use our website</li>
              <li><strong>Functional cookies:</strong> Enable enhanced functionality and personalization</li>
              <li><strong>Advertising cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
            <p>
              You can control cookies through your browser settings, but disabling certain cookies may affect the 
              functionality of our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure that 
              such transfers comply with applicable data protection laws and implement appropriate safeguards to protect 
              your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Children&apos;s Privacy</h2>
            <p>
              Our Service is not intended for children under the age of 18. We do not knowingly collect personal 
              information from children under 18. If you are a parent or guardian and believe your child has provided 
              us with personal information, please contact us, and we will delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material changes, we will notify you by 
              email (sent to the email address specified in your account) or by posting a notice on our website prior 
              to the change becoming effective. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p>
              <strong>Riterio Gambitas, MB</strong><br />
              Email: contact@ipden.io<br />
              Subject: Privacy Policy Inquiry
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
              Last updated: March 1, 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}