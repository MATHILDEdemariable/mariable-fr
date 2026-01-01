import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import ChatbotButton from '@/components/ChatbotButton';
import PremiumHeader from '@/components/home/PremiumHeader';
import PremiumHeroSection from '@/components/home/PremiumHeroSection';
import PremiumConciergerie from '@/components/home/PremiumConciergerie';
import CarnetAdressesInlineSection from '@/components/home/CarnetAdressesInlineSection';
import PremiumToolsCoordinationSection from '@/components/home/PremiumToolsCoordinationSection';
import EditorialArticlesSection from '@/components/home/EditorialArticlesSection';
import PremiumTestimonialsSection from '@/components/home/PremiumTestimonialsSection';
import PremiumFinalCTASection from '@/components/home/PremiumFinalCTASection';
import { useScrollEffects } from '@/hooks/useScrollEffects';

const LandingCouple = () => {
  useScrollEffects();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-editorial-beige">
      <SEO 
        title="Le premier wedding planner digital - Mariable"
        description="Recommandations de lieux & prestataires premium, coordination jour-J et outils de planification pour organiser votre mariage facilement."
        keywords="wedding planner digital, prestataires mariage premium, coordination mariage, planning mariage, organisation mariage paris"
      />
      
      <PremiumHeader />
      
      <main className="flex-grow page-content">
        {/* Hero Section Editorial */}
        <PremiumHeroSection />

        {/* Section Outils - Carrousel Editorial */}
        <PremiumConciergerie />

        {/* Section Formulaire - Sélection Prestataires */}
        <CarnetAdressesInlineSection />

        {/* Section Outils + Coordination */}
        <PremiumToolsCoordinationSection />

        {/* Section Articles/Inspiration - Fond foncé */}
        <EditorialArticlesSection />

        {/* Section Témoignages */}
        <PremiumTestimonialsSection />

        {/* Section CTA Final */}
        <PremiumFinalCTASection />
      </main>

      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default LandingCouple;