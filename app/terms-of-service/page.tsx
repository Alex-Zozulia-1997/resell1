import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | IPden',
  description: 'Terms and conditions governing the use of IPden proxy services.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Terms & Conditions</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              These are the terms and conditions governing the use of IPden, (the Website) and the agreement that operates 
              between us and you (the Terms). The Website is owned and operated by Riterio Gambitas, MB (us/our/we), and 
              these Terms set out the rights and obligations of all users (you/your) concerning your use of the Website.
            </p>
            <p>
              Please read these Terms and our Privacy Statement carefully. Using the Website, you are consenting to be 
              bound by the current Terms and our Privacy Statement. We may revise the Terms and information contained on 
              the Website at any time and without notice. If you do not agree to these Terms or the Privacy Statement, 
              please refrain from using the Website.
            </p>
            <p>
              If you have any questions about the Terms or the Privacy Statement, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Conduct of use</h2>
            <p>
              You are allowed to access the content of this Website for your personal, non-commercial use, provided you do so 
              without violation of copyright and other proprietary rights and provided you do not use this Website for any purpose 
              that is unlawful or prohibited by these terms and conditions. You accept not to use this Website in any way that is 
              unlawful, abusive, threatening, harassing, obscene, defamatory, hateful, or in any other way violating these terms 
              and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Liability</h2>
            <p>
              The material contained within the Website is provided without any guarantees, conditions, or warranties as to its 
              accuracy. Riterio Gambitas, MB does not represent that information contained on or available via the Website is 
              accurate or complete, and accordingly, it should not be relied on as such. It would be best if you did not rely on 
              any such information. Any arrangements made between you and any other person using or named on the Website are entirely 
              at your sole risk and responsibility.
            </p>
            <p>
              To the extent permitted by law, we and third parties connected to us hereby expressly exclude:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>all conditions, warranties, and other terms which might otherwise be implied by statute, common law, or the law of equity;</li>
              <li>any liability for loss or damage incurred by any user in connection with the use, inability to use, or results of the use of the Website, any websites linked to it, and any material posted on it;</li>
              <li>any liability for any bugs or faults in our systems or tools; and</li>
              <li>any liability for any direct, special, indirect, or consequential loss or damage incurred by any user in connection with the Website or in connection with the use, inability to use, or results of the use of the Website, any websites linked to it and any materials posted on it, including, without limitation any liability for:
                <ol className="list-decimal pl-6 space-y-1 mt-2">
                  <li>loss of income or revenue;</li>
                  <li>loss of business;</li>
                  <li>loss of profits or contracts;</li>
                  <li>loss of anticipated savings;</li>
                  <li>loss of data;</li>
                  <li>loss of goodwill;</li>
                  <li>wasted management or office time;</li>
                  <li>for any other loss or damage of any kind, however arising and whether caused by tort (including negligence), breach of contract or otherwise, even if foreseeable.</li>
                </ol>
              </li>
            </ul>
            <p>
              Nothing in this section affects our liability for death or personal injury arising from our negligence, our liability 
              for fraudulent misrepresentation or misrepresentation as to a fundamental matter, or any other liability that cannot 
              be excluded or limited under applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limits of use</h2>
            <p>You may use our Website only for lawful purposes. You may not use our Website:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>In any way that breaches any applicable local, national, or international law or regulation;</li>
              <li>In any way that is unlawful or fraudulent, or has any illegal or fraudulent purpose or effect;</li>
              <li>To send, knowingly receive, upload, download, use or re-use any material which does not comply with our content standards;</li>
              <li>To transmit any data, send or upload any material that contains viruses, trojan horses, worms, time-bombs, keystroke loggers, spyware, adware, or any other harmful programs or similar computer code designed to affect the operation of any computer software or hardware adversely.</li>
            </ul>
            <p>You also agree:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Not to reproduce, duplicate, copy or re-sell any part of our Website in contravention of the provisions of these Terms;</li>
              <li>Not to use ad-blocking software;</li>
              <li>Not to charge others for the use of Riterio Gambitas, MB unless in a specific written agreement with Riterio Gambitas, MB;</li>
              <li>Not to re-use text or graphics from the Website or parts thereof.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">No Refund Policy</h2>
            <p>
              <strong>All sales are final.</strong> Due to the nature of our digital proxy services, we do not offer refunds, 
              returns, or exchanges for any purchases made through our platform. Once payment is processed and services are 
              delivered, no refunds will be provided under any circumstances. This includes but is not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Change of mind or no longer needing the service;</li>
              <li>Technical difficulties on your end;</li>
              <li>Incompatibility with your systems or requirements;</li>
              <li>Unused or partially used proxy traffic.</li>
            </ul>
            <p>
              We encourage all users to carefully review our service offerings and test our trial options before making any purchases.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to terms</h2>
            <p>
              We are committed to ensuring that our Website is as useful and efficient as possible. For that reason, we reserve 
              the right to make changes to the services at any time. We will never charge you for any service without making it 
              very clear to you precisely what you&apos;re paying for.
            </p>
            <p>
              Any new features added to the current site shall also be subject to these terms and conditions. You can always review 
              the most current version of the Terms and conditions at any time on this page. We reserve the right to update, change 
              or retrieve any part of these Terms and conditions by posting updates and/or changes to our Website. It is your 
              responsibility to check this page periodically for changes. Your continued use of or access to the Website following 
              the posting of any changes constitutes acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Service terms</h2>
            <p>
              Riterio Gambitas, MB at this moment grants the User a non-exclusive, non-transferable, limited right to access and 
              use the Service under the conditions of these Terms & Conditions and for the duration of the agreement. The use of 
              the Service is at the User&apos;s own expense and risk. The User is responsible for meeting the technical and functional 
              requirements and using the electronic communication facilities necessary to access and use the Service. At all times, 
              the User will bear the risk of loss, theft, or damage to any of its data.
            </p>
            <p>
              Riterio Gambitas, MB will have the right (but not the obligation), at its sole discretion, to review, edit, limit, 
              refuse or remove content or to limit or refuse the User access to the Service. According to us, the use of the Service 
              violates these Terms of Use more specifically in the event.
            </p>
            <p>
              We may disclose the User&apos;s Personal Data or Content, or other data relating to the use of the Service, to third parties 
              where it believes, in good faith, that it is necessary to comply with a court order, ongoing judicial proceeding, criminal 
              or civil subpoena, or other legal process or to exercise its constitutional rights of defense against legal claims.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Personal information</h2>
            <p>
              Our Privacy Policy regulates your submission of personal information through the store. You are to view our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Iframes</h2>
            <p>
              Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the 
              visual presentation or appearance of our Website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p>
              You agree to indemnify, protect and hold harmless to Riterio Gambitas, MB, subsidiaries, affiliates, partners, officers, 
              directors, agents, contractors, license, service providers, subcontractors, suppliers, interns, and employees, harmless 
              from any claim or demand, including reasonable attorney&apos;s fees, made by any third party due to or arising out of your 
              breach of these Terms and conditions or the documents they incorporate by reference or your infringement of any law or 
              the rights of a third-party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Severability</h2>
            <p>
              Suppose any provision of these Terms and conditions is discovered to be unlawful, null or unenforceable. In that case, 
              such provision shall notwithstanding be enforceable to the fullest extent permitted by applicable law. The unenforceable 
              portion shall be viewed to be cut off from these Terms of Use; such determination shall not affect the credibility and 
              enforceability of any other remaining provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Entire agreement</h2>
            <p>
              Our inability to exercise or enforce any right or provision of these Terms of Service shall not constitute a discharge 
              of such right or provision.
            </p>
            <p>
              These Terms of Use and any policies or operating rules posted by us on this Website or in respect to the Service 
              constitutes the entire agreement and understanding between you and us and govern your use of the Service, pre-empt any 
              prior or synchronous agreements, communications, and proposals, whether oral or written, between you and us.
            </p>
            <p>
              Any ambiguities in the interpretation of these Terms of Use shall not be construed against the drafting party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law And Jurisdiction</h2>
            <p>
              This Agreement, and any dispute or claim (including non-contractual disputes or claims) arising out of or in connection 
              with it or its subject matter or formation, shall be governed by, and construed in accordance with, the laws of Singapore. 
              Each Party irrevocably agrees that the courts of Singapore shall have exclusive jurisdiction to settle any dispute or claim 
              (including non-contractual disputes or claims) arising out of or in connection with this Agreement or its subject matter 
              or formation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact information</h2>
            <p>
              If you would like to access, correct, register a complaint, or want more information, please contact us at:
            </p>
            <p>
              Riterio Gambitas, MB<br />
              Email: contact@ipden.io
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
          