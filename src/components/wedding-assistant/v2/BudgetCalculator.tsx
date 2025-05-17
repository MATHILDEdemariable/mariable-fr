
import React from 'react';
import Budget from '@/pages/services/Budget'; 

interface BudgetCalculatorProps {
  showFullCalculator?: boolean;
}

const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({ showFullCalculator = false }) => {
  // Si showFullCalculator est true, on affiche directement la calculatrice complète
  // sans le header du site
  if (showFullCalculator) {
    return (
      <div className="budget-calculator-wrapper">
        <Budget hideHeader={true} />
      </div>
    );
  }

  // Code pour le mode d'affichage minimal (non utilisé dans ce cas)
  return null;
};

export default BudgetCalculator;
