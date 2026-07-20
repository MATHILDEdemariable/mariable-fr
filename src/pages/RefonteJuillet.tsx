import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import EditorialHeader from '@/components/home/editorial/EditorialHeader';
import HeroEditorial from '@/components/home/editorial/HeroEditorial';
import ManifestoBand from '@/components/home/editorial/ManifestoBand';
import EditorialCarousels from '@/components/home/editorial/EditorialCarousels';
import EditorialEShop from '@/components/home/editorial/EditorialEShop';
import TestimonialsEditorial from '@/components/home/editorial/TestimonialsEditorial';
import FinalEditorialCTA from '@/components/home/editorial/FinalEditorialCTA';
import PremiumToolsCoordinationSection from '@/components/home/PremiumToolsCoordinationSection';
import BlogSection from '@/components/home/BlogSection';
import InstagramHighlightsGrid from '@/components/instagram/InstagramHighlightsGrid';
import PricingHighlight from '@/components/home/v2/PricingHighlight';
import V2FAQSection from '@/components/home/v2/FAQSection';
import { SelectionLockProvider } from '@/components/home/editorial/SelectionLockModal';

const RefonteJuillet: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SelectionLockProvider>
      <SEO
        title="Mariable — sélection de lieux de mariage & Wedding planner en ligne"
        description="La sélection éditoriale Mariable : lieux et pros triés à la main, sans sponsoring. Et l'appli qui vous accompagne jusqu'au Jour J."
        canonical="/refontejuillet"
        keywords="organisation mariage, wedding planner digital, sélection lieux mariage, prestataires mariage premium, ebooks mariage, application mariage"
      />

      <div className="min-h-screen bg-editorial-beige text-editorial-noir">
        <EditorialHeader />
        <main>
          <HeroEditorial />
          <ManifestoBand />
          <section id="selection" className="bg-editorial-beige">
            <InstagramHighlightsGrid
              context="homepage"
              eyebrow="Coups de cœur"
              title="Sélection Instagram Mariable"
              limit={10}
            />
          </section>
          <EditorialCarousels />
          <PremiumToolsCoordinationSection />
          <EditorialEShop />
          <PricingHighlight />
          <TestimonialsEditorial />
          <BlogSection />
          <V2FAQSection />
          <FinalEditorialCTA />
        </main>
      </div>
    </SelectionLockProvider>
  );
};

export default RefonteJuillet;
