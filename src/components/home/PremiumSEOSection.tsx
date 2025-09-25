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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-wedding-black mb-4">
            Découvrez nos services premium
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des solutions sur mesure pour faire de votre mariage un moment inoubliable
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seoSections.map((section, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow ${section.highlight ? 'border-wedding-olive' : ''}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {section.icon}
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <Button asChild variant={section.highlight ? 'default' : 'outline'}>
                  <Link to={section.link} className="flex items-center gap-2">
                    Découvrir
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PremiumSEOSection;