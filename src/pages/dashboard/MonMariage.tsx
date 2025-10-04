import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';

const MonMariage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Mon Mariage | Mariable</title>
        <meta name="description" content="Gérez vos projets de mariage générés par IA" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Mon Mariage</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                Créez votre projet de mariage avec l'IA
              </h2>
              <p className="text-muted-foreground mb-6">
                Utilisez Vibe Wedding pour générer un plan complet de votre mariage
              </p>
              <a href="/vibe-wedding">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Créer mon projet
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Fonctionnalités à venir</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Sauvegarder vos projets</p>
                  <p className="text-sm text-muted-foreground">
                    Conservez et accédez à tous vos projets de mariage générés
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Éditer et personnaliser</p>
                  <p className="text-sm text-muted-foreground">
                    Modifiez chaque détail de votre planning et budget
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Exporter en PDF</p>
                  <p className="text-sm text-muted-foreground">
                    Téléchargez votre projet complet au format PDF
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">4</span>
                </div>
                <div>
                  <p className="font-medium">Partager avec votre moitié</p>
                  <p className="text-sm text-muted-foreground">
                    Collaborez en temps réel sur votre projet de mariage
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MonMariage;
