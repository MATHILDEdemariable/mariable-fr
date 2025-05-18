
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  maxValue: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress = 0, 
  maxValue = 100, 
  className 
}) => {
  // Calculate percentage (clamped between 0-100%)
  const percentage = Math.min(Math.max((progress / maxValue) * 100, 0), 100);
  
  return (
    <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", className)}>
      <div 
        className="bg-wedding-olive h-full transition-all duration-500 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
