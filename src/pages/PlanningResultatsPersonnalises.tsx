
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, ArrowRight, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PlanningResult, QuizScoring } from '@/components/wedding-assistant/v2/types';
import { useToast } from '@/components/ui/use-toast';

const PlanningResultatsPersonnalises: React.FC = () => {
  const [result, setResult] = useState<PlanningResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Récupérer le résultat du quiz depuis le localStorage
    const storedResult = localStorage.getItem('quizResult');
    
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResult(parsedResult);
      } catch (error) {
        console.error('Erreur lors de la récupération des résultats:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer vos résultats. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } else {
      // Rediriger vers la page du quiz si aucun résultat n'est trouvé
      navigate('/planning-personnalise');
      toast({
        title: "Information",
        description: "Veuillez d'abord compléter le quiz pour voir vos résultats.",
      });
    }

    setIsLoading(false);
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8 mb-16">
          <div className="text-center py-12">
            <p>Chargement de vos résultats...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!result) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8 mb-16">
          <div className="text-center py-12">
            <h1 className="text-3xl font-serif mb-4">Résultats non disponibles</h1>
            <p className="mb-8">Nous n'avons pas pu trouver vos résultats. Veuillez refaire le quiz.</p>
            <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90">
              <Link to="/planning-personnalise">Refaire le quiz</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Résultats de votre planning personnalisé | Mariable</title>
        <meta name="description" content="Découvrez votre plan de mariage personnalisé selon vos besoins - Mariable" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8 mb-16">
        <h1 className="text-3xl font-serif text-center mb-8">Votre Planning de Mariage Personnalisé</h1>
        
        <Card>
          <CardContent className="pt-6">
            <ScrollArea className="h-[70vh]">
              <div className="max-w-2xl mx-auto py-8 space-y-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-serif mb-2">Votre niveau de préparation</h2>
                  <div className="inline-block bg-wedding-cream px-4 py-2 rounded-md">
                    <p className="text-xl font-semibold">{result.status}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Score: {result.score}/10</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-serif">Objectifs recommandés</h3>
                  <ul className="space-y-4">
                    {result.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-wedding-olive text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="text-xl font-serif">Catégories à prioriser</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.categories.map((category, index) => (
                      <div key={index} className="border rounded-md p-4 bg-wedding-light/50 flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-wedding-olive flex-shrink-0 mt-0.5" />
                        <p>{category}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-6">
                  <h3 className="text-xl font-serif mb-2">Prêt à organiser votre mariage ?</h3>
                  <p className="text-muted-foreground">Accédez à des outils plus détaillés pour organiser votre grand jour :</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <Link to="/register" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light text-center">
                      <h4 className="font-medium mb-1">Calculer votre budget</h4>
                      <p className="text-sm text-muted-foreground">Créez un compte pour obtenir une estimation précise</p>
                    </Link>
                    
                    <Link to="/register" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light text-center">
                      <h4 className="font-medium mb-1">Voir votre checklist détaillée</h4>
                      <p className="text-sm text-muted-foreground">Accédez à votre planning personnalisé</p>
                    </Link>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      asChild
                      className="w-full bg-wedding-olive hover:bg-wedding-olive/90 flex items-center justify-center gap-2"
                    >
                      <Link to="/register">
                        <CalendarIcon size={18} />
                        Créer un compte gratuitement
                        <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </>
  );
};

export default PlanningResultatsPersonnalises;
