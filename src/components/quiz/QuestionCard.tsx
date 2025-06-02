
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QuizQuestion, QuizOption } from '@/hooks/useWeddingQuiz';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedOptionId?: string;
  onOptionSelect: (optionId: string, score: number) => void;
  className?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionId,
  onOptionSelect,
  className = ""
}) => {
  return (
    <Card className={`border-wedding-olive/20 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg md:text-xl font-serif text-center">
          {question.question_text}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOptionId || ''}
          onValueChange={(optionId) => {
            const option = question.options.find(opt => opt.id === optionId);
            if (option) {
              onOptionSelect(optionId, option.score_value);
            }
          }}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div
              key={option.id}
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-wedding-olive/50 hover:bg-wedding-cream/20 transition-all duration-200 cursor-pointer"
            >
              <RadioGroupItem 
                value={option.id} 
                id={option.id}
                className="text-wedding-olive"
              />
              <Label 
                htmlFor={option.id}
                className="flex-grow cursor-pointer text-sm md:text-base leading-relaxed"
              >
                {option.option_text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
