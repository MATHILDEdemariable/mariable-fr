
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Euro, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BudgetCategory {
  name: string;
  amount: number;
  color: string;
}

const BUDGET_DATA: BudgetCategory[] = [
  { name: 'Lieu', amount: 5000, color: '#7F9474' },
  { name: 'Traiteur', amount: 7000, color: '#9C9474' },
  { name: 'Décoration', amount: 2000, color: '#BEAE93' },
  { name: 'Tenue', amount: 3000, color: '#CCC5B9' },
  { name: 'Photo & Vidéo', amount: 2500, color: '#A69F88' },
  { name: 'Imprévus', amount: 1500, color: '#D1C8B8' }
];

const BudgetSummary: React.FC = () => {
  const totalBudget = BUDGET_DATA.reduce((sum, category) => sum + category.amount, 0);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  return (
    <Card className="bg-wedding-cream/10 border-wedding-olive/20">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif">Budget</CardTitle>
        <CardDescription>
          Aperçu de votre budget de mariage : {formatCurrency(totalBudget)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {BUDGET_DATA.map((category) => (
            <div key={category.name} className="relative">
              <div className="flex justify-between text-sm mb-1">
                <span>{category.name}</span>
                <span>{formatCurrency(category.amount)}</span>
              </div>
              <div className="w-full h-3 bg-wedding-cream/30 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${(category.amount / totalBudget) * 100}%`,
                    backgroundColor: category.color 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-wedding-olive/10 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Budget total</p>
            <p className="text-2xl font-medium font-serif">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-wedding-olive/10 flex items-center justify-center">
            <Euro className="h-6 w-6 text-wedding-olive" />
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-2 border-wedding-olive text-wedding-olive hover:bg-wedding-olive hover:text-white" 
          asChild
        >
          <Link to="/dashboard/budget">
            Voir le détail du budget <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;
