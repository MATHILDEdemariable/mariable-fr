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
        title="Mariable"
        description="L'organisation mariage facile. Outils, prestataires et conseils pour planifier votre grand jour."
        keywords="organisation mariage, wedding planner digital, outils mariage, planning mariage, prestataires mariage, budget mariage, checklist mariage, retroplanning mariage, plan de table mariage, coordination jour J"
        image="https://www.mariable.fr/assets/cover.jpg"
        schemas={[
          {
            type: 'Organization',
            data: {
              "@type": "WebSite",
              name: "Mariable",
              url: "https://www.mariable.fr",
              description: "L'organisation mariage facile. Outils, prestataires et conseils pour planifier votre grand jour.",
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
                  name: "Outils Planning Mariage",
                  description: "Checklist mariage, Retroplanning, Budget",
                  url: "https://www.mariable.fr/dashboard"
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 2,
                  name: "Lieux de mariage & prestataires",
                  description: "Mariable est la reference des mariages modernes et elegants et propose une selection premium de professionnels",
                  url: "https://www.mariable.fr/selection"
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 3,
                  name: "Calculer son budget mariage",
                  description: "Chez Mariable, notre approche est centree sur la simplicite, la calculatrice et le suivi budgetaire sont ideals pour cela",
                  url: "https://www.mariable.fr/dashboard/budget"
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 4,
                  name: "Outils plan de table mariage facile",
                  description: "Envoyez un formulaire a vos invites et faites le plan de table en ligne",
                  url: "https://www.mariable.fr/dashboard/seating-plan"
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 5,
                  name: "Planning jour-j mariage & coordination jour-j",
                  description: "Decouvrez notre application exclusive",
                  url: "https://www.mariable.fr/mon-jour-m/planning"
                }
              ]
            }
          }
        ]}
      />
      
      <PremiumHeader />
      
      <main className="flex-grow">
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