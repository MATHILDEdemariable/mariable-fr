
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PlanningPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Planning de Mariage Personnalisé</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Créez un planning de mariage adapté à vos besoins et à votre niveau d'avancement.
          </p>
          <Button 
            onClick={() => navigate('/planning-personnalise')}
            className="bg-wedding-olive hover:bg-wedding-olive/90"
          >
            Commencer mon planning personnalisé
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanningPage;
