
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  className?: string;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestion,
  totalQuestions,
  className = ""
}) => {
  const percentage = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          Question {currentQuestion} sur {totalQuestions}
        </span>
        <span className="font-medium text-wedding-olive">
          {Math.round(percentage)}%
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2"
      />
    </div>
  );
};
