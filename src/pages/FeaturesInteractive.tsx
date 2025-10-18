import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { DashboardMockup } from '@/components/features/DashboardMockup';
import { FeatureTooltip } from '@/components/features/FeatureTooltip';
import { dashboardFeatures, Feature } from '@/data/dashboardFeatures';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Heart, DollarSign, CheckCircle, Calendar, Sparkles, Users, UserCheck, Home } from 'lucide-react';

const FeaturesInteractive = () => {
  const isMobile = useIsMobile();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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

  const getFeatureIcon = (featureId: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'mon-mariage': <Heart className="w-5 h-5 text-wedding-olive" />,
      'budget': <DollarSign className="w-5 h-5 text-wedding-olive" />,
      'checklist': <CheckCircle className="w-5 h-5 text-wedding-olive" />,
      'avant-jour-j': <Calendar className="w-5 h-5 text-wedding-olive" />,
      'mon-jour-m': <Sparkles className="w-5 h-5 text-wedding-olive" />,
      'apres-jour-j': <CheckCircle className="w-5 h-5 text-wedding-olive" />,
      'prestataires': <Users className="w-5 h-5 text-wedding-olive" />,
      'rsvp': <UserCheck className="w-5 h-5 text-wedding-olive" />,
      'logements': <Home className="w-5 h-5 text-wedding-olive" />,
    };
    return iconMap[featureId] || <Heart className="w-5 h-5 text-wedding-olive" />;
  };

  const MobileFeaturesView = () => (
    <div className="space-y-4">
      {dashboardFeatures.map((feature) => (
        <Card 
          key={feature.id}
          className="overflow-hidden cursor-pointer"
          onClick={() => setExpandedCard(expandedCard === feature.id ? null : feature.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-wedding-olive/10 flex items-center justify-center">
                  {getFeatureIcon(feature.id)}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
              {expandedCard === feature.id ? <ChevronUp /> : <ChevronDown />}
            </div>
          </CardHeader>
          
          {expandedCard === feature.id && (
            <CardContent className="pt-0">
              <p className="text-muted-foreground">{feature.description}</p>
              
              {feature.children && feature.children.length > 0 && (
                <div className="mt-4 space-y-2 pl-4 border-l-2 border-wedding-olive/20">
                  {feature.children.map((child) => (
                    <div key={child.id} className="text-sm">
                      <span className="font-medium">{child.title}</span>
                      <p className="text-muted-foreground text-xs mt-1">{child.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );

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
        
        <main className="flex-1" style={{ paddingTop: 'var(--header-h-premium)' }}>
          <div className="container mx-auto px-4 py-12">
            {/* Header Section */}
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-wedding-olive">
                Découvrez toutes les fonctionnalités
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {isMobile 
                  ? "Touchez chaque carte pour découvrir les détails des fonctionnalités."
                  : "Survolez les éléments du dashboard pour découvrir leurs fonctionnalités. Cliquez sur les menus déroulants pour les explorer."
                }
              </p>
              {!isMobile && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-wedding-olive/10 text-wedding-olive rounded-full text-sm">
                  <span className="w-2 h-2 rounded-full bg-wedding-olive animate-pulse"></span>
                  Mode exploration - Passez votre souris sur les éléments
                </div>
              )}
            </div>

            {/* Interactive Dashboard Mockup */}
            <div className="relative max-w-7xl mx-auto">
              {isMobile ? (
                <MobileFeaturesView />
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Instructions Section */}
            {!isMobile && (
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
                        <strong>Cliquez</strong> sur "Jour-J" dans la barre latérale pour déplier ses sous-menus
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
            )}

            {isMobile && (
              <div className="mt-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border-2 border-wedding-olive/20 p-6">
                  <h2 className="text-xl font-bold mb-3 text-wedding-olive">
                    Comment utiliser cette page ?
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Touchez chaque carte pour découvrir les détails de la fonctionnalité. 
                    Cette page est <strong>interactive mais non fonctionnelle</strong> - 
                    créez un compte pour utiliser les vraies fonctionnalités !
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FeaturesInteractive;
