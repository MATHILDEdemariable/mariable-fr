import React, { useEffect } from 'react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import ChatbotButton from '@/components/ChatbotButton';
import PremiumHeader from '@/components/home/PremiumHeader';
import PremiumHeroSection from '@/components/home/PremiumHeroSection';
import PremiumProcessSection from '@/components/home/PremiumProcessSection';
import PremiumMarketplaceSection from '@/components/home/PremiumMarketplaceSection';
import PremiumToolsSection from '@/components/home/PremiumToolsSection';
import PremiumCoordinationSection from '@/components/home/PremiumCoordinationSection';
import PremiumTestimonialsSection from '@/components/home/PremiumTestimonialsSection';
import PremiumFinalCTASection from '@/components/home/PremiumFinalCTASection';
import { useScrollEffects } from '@/hooks/useScrollEffects';

const Index = () => {
  useScrollEffects();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-premium-base">
      <SEO 
        title="Mariable – Organisation mariage en ligne | Wedding planner digital"
        description="Simplifiez l'organisation de votre mariage avec Mariable : outils intuitifs, sélection de prestataires réputés, et zéro charge mentale. Le plus beau jour de votre vie."
        keywords="organisation mariage, wedding planner digital, outils mariage, planning mariage, prestataires mariage, budget mariage, application mariage, jour J, gestion invités, RSVP mariage"
        image="https://www.mariable.fr/assets/cover.jpg"
        schemas={[
          {
            type: 'Organization',
            data: {
              "@type": "WebSite",
              name: "Mariable",
              url: "https://www.mariable.fr",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.mariable.fr/selection?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }
          },
          {
            type: 'Organization',
            data: {
              "@type": "ItemList",
              itemListElement: [
                {
                  "@type": "SiteNavigationElement",
                  position: 1,
                  name: "Organisez vous-même votre mariage",
                  description: "Outils gratuits de planification mariage",
                  url: "https://www.mariable.fr/dashboard"
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 2,
                  name: "Nos prestataires mariage",
                  description: "Sélection de professionnels certifiés",
                  url: "https://www.mariable.fr/selection"
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 3,
                  name: "Calculatrice budget mariage",
                  description: "Gérez votre budget et calculez vos besoins",
                  url: "https://www.mariable.fr/fonctionnalites"
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 4,
                  name: "Gestion RSVP invités",
                  description: "Suivez les réponses de vos invités",
                  url: "https://www.mariable.fr/fonctionnalites"
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 5,
                  name: "Coordination Jour J",
                  description: "Coordination professionnelle le jour J",
                  url: "https://www.mariable.fr/coordination-jour-j"
                }
              ]
            }
          }
        ]}
      />
      
      <PremiumHeader />
      
      <main className="flex-grow pt-16">
        {/* Hero Section Premium */}
        <PremiumHeroSection />

        {/* Section Process 3 Étapes */}
        <PremiumProcessSection />

        {/* Section Marketplace Focus */}
        <PremiumMarketplaceSection />

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

export default Index;