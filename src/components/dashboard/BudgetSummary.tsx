
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Euro, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface BudgetCategory {
  name: string;
  amount: number;
  color: string;
}

const BUDGET_DATA: BudgetCategory[] = [
  { name: 'Lieu', amount: 5000, color: '#a19c88' }, // beige
  { name: 'Traiteur', amount: 7000, color: '#7F9474' }, // vert sauge
  { name: 'Décoration', amount: 2000, color: '#b5c4a8' }, // vert clair
  { name: 'Tenue', amount: 3000, color: '#d1c7b7' }, // beige clair
  { name: 'Photo & Vidéo', amount: 2500, color: '#908e7e' }, // taupe
  { name: 'Imprévus', amount: 1500, color: '#dbdacb' }  // crème
];

const BudgetSummary: React.FC = () => {
  const totalBudget = BUDGET_DATA.reduce((sum, category) => sum + category.amount, 0);
  const { toast } = useToast();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const handleExportPDF = () => {
    toast({
      title: "Export PDF",
      description: "Fonction d'export en cours de développement",
    });
  };
  
  return (
    <Card className="bg-wedding-cream/5 border-wedding-cream/20">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-wedding-olive">Budget</CardTitle>
        <CardDescription className="text-muted-foreground">
          Répartition de votre budget de mariage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={BUDGET_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="amount"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#7F9474', strokeWidth: 0.5 }}
                strokeWidth={1}
                stroke="#f8f6f0"
              >
                {BUDGET_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend formatter={(value) => <span className="text-sm font-medium">{value}</span>} />
            </ResponsiveContainer>
          </div>
          
          <div className="pt-6 border-t border-wedding-cream/30">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-wedding-cream/20 p-2 rounded-full">
                <Euro className="h-8 w-8 text-wedding-olive" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Budget total</p>
                <p className="text-2xl font-medium text-wedding-olive">{formatCurrency(totalBudget)}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
          
          <div className="flex items-center justify-between gap-2 mt-4">
            <Button 
              variant="outline" 
              className="flex-1" 
              asChild
            >
              <Link to="/dashboard/budget">
                Voir le détail <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="outline"
              className="bg-wedding-olive/10 hover:bg-wedding-olive/20 text-wedding-olive"
              onClick={handleExportPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;
