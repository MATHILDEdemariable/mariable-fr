
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckSquare, 
  Coins, 
  Store, 
  Calendar, 
  Heart, 
  ListChecks,
  Wine,
  Settings 
} from 'lucide-react';

const DashboardFeatureCards: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Planning Personnalisé',
      description: 'Créez votre planning sur mesure',
      icon: <CheckSquare className="h-6 w-6" />,
      path: '/dashboard/planning',
      bgColor: 'bg-wedding-olive/10',
      hoverColor: 'hover:bg-wedding-olive/20',
      iconColor: 'text-wedding-olive'
    },
    {
      title: 'Gestion du Budget',
      description: 'Suivez vos dépenses et optimisez',
      icon: <Coins className="h-6 w-6" />,
      path: '/dashboard/budget',
      bgColor: 'bg-wedding-cream/40',
      hoverColor: 'hover:bg-wedding-cream/60',
      iconColor: 'text-wedding-olive'
    },
    {
      title: 'Prestataires',
      description: 'Trouvez et gérez vos fournisseurs',
      icon: <Store className="h-6 w-6" />,
      path: '/dashboard/prestataires',
      bgColor: 'bg-wedding-olive/5',
      hoverColor: 'hover:bg-wedding-olive/15',
      iconColor: 'text-wedding-olive'
    },
    {
      title: 'Coordination Jour J',
      description: 'Organisez votre timeline parfaite',
      icon: <Calendar className="h-6 w-6" />,
      path: '/dashboard/coordination',
      bgColor: 'bg-wedding-cream/30',
      hoverColor: 'hover:bg-wedding-cream/50',
      iconColor: 'text-wedding-olive'
    },
    {
      title: 'Ma Wishlist',
      description: 'Organisez vos coups de cœur',
      icon: <Heart className="h-6 w-6" />,
      path: '/dashboard/wishlist',
      bgColor: 'bg-white',
      hoverColor: 'hover:bg-wedding-olive/10',
      iconColor: 'text-wedding-olive'
    },
    {
      title: 'Liste de Tâches',
      description: 'Suivez vos préparatifs étape par étape',
      icon: <ListChecks className="h-6 w-6" />,
      path: '/dashboard/tasks',
      bgColor: 'bg-wedding-cream/20',
      hoverColor: 'hover:bg-wedding-cream/40',
      iconColor: 'text-wedding-olive'
    },
    {
      title: 'Calculatrice Boissons',
      description: 'Estimez vos quantités de boissons',
      icon: <Wine className="h-6 w-6" />,
      path: '/dashboard/drinks',
      bgColor: 'bg-wedding-olive/8',
      hoverColor: 'hover:bg-wedding-olive/18',
      iconColor: 'text-wedding-olive'
    },
    {
      title: 'Paramètres',
      description: 'Personnalisez votre profil',
      icon: <Settings className="h-6 w-6" />,
      path: '/dashboard/settings',
      bgColor: 'bg-white',
      hoverColor: 'hover:bg-gray-50',
      iconColor: 'text-wedding-olive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((feature, index) => (
        <Card 
          key={index}
          onClick={() => navigate(feature.path)}
          className={`cursor-pointer transition-all duration-200 border-wedding-olive/20 ${feature.bgColor} ${feature.hoverColor} hover:shadow-md hover:scale-105`}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`${feature.iconColor} mt-1`}>
                {feature.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-wedding-olive mb-1 font-serif">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardFeatureCards;
