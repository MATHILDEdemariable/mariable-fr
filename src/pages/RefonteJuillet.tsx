import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import EditorialHeader from '@/components/home/editorial/EditorialHeader';
import HeroEditorial from '@/components/home/editorial/HeroEditorial';
import EditorialCarousels from '@/components/home/editorial/EditorialCarousels';
import EditorialEShop from '@/components/home/editorial/EditorialEShop';
import EspaceFusionSection from '@/components/home/editorial/EspaceFusionSection';
import BlogCarouselEditorial from '@/components/home/editorial/BlogCarouselEditorial';
import TestimonialsEditorial from '@/components/home/editorial/TestimonialsEditorial';
import FinalEditorialCTA from '@/components/home/editorial/FinalEditorialCTA';
import FreemiumSection from '@/components/home/v2/FreemiumSection';
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

          {/* 2. Coups de cœur — blanc */}
          <section id="selection" className="bg-white">
            <InstagramHighlightsGrid
              context="homepage"
              eyebrow="Coups de cœur"
              title="Sélection Instagram Mariable"
              limit={10}
            />
          </section>

          {/* 3. Lieux sélectionnés — vert sauge */}
          <EditorialCarousels />

          {/* 4. Ton espace Mariable (fusion aperçu + service en détail + CTA) — blanc */}
          <EspaceFusionSection />

          {/* 5. E-books / E-shop — beige clair */}
          <EditorialEShop />

          {/* 6. Gratuit / Premium — blanc (tous les guides inclus dans Premium) */}
          <FreemiumSection hideEshopCard bgClassName="bg-white" />

          {/* 7. Conseils & inspirations — vert sauge (format carrousel) */}
          <BlogCarouselEditorial />

          {/* 8. Témoignages — blanc */}
          <TestimonialsEditorial />

          {/* 9. FAQ — blanc */}
          <V2FAQSection />

          {/* 10. CTA final — vert sauge */}
          <FinalEditorialCTA />
        </main>

        {/* 11. Footer */}
        <Footer />
      </div>
    </SelectionLockProvider>
  );
};

export default RefonteJuillet;
