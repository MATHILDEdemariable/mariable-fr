
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WeddingQuiz from '@/components/wedding-assistant/v2/WeddingQuiz';
import { Card, CardContent } from "@/components/ui/card";

const PlanningPersonnalise: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Planning personnalisé | Mariable</title>
        <meta name="description" content="Créez un planning de mariage personnalisé selon vos besoins - Mariable" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8 mb-16">
        <h1 className="text-3xl font-serif text-center mb-4">Planning de Mariage Personnalisé</h1>
        <p className="text-center text-muted-foreground mb-8">
          Répondez à quelques questions pour recevoir un planning adapté à votre niveau d'avancement
        </p>
        
        <Card className="border-wedding-olive/20">
          <CardContent className="pt-6">
            <WeddingQuiz />
          </CardContent>
        </Card>
      </main>

      <Footer />
    </>
  );
};

export default PlanningPersonnalise;
