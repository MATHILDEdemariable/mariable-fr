
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, CheckSquare, Coins, Store, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressItem {
  label: string;
  completed: boolean;
  description?: string;
  path: string;
  icon: React.ReactNode;
}

const ProgressOverview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define progress items matching sidebar order
  const progressItems: ProgressItem[] = [
    { 
      label: 'Planning personnalisé', 
      completed: location.pathname === '/dashboard/planning' || location.pathname.includes('/planning'), 
      description: 'Créez votre planning sur mesure',
      path: '/dashboard/planning',
      icon: <CheckSquare className="h-4 w-4" />
    },
    { 
      label: 'Budget défini', 
      completed: location.pathname === '/dashboard/budget' || location.pathname.includes('/budget'), 
      description: 'Établissez votre budget',
      path: '/dashboard/budget',
      icon: <Coins className="h-4 w-4" />
    },
    { 
      label: 'Prestataires contactés', 
      completed: location.pathname === '/dashboard/prestataires' || location.pathname.includes('/prestataires'), 
      description: 'Trouvez vos prestataires',
      path: '/dashboard/prestataires',
      icon: <Store className="h-4 w-4" />
    },
    { 
      label: 'Coordination Jour J', 
      completed: location.pathname === '/dashboard/coordination' || location.pathname.includes('/coordination'), 
      description: 'Organisez votre jour J',
      path: '/dashboard/coordination',
      icon: <Calendar className="h-4 w-4" />
    }
  ];

  const completedCount = progressItems.filter(item => item.completed).length;
  const progressPercentage = (completedCount / progressItems.length) * 100;

  const handleItemClick = (item: ProgressItem) => {
    navigate(item.path);
  };

  return (
    <Card className="bg-gradient-to-br from-wedding-olive/5 to-wedding-cream/10">
      <CardHeader>
        <CardTitle className="text-lg font-serif flex items-center gap-2">
          Votre avancement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {completedCount} sur {progressItems.length} sections complétées
            </span>
            <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          {progressItems.map((item, index) => (
            <div 
              key={index} 
              onClick={() => handleItemClick(item)}
              className={cn(
                "flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-all",
                "hover:bg-wedding-olive/10 hover:shadow-sm",
                item.completed ? "bg-wedding-olive/5" : "hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-2">
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-wedding-olive" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400" />
                )}
                {item.icon}
              </div>
              <div className="flex-1">
                <span className={cn(
                  "text-sm font-medium",
                  item.completed ? 'text-wedding-olive' : 'text-gray-600'
                )}>
                  {item.label}
                </span>
                {item.description && (
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                )}
              </div>
              {item.completed && (
                <div className="text-xs bg-wedding-olive/10 text-wedding-olive px-2 py-1 rounded">
                  Complété
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressOverview;
