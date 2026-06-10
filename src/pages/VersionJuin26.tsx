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
import FreemiumSection from '@/components/home/v2/FreemiumSection';
import DifferentiatorSection from '@/components/home/v2/DifferentiatorSection';
import PricingHighlight from '@/components/home/v2/PricingHighlight';
import FAQSection from '@/components/home/v2/FAQSection';
import FinalCTASection from '@/components/home/v2/FinalCTASection';

export default function VersionJuin26() {
  return (
    <>
      <Helmet>
        <title>Mariable — Le wedding planner nouvelle génération</title>
        <meta
          name="description"
          content="Organisez vous-même votre mariage avec Mariable : outils digitaux, carnet d'adresses de prestataires vérifiés et application jour-J. Gratuit pour commencer."
        />
        <link rel="canonical" href="https://www.mariable.fr/" />
        <meta property="og:title" content="Mariable — Le wedding planner nouvelle génération" />
        <meta property="og:description" content="Organisez vous-même votre mariage avec Mariable : outils, prestataires vérifiés et application jour-J." />
        <meta property="og:url" content="https://www.mariable.fr/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-editorial-cream">
        <PremiumHeader />
        <main>
          <HeroV2 />
          <ReassuranceBar />
          <PainPointsSection />
          <EspaceApercu />
          <IncludedSection />
          <FreemiumSection />
          <DifferentiatorSection />
          <div id="testimonials" className="bg-white [&_section]:!bg-white">
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
