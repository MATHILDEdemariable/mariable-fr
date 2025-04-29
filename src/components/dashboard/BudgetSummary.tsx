
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

// Ensure we always have valid data with proper structure
const BUDGET_DATA: BudgetCategory[] = [
  { name: 'Lieu', amount: 5000, color: '#7F9474' },  // Sage green
  { name: 'Traiteur', amount: 7000, color: '#A3B18A' }, // Lighter green
  { name: 'Décoration', amount: 2000, color: '#DAD7CD' }, // Beige
  { name: 'Tenue', amount: 3000, color: '#E9EDC9' }, // Light beige
  { name: 'Photo & Vidéo', amount: 2500, color: '#CCD5AE' }, // Light olive
  { name: 'Marge & Imprévus', amount: 1500, color: '#F8F6F0' } // Wedding cream
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
  
  // Ensure we have valid data for the chart
  const safeChartData = BUDGET_DATA.length > 0 ? BUDGET_DATA : [{ name: 'No Data', amount: 100, color: '#CCCCCC' }];
  
  return (
    <Card className="bg-wedding-cream/10 border-wedding-olive/20">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-wedding-olive">Budget</CardTitle>
        <CardDescription>
          Aperçu de votre budget de mariage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={safeChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="amount"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                strokeWidth={1}
                stroke="#F8F6F0"
              >
                {safeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {safeChartData.map((category) => (
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

        <div className="mt-6 border-t pt-4 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Euro className="h-6 w-6 text-wedding-olive mr-2" />
              <h3 className="text-2xl font-serif text-wedding-olive">{formatCurrency(totalBudget)}</h3>
            </div>
            <p className="text-sm text-muted-foreground">Budget total estimé</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-2 border-wedding-olive/30 text-wedding-olive hover:bg-wedding-olive/10" 
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
