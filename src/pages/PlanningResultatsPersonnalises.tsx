import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PlanningResultatsPersonnalises: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Félicitations ! | Mariable</title>
        <meta name="description" content="Félicitations pour votre mariage à venir - Découvrez les outils Mariable pour vivre un moment unique" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="border-wedding-olive/20 bg-gradient-to-br from-wedding-cream/30 to-white mb-8">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-wedding-olive/10 rounded-full">
                  <Heart className="h-8 w-8 text-wedding-olive" />
                </div>
              </div>
              <CardTitle className="text-3xl font-serif text-wedding-olive mb-4">
                Félicitations pour votre mariage à venir !
              </CardTitle>
              <p className="text-lg text-muted-foreground mb-6">
                Avec les outils Mariable, vous allez pouvoir vivre un moment unique et parfaitement organisé.
              </p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-wedding-olive hover:bg-wedding-olive/90 text-lg px-8 py-3"
              >
                Accéder à mon tableau de bord
              </Button>
            </CardHeader>
          </Card>

          {/* Section Continuez votre organisation */}
          <Card className="border-wedding-olive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif justify-center">
                <Clock className="h-5 w-5 text-wedding-olive" />
                Continuez votre organisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Accédez à des outils personnalisés pour organiser votre mariage selon vos besoins :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/dashboard/budget" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light transition-colors">
                  <h4 className="font-medium mb-1">Calculateur de budget intelligent</h4>
                  <p className="text-sm text-muted-foreground">Estimation personnalisée selon vos réponses</p>
                </Link>
                
                <Link to="/mon-jour-m/planning" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light transition-colors">
                  <h4 className="font-medium mb-1">Planning jour J personnalisé</h4>
                  <p className="text-sm text-muted-foreground">Timeline adaptée à vos choix</p>
                </Link>
                
                <Link to="/checklist-mariage" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light transition-colors">
                  <h4 className="font-medium mb-1">Checklist détaillée</h4>
                  <p className="text-sm text-muted-foreground">Tâches prioritaires selon votre niveau</p>
                </Link>
                
                <Link to="/dashboard/prestataires" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light transition-colors">
                  <h4 className="font-medium mb-1">Suivi des prestataires</h4>
                  <p className="text-sm text-muted-foreground">Recommandations selon vos critères</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PlanningResultatsPersonnalises;