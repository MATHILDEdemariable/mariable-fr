import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { DashboardMockup } from '@/components/features/DashboardMockup';
import { FeatureTooltip } from '@/components/features/FeatureTooltip';
import { dashboardFeatures, Feature } from '@/data/dashboardFeatures';

const FeaturesInteractive = () => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (hoveredFeature) {
      const feature = dashboardFeatures.find(f => f.id === hoveredFeature) || 
                     dashboardFeatures.flatMap(f => f.children || []).find(c => c.id === hoveredFeature);
      setCurrentFeature(feature || null);

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setHoveredFeature(null);
        setCurrentFeature(null);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setCurrentFeature(null);
    }
  }, [hoveredFeature]);

  const handleToggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <>
      <Helmet>
        <title>Fonctionnalités - Découvrez tous les outils de Mon Mariage</title>
        <meta 
          name="description" 
          content="Explorez toutes les fonctionnalités de notre plateforme de planning mariage : budget, checklist, coordination Jour J, gestion prestataires et plus encore." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <PremiumHeader />
        
        <main className="flex-1 pt-16">
          <div className="container mx-auto px-4 py-12">
            {/* Header Section */}
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-wedding-olive">
                Découvrez toutes les fonctionnalités
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Survolez les éléments du dashboard pour découvrir leurs fonctionnalités. 
                Cliquez sur les menus déroulants pour les explorer.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-wedding-olive/10 text-wedding-olive rounded-full text-sm">
                <span className="w-2 h-2 rounded-full bg-wedding-olive animate-pulse"></span>
                Mode exploration - Passez votre souris sur les éléments
              </div>
            </div>

            {/* Interactive Dashboard Mockup */}
            <div className="relative max-w-7xl mx-auto">
              <DashboardMockup
                expandedMenus={expandedMenus}
                onToggleMenu={handleToggleMenu}
                hoveredFeature={hoveredFeature}
                onHoverFeature={setHoveredFeature}
              />

              {/* Feature Tooltip */}
              <FeatureTooltip
                feature={currentFeature}
                onClose={() => {
                  setHoveredFeature(null);
                  setCurrentFeature(null);
                }}
              />
            </div>

            {/* Instructions Section */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg border-2 border-wedding-olive/20 p-8">
                <h2 className="text-2xl font-bold mb-4 text-wedding-olive">
                  Comment utiliser cette page ?
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-wedding-olive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      <strong>Survolez</strong> n'importe quel élément du dashboard pour voir sa description apparaître
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-wedding-olive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      <strong>Cliquez</strong> sur "Mon Jour M" dans la barre latérale pour déplier ses sous-menus
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-wedding-olive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Les descriptions se ferment <strong>automatiquement</strong> après 5 secondes ou quand vous explorez autre chose
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-wedding-olive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span>
                      Cette page est <strong>interactive mais non fonctionnelle</strong> - créez un compte pour utiliser les vraies fonctionnalités !
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FeaturesInteractive;
