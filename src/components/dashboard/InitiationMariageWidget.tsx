import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Sparkles, Heart } from 'lucide-react';

const InitiationMariageWidget: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Quiz de style',
      description: 'Découvrez votre style de mariage',
      icon: <Sparkles className="h-4 w-4" />
    },
    {
      title: 'Budget estimatif',
      description: 'Obtenez une première estimation',
      icon: <Heart className="h-4 w-4" />
    },
    {
      title: 'Planning personnalisé',
      description: 'Planning adapté à votre date',
      icon: <Calendar className="h-4 w-4" />
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-wedding-olive/5 to-wedding-cream/20 border-wedding-olive/20">
      <CardHeader>
        <CardTitle className="text-lg font-serif flex items-center gap-2 text-wedding-olive">
          <Calendar className="h-5 w-5" />
          Initiation Mariage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 mb-3">
          Commencez votre aventure mariage avec nos outils personnalisés pour bien démarrer votre planification.
        </p>
        
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 py-1">
              <div className="text-wedding-olive">
                {feature.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-wedding-olive">{feature.title}</div>
                <div className="text-xs text-gray-600">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={() => navigate('/dashboard/planning')}
          className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white mt-4"
        >
          Commencer mon initiation
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default InitiationMariageWidget;