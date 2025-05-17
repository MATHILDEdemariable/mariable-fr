
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames?: string[];
  onStepClick?: (stepIndex: number) => void;
  allowNavigation?: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepNames,
  onStepClick,
  allowNavigation = false
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center w-full">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div
              className={cn(
                "flex items-center justify-center rounded-full w-8 h-8 transition-colors",
                index + 1 === currentStep
                  ? "border-2 border-wedding-olive text-wedding-olive font-semibold"
                  : index + 1 < currentStep
                  ? "bg-wedding-olive text-white"
                  : "border border-gray-300 text-gray-400",
                allowNavigation && index + 1 <= currentStep ? "cursor-pointer" : ""
              )}
              onClick={() => {
                if (allowNavigation && index + 1 <= currentStep && onStepClick) {
                  onStepClick(index + 1);
                }
              }}
            >
              {index + 1}
            </div>
            
            {/* Connector line, not for the last step */}
            {index < totalSteps - 1 && (
              <div 
                className={cn(
                  "flex-1 h-0.5",
                  isMobile ? "mx-1" : "mx-4",
                  index + 1 < currentStep ? "bg-wedding-olive" : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Step names if provided */}
      {stepNames && !isMobile && (
        <div className="flex justify-between mt-2">
          {stepNames.map((name, index) => (
            <div 
              key={index}
              className={cn(
                "text-xs text-center",
                index === 0 ? "text-left" : "",
                index === stepNames.length - 1 ? "text-right" : "",
                index + 1 === currentStep ? "text-wedding-olive font-medium" : "text-gray-500"
              )}
              style={{
                width: `${100/totalSteps}%`,
                maxWidth: `${100/totalSteps}%`,
              }}
            >
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepIndicator;
