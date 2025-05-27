
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, CheckSquare, Coins, Store, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgressTracking } from '@/hooks/useProgressTracking';

const ProgressOverview: React.FC = () => {
  const navigate = useNavigate();
  const { progressItems, getProgressPercentage } = useProgressTracking();

  const getIcon = (itemId: string) => {
    switch (itemId) {
      case 'planning': return <CheckSquare className="h-4 w-4" />;
      case 'budget': return <Coins className="h-4 w-4" />;
      case 'prestataires': return <Store className="h-4 w-4" />;
      case 'coordination': return <Calendar className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  const progressPercentage = getProgressPercentage();
  const completedCount = progressItems.filter(item => item.completed).length;

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
            <span className="text-sm font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          {progressItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleItemClick(item.path)}
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
                {getIcon(item.id)}
              </div>
              <div className="flex-1">
                <span className={cn(
                  "text-sm font-medium",
                  item.completed ? 'text-wedding-olive' : 'text-gray-600'
                )}>
                  {item.label}
                </span>
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
