
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { CalendarIcon, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

const PlanningPersonnalise = () => {
  const [objectives, setObjectives] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const score = parseInt(queryParams.get('score') || '0', 10);
  const level = queryParams.get('level') || '';

  useEffect(() => {
    const fetchPlanningData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les données de scoring correspondant au score
        const { data: scoringData, error: scoringError } = await supabase
          .from('quiz_scoring')
          .select('*')
          .lte('score_min', score)
          .gte('score_max', score)
          .single();
        
        if (scoringError) throw scoringError;
        
        if (scoringData) {
          setStatus(scoringData.status);
          setObjectives(scoringData.objectives as string[]);
          setCategories(scoringData.categories as string[]);
        } else {
          // Fallback si aucune règle de scoring ne correspond
          setStatus("Débutant dans la planification");
          setObjectives(["Définir votre vision", "Établir un budget", "Trouver un lieu"]);
          setCategories(["Organisation", "Budget", "Lieu"]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError("Une erreur s'est produite lors du chargement de votre plan personnalisé.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (score > 0) {
      fetchPlanningData();
    } else {
      setError("Paramètres manquants. Veuillez refaire le quiz.");
      setIsLoading(false);
    }
  }, [score]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-wedding-olive mb-4" />
          <p>Génération de votre plan personnalisé...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90">
            <Link to="/wedding-assistant-v2?tab=planning">Refaire le quiz</Link>
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-8">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-serif">Votre niveau de préparation</CardTitle>
            <CardDescription>
              Score: {score}/10 - {level}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="bg-wedding-cream/20 p-4 rounded-lg text-center mb-4">
              <p className="text-lg font-medium">{status}</p>
            </div>
            
            <h3 className="text-xl font-serif mb-4">Vos objectifs prioritaires</h3>
            <div className="space-y-3 mb-8">
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="mt-0.5">
                    <CheckCircle2 className="h-5 w-5 text-wedding-olive" />
                  </div>
                  <div>
                    <p>{objective}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="text-xl font-serif mb-4">Catégories à prioriser</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {categories.map((category, index) => (
                <div key={index} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <p>{category}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-serif">Passez à l'étape suivante</h3>
              <p className="text-muted-foreground">
                Créez un compte pour accéder à votre checklist complète et suivre votre progression
              </p>
              
              <div className="pt-2">
                <Button 
                  asChild
                  className="w-full bg-wedding-olive hover:bg-wedding-olive/90 flex items-center gap-2 py-6"
                >
                  <Link to="/register">
                    <CalendarIcon className="mr-2" />
                    Créer mon compte gratuitement
                    <ChevronRight className="ml-2" size={18} />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Planning Personnalisé | Mariable</title>
        <meta name="description" content="Votre planning de mariage personnalisé selon votre niveau d'avancement" />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif text-center mb-8">
            Votre Planning Personnalisé
          </h1>
          
          {renderContent()}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PlanningPersonnalise;
