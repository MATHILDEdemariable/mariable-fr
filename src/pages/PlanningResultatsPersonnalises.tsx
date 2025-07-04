import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, ArrowRight, CheckCircle, Loader2, Target, TrendingUp, Users, Clock, Brain, Star, Heart, RefreshCw } from 'lucide-react';
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
  detailed_answers?: Record<string, any>;
}

interface PersonalizedRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionUrl?: string;
  icon?: React.ReactNode;
}

interface PersonalizedInsight {
  title: string;
  content: string;
  type: 'strength' | 'challenge' | 'opportunity';
  basedOn: string;
}

const PlanningResultatsPersonnalises: React.FC = () => {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [insights, setInsights] = useState<PersonalizedInsight[]>([]);
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
      // Check localStorage first for recent results
      const localResult = localStorage.getItem('quizResult');
      if (localResult) {
        console.log('📱 Found local quiz result');
        const parsedResult = JSON.parse(localResult);
        setResult(parsedResult);
        
        // Generate recommendations based on local result
        const personalizedRecs = await generatePersonalizedRecommendations(parsedResult);
        setRecommendations(personalizedRecs);

        const personalizedInsights = generatePersonalizedInsights(parsedResult);
        setInsights(personalizedInsights);
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('👤 User authenticated, loading comprehensive data from database');
        
        // Load quiz results
        const { data: userQuizResults, error: quizError } = await supabase
          .from('user_quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (quizError) {
          console.error('❌ Error loading quiz results:', quizError);
          if (!localResult) throw quizError;
        }

        // Load detailed quiz responses from planning_reponses_utilisateur
        const { data: detailedResponses, error: responsesError } = await supabase
          .from('planning_reponses_utilisateur')
          .select('*')
          .eq('user_id', user.id)
          .order('date_creation', { ascending: false })
          .limit(1);

        if (responsesError) {
          console.error('❌ Error loading detailed responses:', responsesError);
        }

        if (userQuizResults && userQuizResults.length > 0) {
          const dbResult = userQuizResults[0];
          
          const objectives = Array.isArray(dbResult.objectives) 
            ? dbResult.objectives.map(obj => typeof obj === 'string' ? obj : String(obj))
            : [];
          const categories = Array.isArray(dbResult.categories) 
            ? dbResult.categories.map(cat => typeof cat === 'string' ? cat : String(cat))
            : [];

          const quizResult: QuizResult = {
            score: dbResult.score,
            status: dbResult.status,
            level: dbResult.level,
            objectives,
            categories
          };

          // Add detailed responses if available
          if (detailedResponses && detailedResponses.length > 0) {
            const responses = typeof detailedResponses[0].reponses === 'object' && detailedResponses[0].reponses !== null
              ? detailedResponses[0].reponses as Record<string, any>
              : {};
            quizResult.user_responses = responses;
            quizResult.detailed_answers = responses;
            console.log('📝 Loaded detailed responses:', Object.keys(responses));
          }

          // Use database results if no local result exists
          if (!localResult) {
            setResult(quizResult);
          }
          
          // Generate enhanced recommendations with database data
          const personalizedRecs = await generatePersonalizedRecommendations(quizResult);
          setRecommendations(personalizedRecs);

          const personalizedInsights = generatePersonalizedInsights(quizResult);
          setInsights(personalizedInsights);
          
        } else if (!localResult) {
          throw new Error('Aucun résultat de quiz trouvé');
        }
      } else if (!localResult) {
        throw new Error('Aucun résultat de quiz trouvé');
      }
      
    } catch (error) {
      console.error('❌ Error in loadPersonalizedResults:', error);
      setError('Impossible de récupérer vos résultats personnalisés');
      
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos résultats. Vous pouvez refaire le quiz.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePersonalizedRecommendations = async (quizResult: QuizResult): Promise<PersonalizedRecommendation[]> => {
    const recs: PersonalizedRecommendation[] = [];
    const responses = quizResult.user_responses || quizResult.detailed_answers || {};
    
    console.log('🎯 Generating personalized recommendations based on:', responses);

    // Recommendations based on score and level
    if (quizResult.score <= 5) {
      recs.push({
        title: "Commencez par les fondamentaux",
        description: "Définissez votre budget, votre date et le nombre d'invités - les trois piliers de votre mariage.",
        priority: 'high',
        category: 'Étapes essentielles',
        actionUrl: '/dashboard/planning'
      });
      
      recs.push({
        title: "Créez votre checklist personnalisée",
        description: "Organisez-vous avec notre checklist des 10 étapes clés adaptée à votre niveau.",
        priority: 'high',
        category: 'Organisation',
        actionUrl: '/checklist-mariage'
      });
    } else if (quizResult.score <= 12) {
      recs.push({
        title: "Réservez vos prestataires prioritaires",
        description: "Lieu, traiteur et photographe sont les prestataires à réserver en premier.",
        priority: 'high',
        category: 'Prestataires',
        actionUrl: '/dashboard/prestataires'
      });
      
      recs.push({
        title: "Planifiez votre jour J",
        description: "Créez le planning détaillé de votre journée de mariage.",
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
        title: "Organisez la coordination du jour J",
        description: "Déléguez les tâches et créez un planning précis pour profiter pleinement.",
        priority: 'high',
        category: 'Coordination',
        actionUrl: '/planning-jour-j'
      });
    }

    // Analyze specific responses for detailed recommendations
    Object.entries(responses).forEach(([key, value]) => {
      // Handle wedding size
      if (key.includes('invites') || key.includes('guests')) {
        const guestCount = parseInt(String(value)) || 0;
        if (guestCount > 100) {
          recs.push({
            title: "Gérez votre grand mariage",
            description: `Avec ${guestCount} invités, la logistique devient cruciale. Priorisez l'organisation.`,
            priority: 'high',
            category: 'Logistique'
          });
        } else if (guestCount < 30) {
          recs.push({
            title: "Profitez de votre mariage intime",
            description: "Avec un petit nombre d'invités, vous pouvez vous concentrer sur les détails personnalisés.",
            priority: 'medium',
            category: 'Personnalisation'
          });
        }
      }

      // Handle budget constraints
      if (key.includes('budget') && typeof value === 'string') {
        if (value.includes('10') || value.includes('petit')) {
          recs.push({
            title: "Optimisez votre budget maîtrisé",
            description: "Découvrez nos astuces pour un mariage magnifique avec un budget optimisé.",
            priority: 'high',
            category: 'Budget',
            actionUrl: '/dashboard/budget/calculator'
          });
        }
      }

      // Handle time availability
      if (key.includes('temps') || key.includes('time')) {
        if (typeof value === 'string' && (value.includes('peu') || value.includes('2h'))) {
          recs.push({
            title: "Organisez-vous avec un temps limité",
            description: "Concentrez-vous sur les tâches essentielles et déléguez quand c'est possible.",
            priority: 'high',
            category: 'Efficacité'
          });
        }
      }
    });

    return recs;
  };

  const generatePersonalizedInsights = (quizResult: QuizResult): PersonalizedInsight[] => {
    const insights: PersonalizedInsight[] = [];
    const responses = quizResult.detailed_answers || quizResult.user_responses || {};

    // Analyze based on score
    if (quizResult.score >= 15) {
      insights.push({
        title: "Excellente organisation !",
        content: "Vous avez une vision claire et une bonne préparation. Continuez sur cette lancée !",
        type: 'strength',
        basedOn: `Score élevé de ${quizResult.score}/20`
      });
    } else if (quizResult.score <= 5) {
      insights.push({
        title: "Début d'aventure",
        content: "Vous êtes au début de votre préparation. C'est le moment parfait pour bien poser les bases.",
        type: 'opportunity',
        basedOn: `Score de début: ${quizResult.score}/20`
      });
    }

    // Analyze specific responses
    Object.entries(responses).forEach(([key, value]) => {
      if (key.includes('style') && Array.isArray(value)) {
        insights.push({
          title: "Style bien défini",
          content: "Vos préférences stylistiques claires vous aideront à faire des choix cohérents.",
          type: 'strength',
          basedOn: "Préférences stylistiques définies"
        });
      }

      if (key.includes('priorite') || key.includes('priority')) {
        insights.push({
          title: "Priorités identifiées",
          content: "Avoir des priorités claires vous permettra d'allouer votre budget et votre énergie efficacement.",
          type: 'opportunity',
          basedOn: "Priorités de mariage définies"
        });
      }
    });

    return insights;
  };

  const handleRetakeQuiz = async () => {
    console.log('🔄 Recommencer le quiz depuis le début');
    
    // 1. Nettoyer immédiatement le localStorage
    localStorage.removeItem('quizResult');
    localStorage.removeItem('quizResponses');
    localStorage.removeItem('quizProgress');
    
    // 2. Nettoyer la base de données si utilisateur connecté (en arrière-plan)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Suppression en parallèle et silencieuse
      Promise.all([
        supabase.from('user_quiz_results').delete().eq('user_id', user.id),
        supabase.from('planning_reponses_utilisateur').delete().eq('user_id', user.id)
      ]).catch(error => console.error('❌ Erreur lors du nettoyage:', error));
    }
    
    // 3. Redirection immédiate vers le quiz
    navigate('/planning-personnalise');
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
    if (score <= 5) return {
      message: "Vous êtes au début de votre aventure !",
      color: "text-blue-600",
      icon: <Target className="h-5 w-5" />
    };
    if (score <= 12) return {
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

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Star className="h-4 w-4 text-green-600" />;
      case 'challenge': return <Target className="h-4 w-4 text-orange-600" />;
      case 'opportunity': return <Heart className="h-4 w-4 text-pink-600" />;
      default: return <Brain className="h-4 w-4 text-blue-600" />;
    }
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
            <p className="mb-8">{error || "Nous n'avons pas pu trouver vos résultats."}</p>
            <div className="space-y-4">
              <Button onClick={handleRetakeQuiz} className="bg-wedding-olive hover:bg-wedding-olive/90">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refaire le quiz
              </Button>
              <Button asChild variant="outline">
                <Link to="/checklist-mariage">Voir la checklist générale</Link>
              </Button>
            </div>
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif">Votre Planning de Mariage Personnalisé</h1>
          <Button onClick={handleRetakeQuiz} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refaire le quiz
          </Button>
        </div>
        
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

                {/* Insights personnalisés */}
                {insights.length > 0 && (
                  <Card className="border-wedding-olive/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-serif">
                        <Brain className="h-5 w-5 text-wedding-olive" />
                        Analyse personnalisée de votre profil
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {insights.map((insight, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                            <div className="flex items-start gap-3 mb-2">
                              {getInsightIcon(insight.type)}
                              <div className="flex-1">
                                <h4 className="font-medium text-wedding-olive">{insight.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{insight.content}</p>
                                <span className="text-xs bg-wedding-light px-2 py-1 rounded-full mt-2 inline-block">
                                  Basé sur : {insight.basedOn}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                      
                      <Link to="/checklist-mariage" className="border rounded-md p-4 bg-wedding-light/50 hover:bg-wedding-light transition-colors">
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
