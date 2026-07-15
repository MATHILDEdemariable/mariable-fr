import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock, Trophy, RotateCcw, Target, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface QuizResultDisplay {
  status: string;
  level?: string;
  categories: string[];
  objectives: string[];
}

const PlanningResultatsPersonnalises: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [result, setResult] = useState<QuizResultDisplay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      // 1. localStorage first (dernier quiz effectué)
      try {
        const local = localStorage.getItem('quizResult');
        if (local) {
          const parsed = JSON.parse(local);
          setResult({
            status: parsed.status || parsed.level || 'Votre profil',
            level: parsed.level,
            categories: Array.isArray(parsed.categories) ? parsed.categories.map(String) : [],
            objectives: Array.isArray(parsed.objectives) ? parsed.objectives.map(String) : [],
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('quizResult parse error', e);
      }

      // 2. BDD si connecté
      if (user) {
        const { data, error } = await supabase
          .from('user_quiz_results')
          .select('status, level, categories, objectives')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setResult({
            status: data.status || data.level || 'Votre profil',
            level: data.level,
            categories: Array.isArray(data.categories) ? (data.categories as any[]).map(String) : [],
            objectives: Array.isArray(data.objectives) ? (data.objectives as any[]).map(String) : [],
          });
          setLoading(false);
          return;
        }
      }

      // 3. Aucun résultat → renvoyer au quiz
      navigate('/planning-personnalise', { replace: true });
    };

    if (!authLoading) loadResult();
  }, [authLoading, user, navigate]);

  const content = (
    <>
      <Helmet>
        <title>Votre profil de planification | Mariable</title>
        <meta name="description" content="Découvrez votre profil de planification et vos objectifs personnalisés." />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        {loading || !result ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-wedding-olive" />
            <p className="text-muted-foreground">Chargement de vos résultats...</p>
          </div>
        ) : (
          <>
            {/* Profil */}
            <Card className="border-wedding-olive/20 bg-gradient-to-br from-wedding-cream/30 to-white mb-8">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-wedding-olive/10 rounded-full">
                    <Trophy className="h-8 w-8 text-wedding-olive" />
                  </div>
                </div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Votre profil d'organisation
                </p>
                <CardTitle className="text-3xl md:text-4xl font-serif text-wedding-olive mb-4">
                  {result.status}
                </CardTitle>
                <p className="text-base text-muted-foreground mb-6">
                  Félicitations pour votre mariage à venir ! Voici les objectifs personnalisés selon votre profil.
                </p>

                {result.categories.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {result.categories.map((cat, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 border border-wedding-olive/30 text-wedding-olive bg-wedding-cream/30"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-wedding-olive hover:bg-wedding-olive/90"
                  >
                    Accéder à mon tableau de bord
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      localStorage.removeItem('quizResult');
                      if (user) {
                        await supabase
                          .from('user_quiz_results')
                          .delete()
                          .eq('user_id', user.id);
                      }
                      navigate('/planning-personnalise?retake=1');
                    }}
                    className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Refaire le quiz
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Objectifs */}
            {result.objectives.length > 0 && (
              <Card className="border-wedding-olive/20 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Target className="h-5 w-5 text-wedding-olive" />
                    Vos prochains objectifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.objectives.map((objective, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-wedding-olive mt-2 flex-shrink-0" />
                        <span className="text-sm md:text-base leading-relaxed">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Continuez votre organisation */}
            <Card className="border-wedding-olive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif justify-center">
                  <Clock className="h-5 w-5 text-wedding-olive" />
                  Continuez votre organisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  Accédez à des outils personnalisés pour organiser votre mariage :
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
          </>
        )}
      </div>
    </>
  );

  // Authentifié → header dashboard ; sinon → marketing header
  if (isAuthenticated) {
    return <DashboardLayout>{content}</DashboardLayout>;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 mb-16">{content}</main>
      <Footer />
    </>
  );
};

export default PlanningResultatsPersonnalises;
