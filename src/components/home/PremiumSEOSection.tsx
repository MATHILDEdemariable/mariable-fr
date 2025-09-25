import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, MapPin, Calendar, Users, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumSEOSection = () => {
  const seoSections = [
    {
      title: "Recommandations de lieux & prestataires mariage premium",
      description: "Découvrez notre sélection exclusive de prestataires d'exception pour un mariage inoubliable",
      icon: <Star className="h-6 w-6 text-wedding-olive" />,
      link: "/selection",
      highlight: true
    },
    {
      title: "Organiser un mariage à Paris",
      description: "Tous les meilleurs prestataires et lieux pour votre mariage dans la capitale",
      icon: <MapPin className="h-6 w-6 text-wedding-olive" />,
      link: "/mariage/ile-de-france"
    },
    {
      title: "Organiser son mariage facilement seul",
      description: "Outils et guides pour planifier votre mariage en autonomie complète",
      icon: <Calendar className="h-6 w-6 text-wedding-olive" />,
      link: "/outils-planning-mariage"
    },
    {
      title: "Coordination Jour-J",
      description: "Service de coordination professionnelle pour un jour J parfait",
      icon: <Users className="h-6 w-6 text-wedding-olive" />,
      link: "/coordination-jour-j"
    },
    {
      title: "Conseils mariages",
      description: "Articles et conseils d'experts pour organiser votre mariage parfait",
      icon: <PenTool className="h-6 w-6 text-wedding-olive" />,
      link: "/conseilsmariage"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-wedding-cream/10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif mb-6 text-wedding-black">
            Le premier wedding planner digital
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Simplifiez l'organisation de votre mariage avec nos outils innovants et notre réseau de prestataires premium
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seoSections.map((section, index) => (
            <Card 
              key={index} 
              className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                section.highlight ? 'bg-wedding-olive/5 border-wedding-olive/20' : 'bg-white'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {section.icon}
                  <div className="flex-1">
                    <CardTitle className="text-lg font-serif text-wedding-black leading-tight">
                      {section.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {section.description}
                </p>
                <Link to={section.link}>
                  <Button 
                    variant={section.highlight ? "default" : "outline"}
                    className={`w-full group-hover:translate-x-1 transition-transform ${
                      section.highlight 
                        ? 'bg-wedding-olive hover:bg-wedding-olive/90' 
                        : 'border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive hover:text-white'
                    }`}
                  >
                    Découvrir
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumSEOSection;