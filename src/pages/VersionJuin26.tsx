import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import PremiumTestimonialsSection from '@/components/home/PremiumTestimonialsSection';
import HeroV2 from '@/components/home/v2/HeroV2';
import ReassuranceBar from '@/components/home/v2/ReassuranceBar';
import PainPointsSection from '@/components/home/v2/PainPointsSection';
import IncludedSection from '@/components/home/v2/IncludedSection';
import DifferentiatorSection from '@/components/home/v2/DifferentiatorSection';
import FAQSection from '@/components/home/v2/FAQSection';
import FinalCTASection from '@/components/home/v2/FinalCTASection';

export default function VersionJuin26() {
  return (
    <>
      <Helmet>
        <title>Mariable — Le planner mariage en ligne (mockup juin)</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta
          name="description"
          content="Mockup d'une page de vente du planner Mariable — 29€, accès à vie."
        />
      </Helmet>
      <div className="min-h-screen bg-editorial-cream">
        <PremiumHeader />
        <main>
          <HeroV2 />
          <ReassuranceBar />
          <PainPointsSection />
          <IncludedSection />
          <DifferentiatorSection />
          <PremiumTestimonialsSection />
          <FAQSection />
          <FinalCTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
