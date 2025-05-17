
import React from 'react';
import Budget from '@/pages/services/Budget'; 

interface BudgetCalculatorProps {
  showFullCalculator?: boolean;
}

const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({ showFullCalculator = false }) => {
  // If showFullCalculator is true, we display the full calculator directly
  // without the site header
  if (showFullCalculator) {
    return (
      <div className="budget-calculator-wrapper">
        <Budget />
      </div>
    );
  }

  // Code for minimal display mode (not used in this case)
  return null;
};

export default BudgetCalculator;
