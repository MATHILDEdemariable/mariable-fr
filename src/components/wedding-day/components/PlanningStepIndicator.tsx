
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PlanningStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  completedSteps: boolean[];
  onStepClick?: (stepIndex: number) => void;
  allowNavigation?: boolean;
}

const PlanningStepIndicator: React.FC<PlanningStepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  completedSteps,
  onStepClick,
  allowNavigation = false
}) => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                index < currentStep || completedSteps[index]
                  ? "bg-wedding-olive border-wedding-olive text-white"
                  : index === currentStep
                  ? "border-wedding-olive text-wedding-olive bg-white"
                  : "border-gray-300 text-gray-400 bg-white",
                allowNavigation && (index <= currentStep || completedSteps[index]) && onStepClick
                  ? "cursor-pointer hover:scale-105"
                  : ""
              )}
              onClick={() => {
                if (allowNavigation && (index <= currentStep || completedSteps[index]) && onStepClick) {
                  onStepClick(index);
                }
              }}
            >
              {completedSteps[index] && index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            
            {index < totalSteps - 1 && (
              <div 
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-colors duration-300",
                  index < currentStep || completedSteps[index] 
                    ? "bg-wedding-olive" 
                    : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex justify-between mt-3">
        {stepLabels.map((label, index) => (
          <div 
            key={index}
            className={cn(
              "text-xs text-center max-w-[120px] truncate",
              index === currentStep 
                ? "text-wedding-olive font-medium" 
                : index < currentStep || completedSteps[index]
                ? "text-gray-700"
                : "text-gray-400"
            )}
            style={{ width: `${100/totalSteps}%` }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanningStepIndicator;
