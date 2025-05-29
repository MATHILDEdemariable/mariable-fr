
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeddingQuiz from '@/components/wedding-assistant/v2/WeddingQuiz';
import PlanningResults from '@/components/dashboard/PlanningResults';
import { usePersistentQuiz } from '@/hooks/usePersistentQuiz';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface QuizResult {
  status: string;
  score: number;
  level: string;
  objectives: string[];
  categories: string[];
}

const PlanningPage: React.FC = () => {
  const { quizData, loading } = usePersistentQuiz();
  const [userLevel, setUserLevel] = useState<QuizResult | null>(null);
  const [levelLoading, setLevelLoading] = useState(false);

  // Calculate user level based on quiz responses
  useEffect(() => {
    const calculateUserLevel = async () => {
      if (!quizData?.responses || !quizData?.completed) return;

      setLevelLoading(true);
      try {
        // Get all quiz questions and their scores
        const { data: questions, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*')
          .order('order_index');

        if (questionsError) throw questionsError;

        // Calculate total score based on user responses
        let totalScore = 0;
        
        Object.entries(quizData.responses).forEach(([questionId, answer]) => {
          const question = questions?.find(q => q.id === questionId);
          if (question && question.scores) {
            const scores = question.scores as any[];
            const scoreEntry = scores.find(s => s.answer === answer);
            if (scoreEntry) {
              totalScore += scoreEntry.score || 0;
            }
          }
        });

        // Get scoring ranges
        const { data: scoringData, error: scoringError } = await supabase
          .from('quiz_scoring')
          .select('*');

        if (scoringError) throw scoringError;

        // Find matching score range
        const matchingScore = scoringData?.find(score => 
          totalScore >= score.score_min && totalScore <= score.score_max
        );

        if (matchingScore) {
          // Determine level based on score
          let level = 'Débutant';
          if (totalScore <= 3) level = 'Début';
          else if (totalScore <= 7) level = 'Milieu';
          else level = 'Fin';

          setUserLevel({
            status: matchingScore.status,
            score: totalScore,
            level,
            objectives: matchingScore.objectives as string[],
            categories: matchingScore.categories as string[]
          });
        }
      } catch (error) {
        console.error('Error calculating user level:', error);
      } finally {
        setLevelLoading(false);
      }
    };

    calculateUserLevel();
  }, [quizData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif mb-2">Initiation Mariage</h1>
          <p className="text-muted-foreground">
            Chargement de vos données...
          </p>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-olive"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif mb-2">Initiation Mariage</h1>
        <p className="text-muted-foreground">
          Créez votre planning de mariage adapté à votre niveau d'avancement
        </p>
      </div>

      {/* Display user level if quiz is completed */}
      {userLevel && (
        <Card className="border-wedding-olive/20">
          <CardHeader>
            <CardTitle className="font-serif flex items-center justify-between">
              <span>Votre Niveau d'Avancement</span>
              <Badge variant="outline" className="bg-wedding-cream">
                {userLevel.level}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">{userLevel.status}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Score: {userLevel.score}/10
              </p>
            </div>

            {userLevel.objectives.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Objectifs recommandés :</h4>
                <ul className="space-y-1">
                  {userLevel.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-wedding-olive mt-2 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {userLevel.categories.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Catégories à prioriser :</h4>
                <div className="flex flex-wrap gap-2">
                  {userLevel.categories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">
            {quizData?.completed ? 'Questionnaire complété' : 'Questionnaire personnalisé'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {levelLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-wedding-olive"></div>
            </div>
          ) : (
            <WeddingQuiz />
          )}
        </CardContent>
      </Card>
      
      {/* Show planning results if quiz is completed */}
      {quizData?.completed && (
        <div className="mt-8">
          <h2 className="text-2xl font-serif mb-4">Votre Planning Personnalisé</h2>
          <PlanningResults />
        </div>
      )}
    </div>
  );
};

export default PlanningPage;
