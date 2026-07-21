import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import EditorialHeader from '@/components/home/editorial/EditorialHeader';
import HeroEditorial from '@/components/home/editorial/HeroEditorial';
import EditorialCarousels from '@/components/home/editorial/EditorialCarousels';
import EditorialEShop from '@/components/home/editorial/EditorialEShop';
import TestimonialsEditorial from '@/components/home/editorial/TestimonialsEditorial';
import FinalEditorialCTA from '@/components/home/editorial/FinalEditorialCTA';
import EspaceApercu from '@/components/home/v2/EspaceApercu';
import IncludedSection from '@/components/home/v2/IncludedSection';
import FreemiumSection from '@/components/home/v2/FreemiumSection';
import BlogSection from '@/components/home/BlogSection';
import InstagramHighlightsGrid from '@/components/instagram/InstagramHighlightsGrid';
import V2FAQSection from '@/components/home/v2/FAQSection';
import Footer from '@/components/Footer';
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

      <div className="min-h-screen bg-white text-editorial-noir">
        <EditorialHeader transparent />
        <main>
          {/* 1. Hero */}
          <HeroEditorial />

          {/* 2. Coups de cœur */}
          <section id="selection" className="bg-white">
            <InstagramHighlightsGrid
              context="homepage"
              eyebrow="Coups de cœur"
              title="Sélection Instagram Mariable"
              limit={10}
            />
          </section>

          {/* 3. Carrousel lieux sélectionnés — fond sauge */}
          <EditorialCarousels />

          {/* 4. Ton espace Mariable */}
          <EspaceApercu />

          {/* 5. Le service en détail */}
          <IncludedSection />

          {/* 6. Gratuit / Premium */}
          <FreemiumSection />

          {/* 7. E-books */}
          <EditorialEShop />

          {/* 8. Témoignages */}
          <TestimonialsEditorial />

          {/* 9. Conseils & inspirations */}
          <BlogSection />

          {/* 10. FAQ */}
          <V2FAQSection />

          {/* 11. CTA final */}
          <FinalEditorialCTA />
        </main>

        {/* 12. Footer */}
        <Footer />
      </div>
    </SelectionLockProvider>
  );
};

export default RefonteJuillet;
