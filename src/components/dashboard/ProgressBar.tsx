
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress?: number;
  percentage?: number; // For backwards compatibility
  maxValue?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress = 0, 
  percentage, // Support both progress and percentage
  maxValue = 100, 
  className 
}) => {
  // Calculate percentage (clamped between 0-100%)
  const calculatedPercentage = percentage !== undefined 
    ? percentage 
    : Math.min(Math.max((progress / maxValue) * 100, 0), 100);
  
  return (
    <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", className)}>
      <div 
        className="bg-wedding-beige h-full transition-all duration-500 ease-in-out"
        style={{ width: `${calculatedPercentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
