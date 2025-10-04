import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';

const MonMariage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>Mon Mariage - Mariable</title>
        <meta name="description" content="Gérez vos projets de mariage générés par l'IA" />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-8 h-8 text-wedding-olive" />
              Mon Mariage
            </h1>
            <p className="text-gray-600 mt-2">
              Vos projets de mariage générés par l'IA
            </p>
          </div>
        </div>

        <Card className="border-wedding-olive/20">
          <CardHeader className="bg-gradient-to-r from-wedding-olive/5 to-white">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-wedding-olive" />
              Créez votre projet de mariage personnalisé
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center space-y-4 py-8">
              <div className="mx-auto w-20 h-20 bg-wedding-olive/10 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-wedding-olive" />
              </div>
              <h3 className="text-xl font-semibold">Aucun projet pour le moment</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Utilisez Vibe Wedding pour créer votre projet de mariage avec l'IA. 
                Vous pourrez ensuite le retrouver ici pour le consulter et le modifier à tout moment.
              </p>
              <Button 
                onClick={() => window.location.href = '/vibewedding'}
                className="bg-wedding-olive hover:bg-wedding-olive/90"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Créer mon projet
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fonctionnalités à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-wedding-olive mt-0.5">✓</span>
                <span>Sauvegarder et gérer vos projets Vibe Wedding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-wedding-olive mt-0.5">✓</span>
                <span>Modifier et affiner votre budget et planning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-wedding-olive mt-0.5">✓</span>
                <span>Exporter vos projets en PDF</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-wedding-olive mt-0.5">✓</span>
                <span>Partager avec votre partenaire et proches</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonMariage;
