import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import ChatbotButton from '@/components/ChatbotButton';
import PremiumHeader from '@/components/home/PremiumHeader';
import PremiumHeroSection from '@/components/home/PremiumHeroSection';
import PremiumProcessSection from '@/components/home/PremiumProcessSection';
import PremiumMarketplaceSectionCouple from '@/components/home/PremiumMarketplaceSectionCouple';
import PremiumToolsSection from '@/components/home/PremiumToolsSection';
import PremiumCoordinationSection from '@/components/home/PremiumCoordinationSection';
import PremiumTestimonialsSection from '@/components/home/PremiumTestimonialsSection';
import PremiumFinalCTASection from '@/components/home/PremiumFinalCTASection';
import { useScrollEffects } from '@/hooks/useScrollEffects';

const LandingCouple = () => {
  useScrollEffects();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-premium-base">
      <SEO 
        title="Mariable - Le Netflix du mariage : Prestataires sélectionnés & Coordination digitale"
        description="Plateforme premium de coordination mariages. Marketplace de prestataires d'exception + outils SaaS de planification. Le plus beau jour de votre vie, sans charge mentale."
        keywords="mariage, prestataires mariage, coordination mariage, planning mariage, organisation mariage, marketplace mariage"
      />
      
      <PremiumHeader />
      
      <main className="flex-grow pt-16">
        {/* Hero Section Premium */}
        <PremiumHeroSection />

        {/* Section Process 3 Étapes */}
        <PremiumProcessSection />

        {/* Section Marketplace Focus - Version Couple avec Modal */}
        <PremiumMarketplaceSectionCouple />

        {/* Section Outils Inclus */}
        <PremiumToolsSection />

        {/* Section Coordination Innovation */}
        <PremiumCoordinationSection />

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