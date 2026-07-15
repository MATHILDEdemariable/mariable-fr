
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WeddingQuiz from '@/components/wedding-assistant/v2/WeddingQuiz';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw } from 'lucide-react';

const PlanningPersonnalise: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const retake = searchParams.get('retake') === '1';

  useEffect(() => {
    checkExistingQuizResults();
  }, []);

  const checkExistingQuizResults = async () => {
    console.log('🔍 Checking for existing quiz results...');

    try {
      if (retake) {
        console.log('🔄 Retake mode - clearing local quiz result');
        localStorage.removeItem('quizResult');
        setHasCompletedQuiz(false);
        return;
      }

      // Check localStorage first
      const localResult = localStorage.getItem('quizResult');
      if (localResult) {
        console.log('📱 Found local quiz result, redirecting to results page');
        navigate('/planning-resultats-personnalises');
        return;
      }

      // Check database for authenticated users
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('👤 User authenticated, checking database for quiz results');
        
        const { data: quizResults, error } = await supabase
          .from('user_quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('❌ Error checking quiz results:', error);
        } else if (quizResults && quizResults.length > 0) {
          console.log('✅ Found existing quiz result in database, redirecting');
          navigate('/planning-resultats-personnalises');
          return;
        }
      }

      console.log('🆕 No existing quiz results found, showing quiz form');
      setHasCompletedQuiz(false);
    } catch (error) {
      console.error('❌ Error in checkExistingQuizResults:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetakeQuiz = () => {
    console.log('🔄 Retaking quiz - clearing existing data');
    localStorage.removeItem('quizResult');
    setHasCompletedQuiz(false);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8 mb-16">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Vérification de votre progression...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Quiz Mariage | Mariable</title>
        <meta name="description" content="Répondez aux premières questions essentielles pour bien organiser votre mariage - Mariable" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8 mb-16">
        <h1 className="text-3xl font-serif text-center mb-4">Quiz Mariage</h1>
        <p className="text-center text-muted-foreground mb-8">
          Commencez par les premières questions essentielles pour bien organiser votre mariage. 
          Ce quiz vous aidera à identifier vos priorités et à structurer votre approche.
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
