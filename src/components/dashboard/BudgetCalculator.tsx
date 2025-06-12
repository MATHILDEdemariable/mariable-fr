
import React from 'react';
import Budget from '@/pages/services/Budget';
import { Card, CardContent } from '@/components/ui/card';

const BudgetCalculator: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-0 overflow-hidden">
        <div className="p-4">
          <Budget />
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCalculator;
