import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { TITLE_TAILWIND_CLASS } from "@/utils/constants"

export function AccordionComponent() {
    return (
        <div className="flex flex-col w-[70%] lg:w-[50%]">
            <h2 className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold text-center tracking-tight dark:text-white text-gray-900`}>
                Frequently Asked Questions (FAQs)
            </h2>
            <Accordion type="single" collapsible className="w-full mt-2">
                <AccordionItem value="item-1">
                    <AccordionTrigger><span className="font-medium">Can I get a trial before making a larger purchase?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>While we don&apos;t offer a free trial, you can start with just 1 GB of bandwidth to explore our proxy solutions. It&apos;s a flexible way to experience the platform before selecting a larger plan — which comes with tiered discounts for higher volumes.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger><span className="font-medium">What is the validity period for my bandwidth plan?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Our bandwidth plans come with a full 1-year validity — giving you the flexibility to use your data on your own schedule, without monthly expiration limits.</p>
                        <p className="mt-2">Plans auto-renew annually or upon full usage. You can opt out at any time.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger><span className="font-medium">What payment options are offered?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>We accept multiple payment methods including:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Credit card</li>
                            <li>Cryptocurrency</li>
                            <li>Bank transfer (for large payments)</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger><span className="font-medium">What type of proxy solutions does IPden offer?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>IPden offers a comprehensive range of proxy solutions to meet your needs:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li><strong>Residential proxies</strong> - Real IP addresses from residential devices</li>
                            <li><strong>Datacenter proxies</strong> - High-speed proxies from data centers</li>
                            <li><strong>ISP proxies</strong> - Static residential proxies for maximum reliability</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger><span className="font-medium">Can I choose specific locations for my proxies?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Yes! You can target proxies by country, state, and even city. Our platform provides granular geo-targeting options to ensure you get IPs from your desired locations.</p>
                        <p className="mt-2">Simply configure your preferred location in the proxy setup dashboard.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger><span className="font-medium">What is the difference between sticky and rotating proxies?</span></AccordionTrigger>
                    <AccordionContent>
                        <p><strong>Sticky (Session) proxies</strong> maintain the same IP address for a specified duration (1-1440 minutes), ideal for tasks requiring consistent identity.</p>
                        <p className="mt-2"><strong>Rotating (Request) proxies</strong> change IP with each request, perfect for high-volume data scraping and avoiding rate limits.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                    <AccordionTrigger><span className="font-medium">How do I monitor my bandwidth usage?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Your dashboard provides real-time bandwidth usage tracking with detailed charts and statistics. You can monitor your consumption at any time and receive notifications when approaching your limit.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                    <AccordionTrigger><span className="font-medium">What protocols are supported?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>We support multiple protocols to fit your integration needs:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>HTTP/HTTPS - Standard web protocols</li>
                            <li>SOCKS5 - Enhanced security and flexibility</li>
                        </ul>
                        <p className="mt-2">Each protocol uses dedicated ports for optimal performance.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-9">
                    <AccordionTrigger><span className="font-medium">Is there a refund policy?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Yes, we offer a satisfaction guarantee. If you experience technical issues or the service doesn&apos;t meet your expectations, please contact our support team within 7 days of purchase to discuss refund options.</p>
                        <p className="mt-2">Refunds are evaluated on a case-by-case basis. Unused bandwidth may be eligible for refund.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-10">
                    <AccordionTrigger><span className="font-medium">Do you offer technical support?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Absolutely! We provide 24/7 technical support through multiple channels:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Live chat support</li>
                            <li>Email support with quick response times</li>
                            <li>Comprehensive documentation and setup guides</li>
                            <li>Dedicated account manager for enterprise plans</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
