import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import BudgetSummary from '@/components/dashboard/BudgetSummary';
import DetailedBudget from '@/components/dashboard/DetailedBudget';
import { BarChart, PieChart, Calculator, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import BudgetCalculator from '@/components/dashboard/BudgetCalculator';

const BudgetPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

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

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      toast({
        title: "Export PDF en cours",
        description: "Préparation de votre budget..."
      });
      
      const { exportBudgetToPDF } = await import('@/services/budgetExportService');
      
      const success = await exportBudgetToPDF({
        budgetData,
        totalBudget: budgetData?.total_budget || 0,
        guestCount: budgetData?.guests_count || 0,
        region: budgetData?.region || '',
        season: budgetData?.season || ''
      });
      
      if (success) {
        toast({
          title: "Export réussi",
          description: "Votre budget a été exporté en PDF"
        });
      } else {
        toast({
          title: "Erreur d'export",
          description: "Une erreur s'est produite lors de l'export en PDF",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'export en PDF",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Budget | Mariable</title>
        <meta name="description" content="Gérez le budget de votre mariage" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif text-wedding-olive">Budget de Mariage</h1>
            <p className="text-gray-600 mt-2">Gérez et suivez le budget de votre mariage</p>
          </div>
          
          <Button
            variant="wedding"
            className="flex items-center gap-2"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Export...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Exporter en PDF
              </>
            )}
          </Button>
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
              <h2 className="text-xl font-serif text-wedding-olive mb-4">Résumé du Budget</h2>
              <BudgetSummary />
            </div>
          </TabsContent>

          <TabsContent value="detailed">
            <div>
              <h2 className="text-xl font-serif text-wedding-olive mb-4">Budget Détaillé</h2>
              <DetailedBudget />
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="bg-white rounded-lg">
            <div className="bg-white rounded-lg">
              <h2 className="text-xl font-serif text-wedding-olive mb-4 p-6 pb-0">Calculatrice de Budget</h2>
              <BudgetCalculator />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default BudgetPage;
