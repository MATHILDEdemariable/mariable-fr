
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import BudgetSummary from '@/components/dashboard/BudgetSummary';
import DetailedBudget from '@/components/dashboard/DetailedBudget';
import { BarChart, PieChart, Calculator, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import BudgetCalculator from '@/components/dashboard/BudgetCalculator';
import { TutorialVideoModal } from '@/components/tutorials/TutorialVideoModal';
import PremiumGate from '@/components/premium/PremiumGate';
import { useUserProfile } from '@/hooks/useUserProfile';

const BudgetPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('calculator');
  const [showTutorial, setShowTutorial] = useState(false);
  const { isPremium, loading: loadingProfile } = useUserProfile();

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
      
      return data || { 
        breakdown: JSON.stringify({ categories: [] }),
        total_budget: 0,
        guests_count: 100,
        region: 'paris',
        season: 'summer'
      };
    }
  });

  return (
    <>
      <Helmet>
        <title>Budget | Mariable</title>
        <meta name="description" content="Gérez le budget de votre mariage" />
      </Helmet>

      <div className="space-y-3 sm:space-y-6 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif text-wedding-olive truncate">Budget de Mariage</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Tuto vidéo
          </Button>
        </div>

        <Tabs defaultValue="calculator" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 sm:mb-6 grid w-full grid-cols-2 bg-premium-sage/10 h-auto p-1">
            <TabsTrigger value="detailed" className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-premium-sage data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 min-h-[44px] touch-manipulation">
              <BarChart className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline truncate">Budget Détaillé</span>
              <span className="sm:hidden truncate">Détaillé</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-premium-sage data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 min-h-[44px] touch-manipulation">
              <Calculator className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline truncate">Calculatrice</span>
              <span className="sm:hidden truncate">Calc</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detailed" className="mt-3 sm:mt-6">
            <DetailedBudget />
          </TabsContent>

          <TabsContent value="calculator" className="bg-white rounded-lg mt-3 sm:mt-6">
            <div className="bg-white rounded-lg">
              <BudgetCalculator />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TutorialVideoModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        videoId="budget"
      />
    </>
  );
};

export default BudgetPage;
