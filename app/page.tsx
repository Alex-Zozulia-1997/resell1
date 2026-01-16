import { AccordionComponent } from "@/components/homepage/accordion-component";
import BlogSample from "@/components/homepage/blog-samples";
import HeroSection from "@/components/homepage/hero-section";
import MarketingCards from "@/components/homepage/marketing-cards";
import Pricing from "@/components/homepage/pricing";
import SideBySide from "@/components/homepage/side-by-side";
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";
import { Separator } from '@/components/ui/separator';
import UseCases from '@/components/homepage/use-cases';
import IPCheckerCTA from '@/components/homepage/ip-checker-cta';
import EnterpriseCTA from '@/components/homepage/enterprise-cta';

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <div className="py-[4rem]">
        <Separator className="mb-[8rem]" />
        <UseCases />
        <Separator className="mb-[8rem]" />
        <IPCheckerCTA />
        <Separator className="mb-[8rem]" />
        <section id="pricing">
          <Pricing />
        </section>
        <Separator className="mb-[8rem]" />
        <EnterpriseCTA />
        <div className="flex justify-center items-center w-full my-[8rem]">
          <AccordionComponent />
        </div>
      </div>
    </PageWrapper>
  );
}
