
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, RotateCcw, Save } from 'lucide-react';
import { QuizResults as QuizResultsType } from '@/hooks/useWeddingQuiz';

interface QuizResultsProps {
  results: QuizResultsType;
  onRetakeQuiz: () => void;
  onSaveResults: () => void;
  className?: string;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  results,
  onRetakeQuiz,
  onSaveResults,
  className = ""
}) => {
  if (!results.level) {
    return (
      <Card className={`border-wedding-olive/20 ${className}`}>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            Impossible de déterminer votre niveau. Veuillez refaire le quiz.
          </p>
          <Button onClick={onRetakeQuiz} className="mt-4">
            Refaire le quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Félicitations */}
      <Card className="border-wedding-olive/20 bg-gradient-to-br from-wedding-cream/30 to-white">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-wedding-olive/10 rounded-full">
              <Trophy className="h-8 w-8 text-wedding-olive" />
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-serif text-wedding-olive">
            Félicitations !
          </CardTitle>
          <p className="text-muted-foreground">
            Vous avez terminé le questionnaire de planification
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-wedding-olive">
              {results.totalScore}
            </div>
            <div className="text-sm text-muted-foreground">points sur 20</div>
          </div>
          
          <Badge variant="outline" className="bg-wedding-olive text-white border-wedding-olive px-4 py-1 text-base">
            {results.level.level_name}
          </Badge>
          
          <p className="text-lg font-medium text-gray-800">
            {results.level.level_status}
          </p>
          
          <p className="text-muted-foreground leading-relaxed">
            {results.level.description}
          </p>
        </CardContent>
      </Card>

      {/* Objectifs */}
      {results.level.objectives && results.level.objectives.length > 0 && (
        <Card className="border-wedding-olive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Target className="h-5 w-5 text-wedding-olive" />
              Vos prochains objectifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {results.level.objectives.map((objective) => (
                <li key={objective.id} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-wedding-olive mt-2 flex-shrink-0" />
                  <span className="text-sm md:text-base leading-relaxed">
                    {objective.objective_text}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onRetakeQuiz}
          className="flex-1 border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Refaire le quiz
        </Button>
        <Button
          onClick={onSaveResults}
          className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90"
        >
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder les résultats
        </Button>
      </div>
    </div>
  );
};
