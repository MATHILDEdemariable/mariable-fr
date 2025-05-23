
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, MousePointer, Calendar, DollarSign, Users, Heart } from 'lucide-react';

const DashboardInstructions: React.FC = () => {
  const navigationSteps = [
    {
      icon: <Navigation className="h-5 w-5" />,
      title: "Navigation par onglets",
      description: "Utilisez le menu latéral pour naviguer entre les différentes sections de votre tableau de bord."
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Tâches & Planning",
      description: "Gérez vos tâches prioritaires et suivez votre progression dans l'onglet 'Tâches'."
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Budget & Calculatrice",
      description: "Contrôlez vos finances dans l'onglet 'Budget' avec nos outils de calcul intégrés."
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Prestataires & Wishlist",
      description: "Trouvez et suivez vos prestataires dans les onglets dédiés à la gestion des services."
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Coordination Jour J",
      description: "Planifiez votre journée parfaite dans l'onglet 'Coordination' avec notre générateur de planning."
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl text-wedding-olive flex items-center gap-2">
          <MousePointer className="h-5 w-5" />
          Comment utiliser votre tableau de bord
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">
          Découvrez comment tirer le meilleur parti de votre tableau de bord Mariable. Utilisez le menu latéral pour naviguer entre les différentes sections.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navigationSteps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="text-wedding-olive mt-1">
                {step.icon}
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">{step.title}</h4>
                <p className="text-xs text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardInstructions;
