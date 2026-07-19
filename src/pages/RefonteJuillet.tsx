import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import EditorialHeader from '@/components/home/editorial/EditorialHeader';
import HeroEditorial from '@/components/home/editorial/HeroEditorial';
import ManifestoBand from '@/components/home/editorial/ManifestoBand';
import EditorialFeatured from '@/components/home/editorial/EditorialFeatured';
import EditorialCarousels from '@/components/home/editorial/EditorialCarousels';
import TestimonialsEditorial from '@/components/home/editorial/TestimonialsEditorial';
import EditorialRendezVous from '@/components/home/editorial/EditorialRendezVous';
import FinalEditorialCTA from '@/components/home/editorial/FinalEditorialCTA';
import PremiumToolsCoordinationSection from '@/components/home/PremiumToolsCoordinationSection';
import BlogSection from '@/components/home/BlogSection';
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
        noindex
      />

      <div className="min-h-screen bg-editorial-beige text-editorial-noir">
        <EditorialHeader />
        <main>
          <HeroEditorial />
          <ManifestoBand />
          <EditorialFeatured />
          <EditorialCarousels />
          <PremiumToolsCoordinationSection />
          <TestimonialsEditorial />
          <BlogSection />
          <EditorialRendezVous />
          <FinalEditorialCTA />
        </main>
        <Footer />
      </div>
    </SelectionLockProvider>
  );
};

export default RefonteJuillet;
