import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, ArrowRight } from 'lucide-react';
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
import CreateAccountCTA from '@/components/home/CreateAccountCTA';
import { useScrollEffects } from '@/hooks/useScrollEffects';
import PushNotificationBanner from '@/components/dashboard/PushNotificationBanner';

const Index = () => {
  useScrollEffects();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-premium-base">
      <SEO 
        title="Mariable — Tout votre mariage au même endroit"
        description="L'organisation mariage facile. Outils, prestataires et conseils pour planifier votre grand jour sereinement."
        keywords="organisation mariage, wedding planner digital, outils mariage, planning mariage, prestataires mariage, budget mariage, checklist mariage, retroplanning mariage, plan de table mariage, coordination jour J"
        canonical="/"
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
        {/* Push Notifications opt-in banner */}
        <div className="container mx-auto px-4 pt-4">
          <PushNotificationBanner />
        </div>

        {/* CTA Installer l'application */}
        <div className="container mx-auto px-4 pt-4">
          <Link
            to="/installer-app"
            className="flex items-center justify-between gap-4 bg-wedding-cream/60 border border-wedding-olive/20 px-4 py-3 md:px-6 md:py-4 hover:bg-wedding-cream transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 md:h-6 md:w-6 text-wedding-olive flex-shrink-0" />
              <div>
                <p className="font-serif text-sm md:text-base text-wedding-olive leading-tight">
                  Installez l'application sans téléchargement
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Accédez à Mariable depuis votre écran d'accueil
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs md:text-sm font-medium text-wedding-olive whitespace-nowrap">
              Découvrir
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>


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