
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
    <div className="w-full mb-4 sm:mb-6">
      {/* Mobile: Horizontal scrollable container */}
      <div className="overflow-x-auto sm:overflow-x-visible">
        <div className="flex items-center justify-between min-w-max sm:min-w-0 px-2 sm:px-0">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <React.Fragment key={index}>
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300 flex-shrink-0",
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
                  <Check className="h-3 w-3 sm:h-5 sm:w-5" />
                ) : (
                  <span className="text-xs sm:text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              {index < totalSteps - 1 && (
                <div 
                  className={cn(
                    "h-0.5 transition-colors duration-300 mx-1 sm:mx-2",
                    "w-12 sm:flex-1",
                    index < currentStep || completedSteps[index] 
                      ? "bg-wedding-olive" 
                      : "bg-gray-200"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Step labels - responsive layout */}
      <div className="mt-2 sm:mt-3">
        {/* Mobile: Show current step label only */}
        <div className="block sm:hidden text-center">
          <div className="text-sm font-medium text-wedding-olive">
            {stepLabels[currentStep]}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Étape {currentStep + 1} sur {totalSteps}
          </div>
        </div>
        
        {/* Desktop: Show all labels */}
        <div className="hidden sm:flex justify-between">
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
    </div>
  );
};

export default PlanningStepIndicator;
