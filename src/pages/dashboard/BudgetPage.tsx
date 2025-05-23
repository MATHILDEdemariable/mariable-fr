
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BudgetSummary from '@/components/dashboard/BudgetSummary';
import DetailedBudget from '@/components/dashboard/DetailedBudget';
import { BarChart, PieChart, Calculator } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Budget from '../services/Budget';
import BudgetCalculator from '@/components/dashboard/BudgetCalculator';

const BudgetPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('summary');

  // Fetch budget data for export
  const { data: budgetData } = useQuery({
    queryKey: ['budgetDashboard'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('budgets_dashboard')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data || { breakdown: JSON.stringify({ categories: [] }) };
    }
  });

  return (
    <>
      <Helmet>
        <title>Budget | Mariable</title>
        <meta name="description" content="Gérez le budget de votre mariage" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif text-wedding-olive">Budget de Mariage</h1>
        </div>

        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-1 sm:grid-cols-3 bg-wedding-cream/10">
            <TabsTrigger value="summary" className="flex items-center gap-2 data-[state=active]:bg-wedding-cream/30 data-[state=active]:text-wedding-olive">
              <PieChart className="h-4 w-4" />
              <span>Résumé</span>
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center gap-2 data-[state=active]:bg-wedding-cream/30 data-[state=active]:text-wedding-olive">
              <BarChart className="h-4 w-4" />
              <span>Budget Détaillé</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2 data-[state=active]:bg-wedding-cream/30 data-[state=active]:text-wedding-olive">
              <Calculator className="h-4 w-4" />
              <span>Calculatrice</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <BudgetSummary />
            </div>
          </TabsContent>

          <TabsContent value="detailed">
            <DetailedBudget />
          </TabsContent>

          <TabsContent value="calculator" className="bg-white rounded-lg">
            <div className="bg-white rounded-lg">
              <BudgetCalculator />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default BudgetPage;
