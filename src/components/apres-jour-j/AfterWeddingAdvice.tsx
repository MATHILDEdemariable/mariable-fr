import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lightbulb, Coffee, Sparkles, Truck, Heart, CheckCircle2, FileText } from 'lucide-react';

const AfterWeddingAdvice: React.FC = () => {
  const adviceCategories = [
    {
      title: "Brunch du lendemain",
      icon: <Coffee className="h-5 w-5 text-wedding-olive" />,
      tips: [
        "Organisez un brunch décontracté pour 20-30 proches",
        "Prévoyez un buffet simple : viennoiseries, fruits, boissons chaudes",
        "Réservez un lieu ou organisez chez vous selon votre énergie",
        "C'est le moment de partager vos premières impressions de mariés"
      ]
    },
    {
      title: "Rangement et nettoyage",
      icon: <Sparkles className="h-5 w-5 text-wedding-olive" />,
      tips: [
        "Faites l'inventaire des décorations personnelles à récupérer",
        "Organisez une équipe de 4-5 personnes motivées",
        "Commencez par trier : à garder, à jeter, à redistribuer",
        "Prévoyez des sacs et cartons pour faciliter le transport"
      ]
    },
    {
      title: "Retour du matériel loué",
      icon: <Truck className="h-5 w-5 text-wedding-olive" />,
      tips: [
        "Vérifiez l'état du matériel avant le retour",
        "Prenez des photos en cas de casse préexistante",
        "Respectez les horaires de retour pour éviter les pénalités",
        "Gardez les reçus de retour comme justificatifs"
      ]
    },
    {
      title: "Remerciements",
      icon: <Heart className="h-5 w-5 text-wedding-olive" />,
      tips: [
        "Envoyez les remerciements dans les 2 semaines suivant le mariage",
        "Personnalisez chaque message selon la relation",
        "Joignez une photo du mariage si possible",
        "N'oubliez pas de remercier spécialement ceux qui ont aidé"
      ]
    },
    {
      title: "Administratif",
      icon: <FileText className="h-5 w-5 text-wedding-olive" />,
      tips: [
        "Récupérez et classez toutes les factures",
        "Vérifiez les derniers paiements aux prestataires",
        "Contactez votre assurance pour déclarer d'éventuels sinistres",
        "Conservez tous les documents pendant au moins 2 ans"
      ]
    }
  ];

  const quickChecklist = [
    "Récupérer ses affaires personnelles le lendemain",
    "Faire un état des lieux du lieu de réception", 
    "Organiser le retour du matériel de location",
    "Distribuer les fleurs aux proches",
    "Envoyer les photos aux invités qui en font la demande"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-wedding-olive">
            <Lightbulb className="h-5 w-5" />
            Conseils après le mariage
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
            À ne pas oublier dans les 48h
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

export default AfterWeddingAdvice;