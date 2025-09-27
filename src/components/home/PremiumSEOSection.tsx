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
  return;
};
export default PremiumSEOSection;