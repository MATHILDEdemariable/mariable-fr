
import React from 'react';
import { Card } from '@/components/ui/card';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';

const DrinksCalculatorWidget = () => {
  return (
    <Card className="shadow-sm">
      <div className="p-3 sm:p-6">
        <h2 className="text-xl font-serif mb-4">Calculateur de boissons</h2>
        <DrinksCalculator />
      </div>
    </Card>
  );
};

export default DrinksCalculatorWidget;
