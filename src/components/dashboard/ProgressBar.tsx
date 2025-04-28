
import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  percentage, 
  label, 
  className = "" 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className="text-wedding-olive font-semibold">{percentage}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-wedding-olive rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
};

export default ProgressBar;
