import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import {
  Calculator,
  CheckSquare,
  Calendar,
  Users,
  Euro,
  FileText,
  Wine,
  MapPin,
  Heart,
  ArrowRight,
  Clock,
  Target
} from 'lucide-react';

const OutilsPlanningMariage: React.FC = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: 'Calculateur de Budget',
      description: 'Estimez votre budget mariage selon vos envies et votre région',
      icon: <Calculator className="h-8 w-8" />,
      path: '/services/budget',
      color: 'bg-wedding-olive/10',
      hoverColor: 'hover:bg-wedding-olive/20',
      features: ['Estimation par région', 'Répartition automatique', 'Export PDF']
    },
    {
      title: 'Check-list Mariage',
      description: 'Suivez tous vos préparatifs étape par étape',
      icon: <CheckSquare className="h-8 w-8" />,
      path: '/checklist-mariage',
      color: 'bg-wedding-cream/40',
      hoverColor: 'hover:bg-wedding-cream/60',
      features: ['12 mois de préparation', 'Tâches personnalisées', 'Suivi automatique']
    },
    {
      title: 'Coordination Jour J',
      description: 'Organisez votre planning de mariage parfait',
      icon: <Calendar className="h-8 w-8" />,
      path: '/coordination-jour-j',
      color: 'bg-wedding-olive/5',
      hoverColor: 'hover:bg-wedding-olive/15',
      features: ['Planning détaillé', 'Gestion équipe', 'Timeline optimisée']
    },
    {
      title: 'Calculatrice Boissons',
      description: 'Estimez les quantités de boissons pour votre réception',
      icon: <Wine className="h-8 w-8" />,
      path: '/dashboard/drinks',
      color: 'bg-wedding-cream/30',
      hoverColor: 'hover:bg-wedding-cream/50',
      features: ['Calcul par invité', 'Types de boissons', 'Saisons & durée']
    },
    {
      title: 'Recherche Prestataires',
      description: 'Trouvez les meilleurs professionnels près de chez vous',
      icon: <Users className="h-8 w-8" />,
      path: '/moteur-recherche',
      color: 'bg-wedding-cream/20',
      hoverColor: 'hover:bg-wedding-cream/40',
      features: ['Par région', 'Filtres avancés', 'Avis vérifiés']
    },
    {
      title: 'Quiz Style Mariage',
      description: 'Découvrez le style de mariage qui vous correspond',
      icon: <Heart className="h-8 w-8" />,
      path: '/dashboard/planning',
      color: 'bg-wedding-olive/8',
      hoverColor: 'hover:bg-wedding-olive/18',
      features: ['Style personnalisé', 'Recommandations', 'Inspiration']
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Définissez votre vision',
      description: 'Commencez par le quiz style pour clarifier vos envies',
      icon: <Target className="h-6 w-6" />
    },
    {
      step: 2,
      title: 'Calculez votre budget',
      description: 'Obtenez une estimation réaliste selon votre région',
      icon: <Euro className="h-6 w-6" />
    },
    {
      step: 3,
      title: 'Planifiez votre préparation',
      description: 'Suivez la check-list pour ne rien oublier',
      icon: <Clock className="h-6 w-6" />
    },
    {
      step: 4,
      title: 'Trouvez vos prestataires',
      description: 'Recherchez et contactez les professionnels',
      icon: <Users className="h-6 w-6" />
    },
    {
      step: 5,
      title: 'Organisez votre Jour J',
      description: 'Créez le planning parfait avec la coordination',
      icon: <Calendar className="h-6 w-6" />
    }
  ];

  // Schema.org structured data
  const toolsSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Outils Planning Mariage Mariable",
    "description": "Suite complète d'outils numériques pour planifier et organiser votre mariage parfait en France",
    "provider": {
      "@type": "Organization",
      "name": "Mariable",
      "url": "https://www.mariable.fr"
    },
    "areaServed": "France",
    "serviceType": "Planning de mariage",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Outils Mariable",
      "itemListElement": tools.map((tool, index) => ({
        "@type": "Offer",
        "position": index + 1,
        "itemOffered": {
          "@type": "Service",
          "name": tool.title,
          "description": tool.description
        }
      }))
    }
  };

  return (
    <>
      <Helmet>
        <title>Outils Planning Mariage | Mariable</title>
        <meta 
          name="description" 
          content="Découvrez tous nos outils gratuits pour planifier votre mariage : calculateur budget, check-list, coordination jour J, recherche prestataires. Organisez votre mariage parfait avec Mariable." 
        />
        <meta 
          name="keywords" 
          content="outils planning mariage, calculateur budget mariage, check-list mariage, coordination jour j, recherche prestataires mariage, planning mariage gratuit" 
        />
        <meta property="og:title" content="Outils Planning Mariage | Mariable" />
        <meta 
          property="og:description" 
          content="Suite complète d'outils pour planifier votre mariage parfait. Budget, check-list, coordination jour J et plus encore." 
        />
        <link rel="canonical" href="https://www.mariable.fr/outils-planning-mariage" />
        <script type="application/ld+json">
          {JSON.stringify(toolsSchema)}
        </script>
      </Helmet>

      <PremiumHeader />

      <main className="min-h-screen bg-gradient-to-b from-white to-wedding-cream/20">
        {/* Hero Section */}
        <section className="pb-12 px-4" style={{ paddingTop: 'var(--header-h)' }}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="border-premium-sage/30 text-premium-sage hover:bg-premium-sage/5"
                >
                  ← Retour à l'accueil
                </Button>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 text-wedding-black">
                Outils Planning Mariage
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Une suite complète d'outils numériques pour planifier et organiser votre mariage parfait, 
                du budget à la coordination du jour J.
              </p>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-8 py-3 text-lg"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-serif text-center mb-12 text-wedding-black">
              Comment bien organiser votre mariage ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {processSteps.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="bg-wedding-olive/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <div className="text-wedding-olive">{step.icon}</div>
                  </div>
                  <div className="bg-wedding-olive text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 text-sm font-medium">
                    {step.step}
                  </div>
                  <h3 className="font-serif text-lg mb-2 text-wedding-black">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-serif text-center mb-12 text-wedding-black">
              Nos outils de planning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 border-wedding-olive/20 ${tool.color} ${tool.hoverColor} hover:shadow-lg hover:scale-105`}
                  onClick={() => navigate(tool.path)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-wedding-olive">
                        {tool.icon}
                      </div>
                      <CardTitle className="font-serif text-xl text-wedding-black">
                        {tool.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{tool.description}</p>
                    <ul className="space-y-1 mb-4">
                      {tool.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-wedding-olive">
                          <CheckSquare className="h-4 w-4 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full border-wedding-olive text-wedding-olive hover:bg-wedding-olive hover:text-white"
                      onClick={() => navigate('/register')}
                    >
                      Utiliser cet outil
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-4 bg-wedding-olive/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-serif mb-6 text-wedding-black">
              Prêt à organiser votre mariage parfait ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Rejoignez des milliers de couples qui utilisent nos outils pour planifier leur mariage sans stress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/register')}
                className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-8 py-3"
              >
                Créer mon compte gratuit
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive hover:text-white px-8 py-3"
              >
                Découvrir le dashboard
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default OutilsPlanningMariage;