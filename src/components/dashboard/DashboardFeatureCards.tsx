
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  ListChecks, 
  Coins, 
  Store, 
  Heart, 
  CheckSquare,
  Wine
} from 'lucide-react';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const DashboardFeatureCards: React.FC = () => {
  const features: FeatureCard[] = [
    {
      title: 'Planning',
      description: 'Créez votre planning personnalisé',
      icon: <CheckSquare className="h-6 w-6" />,
      path: '/dashboard/planning',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      title: 'Tâches',
      description: 'Suivez vos démarches',
      icon: <ListChecks className="h-6 w-6" />,
      path: '/dashboard/tasks',
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      title: 'Budget',
      description: 'Gérez vos finances',
      icon: <Coins className="h-6 w-6" />,
      path: '/dashboard/budget',
      color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'
    },
    {
      title: 'Prestataires',
      description: 'Trouvez vos partenaires',
      icon: <Store className="h-6 w-6" />,
      path: '/dashboard/prestataires',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    },
    {
      title: 'Wishlist',
      description: 'Organisez vos favoris',
      icon: <Heart className="h-6 w-6" />,
      path: '/dashboard/wishlist',
      color: 'bg-pink-50 hover:bg-pink-100 border-pink-200'
    },
    {
      title: 'Coordination',
      description: 'Planning jour J',
      icon: <Calendar className="h-6 w-6" />,
      path: '/dashboard/coordination',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
    },
    {
      title: 'Boissons',
      description: 'Calculez vos besoins',
      icon: <Wine className="h-6 w-6" />,
      path: '/dashboard/drinks',
      color: 'bg-red-50 hover:bg-red-100 border-red-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {features.map((feature, index) => (
        <Link key={index} to={feature.path}>
          <Card className={`transition-all duration-200 cursor-pointer hover:shadow-md ${feature.color}`}>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                {feature.icon}
              </div>
              <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default DashboardFeatureCards;
