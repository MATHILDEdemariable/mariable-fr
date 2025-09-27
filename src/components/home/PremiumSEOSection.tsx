import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, MapPin, Calendar, Users, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
const PremiumSEOSection = () => {
  const seoSections = [{
    title: "Recommandations de lieux & prestataires mariage premium",
    description: "Découvrez notre sélection exclusive de prestataires d'exception pour un mariage inoubliable",
    icon: <Star className="h-6 w-6 text-wedding-olive" />,
    link: "/selection",
    highlight: true
  }, {
    title: "Organiser un mariage à Paris",
    description: "Tous les meilleurs prestataires et lieux pour votre mariage dans la capitale",
    icon: <MapPin className="h-6 w-6 text-wedding-olive" />,
    link: "/mariage/ile-de-france"
  }, {
    title: "Organiser son mariage facilement seul",
    description: "Outils et guides pour planifier votre mariage en autonomie complète",
    icon: <Calendar className="h-6 w-6 text-wedding-olive" />,
    link: "/outils-planning-mariage"
  }, {
    title: "Coordination Jour-J",
    description: "Service de coordination professionnelle pour un jour J parfait",
    icon: <Users className="h-6 w-6 text-wedding-olive" />,
    link: "/coordination-jour-j"
  }, {
    title: "Conseils mariages",
    description: "Articles et conseils d'experts pour organiser votre mariage parfait",
    icon: <PenTool className="h-6 w-6 text-wedding-olive" />,
    link: "/conseilsmariage"
  }];
  
  return (
    <section className="py-16 bg-gradient-to-br from-secondary/10 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Le premier wedding planner digital
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Découvrez tous nos services pour organiser le mariage de vos rêves
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seoSections.map((section, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-lg transition-all duration-300 ${
                section.highlight ? 'ring-2 ring-primary/20 bg-primary/5' : ''
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  {section.icon}
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {section.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {section.description}
                </p>
                <Link to={section.link}>
                  <Button 
                    variant={section.highlight ? "default" : "outline"} 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
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