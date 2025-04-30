
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Euro, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BudgetCategory {
  name: string;
  amount: number;
  color: string;
}

const BUDGET_DATA: BudgetCategory[] = [
  { name: 'Lieu', amount: 5000, color: '#4CAF50' },
  { name: 'Traiteur', amount: 7000, color: '#2196F3' },
  { name: 'Décoration', amount: 2000, color: '#FFC107' },
  { name: 'Tenue', amount: 3000, color: '#9C27B0' },
  { name: 'Photo & Vidéo', amount: 2500, color: '#F44336' },
  { name: 'Marge & Imprévus', amount: 1500, color: '#607D8B' }
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-serif">Budget</CardTitle>
        <CardDescription>
          Aperçu de votre budget de mariage : {formatCurrency(totalBudget)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={BUDGET_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {BUDGET_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BUDGET_DATA.map((category) => (
            <div key={category.name} className="flex items-center space-x-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              <div>
                <p className="text-sm font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(category.amount)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-2" 
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
