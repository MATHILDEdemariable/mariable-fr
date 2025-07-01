
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, ArrowRight, CheckCircle, Loader2, Target, TrendingUp, Users, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface QuizResult {
  score: number;
  status: string;
  level: string;
  objectives: string[];
  categories: string[];
  user_responses?: Record<string, any>;
}

interface PersonalizedRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionUrl?: string;
}

const PlanningResultatsPersonnalises: React.FC = () => {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadPersonalizedResults();
  }, []);

  const loadPersonalizedResults = async () => {
    console.log('🚀 Loading personalized quiz results');
    setIsLoading(true);
    
    try {
      // Récupérer le résultat du localStorage comme fallback
      const storedResult = localStorage.getItem('quizResult');
      let quizResult: QuizResult | null = null;
      
      if (storedResult) {
        quizResult = JSON.parse(storedResult);
        console.log('📋 Quiz result from localStorage:', quizResult);
      }

      // Tenter de récupérer depuis la base de données
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('👤 User authenticated, loading from database');
        
        // Récupérer les résultats du quiz depuis la DB
        const { data: userQuizResults, error: quizError } = await supabase
          .from('user_quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (quizError) {
          console.error('❌ Error loading quiz results:', quizError);
        } else if (userQuizResults && userQuizResults.length > 0) {
          const dbResult = userQuizResults[0];
          quizResult = {
            score: dbResult.score,
            status: dbResult.status,
            level: dbResult.level,
            objectives: Array.isArray(dbResult.objectives) ? dbResult.objectives : [],
            categories: Array.isArray(dbResult.categories) ? dbResult.categories : []
          };
          console.log('✅ Quiz result from database:', quizResult);
        }

        // Récupérer les réponses détaillées pour personnalisation
        const { data: userResponses, error: responsesError } = await supabase
          .from('user_planning_responses')
          .select('responses')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!responsesError && userResponses) {
          if (quizResult) {
            quizResult.user_responses = userResponses.responses;
          }
          console.log('📝 User responses loaded:', userResponses.responses);
        }
      }

      if (!quizResult) {
        throw new Error('Aucun résultat de quiz trouvé');
      }

      setResult(quizResult);
      
      // Générer des recommandations personnalisées
      const personalizedRecs = await generatePersonalizedRecommendations(quizResult);
      setRecommendations(personalizedRecs);
      
    } catch (error) {
      console.error('❌ Error in loadPersonalizedResults:', error);
      setError('Impossible de récupérer vos résultats personnalisés');
      
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos résultats. Redirection vers le quiz...",
        variant: "destructive"
      });
      
      setTimeout(() => {
        navigate('/planning-personnalise');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePersonalizedRecommendations = async (quizResult: QuizResult): Promise<PersonalizedRecommendation[]> => {
    const recs: PersonalizedRecommendation[] = [];
    const responses = quizResult.user_responses || {};
    
    console.log('🎯 Generating personalized recommendations based on:', responses);

    // Recommandations basées sur le score et le niveau
    if (quizResult.score <= 3) {
      recs.push({
        title: "Créez votre budget détaillé",
        description: "Commencez par définir un budget réaliste pour éviter les mauvaises surprises.",
        priority: 'high',
        category: 'Budget',
        actionUrl: '/dashboard/budget'
      });
      
      recs.push({
        title: "Définissez votre date et vos invités",
        description: "Les deux décisions fondamentales qui impacteront tous vos autres choix.",
        priority: 'high',
        category: 'Planning'
      });
    } else if (quizResult.score <= 7) {
      recs.push({
        title: "Réservez vos prestataires prioritaires",
        description: "Lieu, traiteur et photographe sont les prestataires à réserver en premier.",
        priority: 'high',
        category: 'Prestataires',
        actionUrl: '/dashboard/prestataires'
      });
      
      recs.push({
        title: "Organisez votre timeline du jour J",
        description: "Planifiez le déroulement de votre journée pour un timing parfait.",
        priority: 'medium',
        category: 'Coordination',
        actionUrl: '/planning-jour-j'
      });
    } else {
      recs.push({
        title: "Peaufinez les derniers détails",
        description: "Confirmez tous les détails avec vos prestataires et préparez le jour J.",
        priority: 'medium',
        category: 'Finalisation'
      });
      
      recs.push({
        title: "Créez votre coordination du jour J",
        description: "Organisez la logistique et déléguez les tâches pour profiter pleinement.",
        priority: 'high',
        category: 'Coordination',
        actionUrl: '/planning-jour-j'
      });
    }

    // Recommandations basées sur les réponses spécifiques
    if (responses.budget_range) {
      const budget = responses.budget_range;
      if (budget === 'moins_10k' || budget === '10k_20k') {
        recs.push({
          title: "Optimisez votre budget limité",
          description: "Découvrez nos astuces pour un mariage magnifique avec un budget maîtrisé.",
          priority: 'high',
          category: 'Budget',
          actionUrl: '/dashboard/budget/calculator'
        });
      }
    }

    if (responses.guest_count) {
      const guests = parseInt(responses.guest_count) || 0;
      if (guests > 100) {
        recs.push({
          title: "Gérez votre grand mariage",
          description: "Avec plus de 100 invités, la logistique devient cruciale. Planifiez en conséquence.",
          priority: 'high',
          category: 'Logistique'
        });
      }
    }

    if (responses.time_available === 'moins_2h_semaine') {
      recs.push({
        title: "Optimisez votre temps limité",
        description: "Avec peu de temps disponible, concentrez-vous sur les tâches essentielles.",
        priority: 'high',
        category: 'Planning'
      });
    }

    return recs;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreInsight = (score: number) => {
    if (score <= 3) return {
      message: "Vous êtes au début de votre aventure !",
      color: "text-blue-600",
      icon: <Target className="h-5 w-5" />
    };
    if (score <= 7) return {
      message: "Vous progressez bien dans vos préparatifs !",
      color: "text-orange-600", 
      icon: <TrendingUp className="h-5 w-5" />
    };
    return {
      message: "Vous êtes sur la dernière ligne droite !",
      color: "text-green-600",
      icon: <CheckCircle className="h-5 w-5" />
    };
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8 mb-16">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Chargement de vos résultats personnalisés...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !result) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8 mb-16">
          <div className="text-center py-12">
            <h1 className="text-3xl font-serif mb-4">Résultats non disponibles</h1>
            <p className="mb-8">{error || "Nous n'avons pas pu trouver vos résultats. Veuillez refaire le quiz."}</p>
            <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90">
              <Link to="/planning-personnalise">Refaire le quiz</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const scoreInsight = getScoreInsight(result.score);

  return (
    <>
      <Helmet>
        <title>Votre Planning Personnalisé | Mariable</title>
        <meta name="description" content="Découvrez votre plan de mariage entièrement personnalisé selon vos réponses - Mariable" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8 mb-16">
        <h1 className="text-3xl font-serif text-center mb-8">Votre Planning de Mariage Personnalisé</h1>
        
        <Card>
          <CardContent className="pt-6">
            <ScrollArea className="h-[70vh]">
              <div className="max-w-2xl mx-auto py-8 space-y-8">
                
                {/* Section Score et Niveau */}
                <Card className="border-wedding-olive/20 bg-gradient-to-br from-wedding-cream/30 to-white">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-wedding-olive/10 rounded-full">
                        {scoreInsight.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-serif text-wedding-olive">
                      {scoreInsight.message}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-wedding-olive">{result.score}</div>
                        <div className="text-sm text-muted-foreground">Score sur 20</div>
                      </div>
                      <div>
                        <div className="text-lg font-medium">{result.level}</div>
                        <div className="text-sm text-muted-foreground">Niveau</div>
                      </div>
                      <div>
                        <div className="text-lg font-medium">{result.status}</div>
                        <div className="text-sm text-muted-foreground">Statut</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progression</span>
                        <span className="text-sm font-medium">{Math.round((result.score / 20) * 100)}%</span>
                      </div>
                      <Progress value={(result.score / 20) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Recommandations personnalisées */}
                {recommendations.length > 0 && (
                  <Card className="border-wedding-olive/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-serif">
                        <Target className="h-5 w-5 text-wedding-olive" />
                        Vos prochaines actions prioritaires
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recommendations.map((rec, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-wedding-olive">{rec.title}</h4>
                              <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                                {rec.priority === 'high' ? 'Urgent' : rec.priority === 'medium' ? 'Important' : 'À prévoir'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-wedding-light px-2 py-1 rounded-full">
                                {rec.category}
                              </span>
                              {rec.actionUrl && (
                                <Button asChild variant="outline" size="sm">
                                  <Link to={rec.actionUrl}>
                                    Commencer
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Objectifs du niveau */}
                {result.objectives && result.objectives.length > 0 && (
                  <Card className="border-wedding-olive/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-serif">
                        <CheckCircle className="h-5 w-5 text-wedding-olive" />
                        Objectifs pour votre niveau
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {result.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-wedding-olive mt-2 flex-shrink-0" />
                            <span className="text-sm leading-relaxed">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Catégories prioritaires */}
                {result.categories && result.categories.length > 0 && (
                  <Card className="border-wedding-olive/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-serif">
                        <Users className="h-5 w-5 text-wedding-olive" />
                        Domaines à prioriser
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.categories.map((category, index) => (
                          <div key={index} className="border rounded-md p-3 bg-wedding-light/50 flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-wedding-olive flex-shrink-0" />
                            <span className="text-sm">{category}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Separator />
                
                {/* Actions suivantes */}
                <Card className="border-wedding-olive/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif">
                      <Clock className="h-5 w-5 text-wedding-olive" />
                      Continuez votre organisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Accédez à des outils personnalisés pour organiser votre mariage selon vos besoins :
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link to="/register" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light transition-colors">
                        <h4 className="font-medium mb-1">Calculateur de budget intelligent</h4>
                        <p className="text-sm text-muted-foreground">Estimation personnalisée selon vos réponses</p>
                      </Link>
                      
                      <Link to="/register" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light transition-colors">
                        <h4 className="font-medium mb-1">Planning jour J personnalisé</h4>
                        <p className="text-sm text-muted-foreground">Timeline adaptée à vos choix</p>
                      </Link>
                      
                      <Link to="/register" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light transition-colors">
                        <h4 className="font-medium mb-1">Checklist détaillée</h4>
                        <p className="text-sm text-muted-foreground">Tâches prioritaires selon votre niveau</p>
                      </Link>
                      
                      <Link to="/register" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light transition-colors">
                        <h4 className="font-medium mb-1">Suivi des prestataires</h4>
                        <p className="text-sm text-muted-foreground">Recommandations selon vos critères</p>
                      </Link>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        asChild
                        className="w-full bg-wedding-olive hover:bg-wedding-olive/90 flex items-center justify-center gap-2"
                      >
                        <Link to="/register">
                          <CalendarIcon size={18} />
                          Créer mon compte pour accéder aux outils personnalisés
                          <ArrowRight size={16} />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
