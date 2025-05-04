
import React from 'react';
import { Card } from '@/components/ui/card';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';

const DrinksCalculatorWidget = () => {
  return (
    <Card className="shadow-sm overflow-hidden">
      <div className="p-3 sm:p-6 w-full overflow-x-auto">
        <h2 className="text-xl font-serif mb-4">Calculateur de boissons</h2>
        <div className="min-w-[280px]">
          <DrinksCalculator />
        </div>
      </div>
    </Card>
  );
};

export default DrinksCalculatorWidget;
