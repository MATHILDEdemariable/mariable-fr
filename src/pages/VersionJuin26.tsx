import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import PremiumTestimonialsSection from '@/components/home/PremiumTestimonialsSection';
import BlogSection from '@/components/home/BlogSection';
import HeroV2 from '@/components/home/v2/HeroV2';
import ReassuranceBar from '@/components/home/v2/ReassuranceBar';
import EspaceApercu from '@/components/home/v2/EspaceApercu';
import PainPointsSection from '@/components/home/v2/PainPointsSection';
import IncludedSection from '@/components/home/v2/IncludedSection';
import DifferentiatorSection from '@/components/home/v2/DifferentiatorSection';
import PricingHighlight from '@/components/home/v2/PricingHighlight';
import FAQSection from '@/components/home/v2/FAQSection';
import FinalCTASection from '@/components/home/v2/FinalCTASection';

export default function VersionJuin26() {
  return (
    <>
      <Helmet>
        <title>Mariable — WEDDING PLANNING NOUVELLE GENERATION</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta
          name="description"
          content="WEDDING PLANNING NOUVELLE GENERATION pour celles et ceux qui organisent eux-mêmes leur mariage."
        />
      </Helmet>
      <div className="min-h-screen bg-editorial-cream">
        <PremiumHeader />
        <main>
          <HeroV2 />
          <ReassuranceBar />
          <EspaceApercu />
          <PainPointsSection />
          <IncludedSection />
          <DifferentiatorSection />
          <div id="testimonials">
            <PremiumTestimonialsSection />
          </div>
          <PricingHighlight />
          <FAQSection />
          <BlogSection />
          <FinalCTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
