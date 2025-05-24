
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lightbulb, Clock, Heart, Camera, Users, CheckCircle2 } from 'lucide-react';

const AdviceSidebar: React.FC = () => {
  const adviceCategories = [
    {
      title: "Préparatifs matinaux",
      icon: <Clock className="h-5 w-5 text-wedding-olive" />,
      tips: [
        "Prévoyez un petit-déjeuner léger mais nutritif",
        "Commencez la préparation 3h avant la cérémonie",
        "Gardez une trousse d'urgence (épingles, maquillage de retouche)",
        "Déléguez l'organisation aux témoins"
      ]
    },
    {
      title: "Timing des photos",
      icon: <Camera className="h-5 w-5 text-wedding-olive" />,
      tips: [
        "Planifiez 30min pour les photos de couple",
        "Prévoyez 45min pour les photos de groupe",
        "Privilégiez la golden hour (1h avant le coucher du soleil)",
        "Communiquez vos souhaits au photographe en amont"
      ]
    },
    {
      title: "Gestion des invités",
      icon: <Users className="h-5 w-5 text-wedding-olive" />,
      tips: [
        "Désignez une personne pour accueillir les invités",
        "Préparez un plan de table clair",
        "Prévoyez des activités pendant le cocktail",
        "Informez les invités des horaires précis"
      ]
    },
    {
      title: "Moments clés",
      icon: <Heart className="h-5 w-5 text-wedding-olive" />,
      tips: [
        "Gardez 15min de marge entre chaque étape",
        "Prévoyez un moment d'intimité après la cérémonie",
        "Planifiez les discours (max 3-4 discours de 5min)",
        "Réservez du temps pour profiter de votre soirée"
      ]
    }
  ];

  const quickChecklist = [
    "Vérifier la météo 3 jours avant",
    "Confirmer avec tous les prestataires",
    "Préparer les alliances et documents",
    "Organiser le transport des invités",
    "Prévoir un planning de secours"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-wedding-olive">
            <Lightbulb className="h-5 w-5" />
            Conseils pour le jour J
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {adviceCategories.map((category, index) => (
            <div key={index} className="space-y-3">
              <h4 className="flex items-center gap-2 font-medium text-sm">
                {category.icon}
                {category.title}
              </h4>
              <ul className="space-y-2">
                {category.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                    <span className="w-1 h-1 bg-wedding-olive rounded-full mt-1.5 flex-shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-wedding-olive text-sm">
            <CheckCircle2 className="h-4 w-4" />
            Check-list dernière minute
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {quickChecklist.map((item, index) => (
              <li key={index} className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdviceSidebar;
