
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProgressItem {
  label: string;
  completed: boolean;
  description?: string;
}

const ProgressOverview: React.FC = () => {
  // This would be dynamically calculated based on user's actual data
  const progressItems: ProgressItem[] = [
    { label: 'Planning personnalisé', completed: false, description: 'Créez votre planning sur mesure' },
    { label: 'Budget défini', completed: false, description: 'Établissez votre budget' },
    { label: 'Prestataires contactés', completed: false, description: 'Trouvez vos prestataires' },
    { label: 'Wishlist créée', completed: false, description: 'Organisez vos favoris' },
    { label: 'Tâches planifiées', completed: false, description: 'Organisez vos démarches' }
  ];

  const completedCount = progressItems.filter(item => item.completed).length;
  const progressPercentage = (completedCount / progressItems.length) * 100;

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
            <div key={index} className="flex items-center gap-3 py-1">
              {item.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
              <div className="flex-1">
                <span className={`text-sm ${item.completed ? 'text-green-700' : 'text-gray-600'}`}>
                  {item.label}
                </span>
                {item.description && (
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressOverview;
