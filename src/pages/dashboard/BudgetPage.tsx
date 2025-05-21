
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BudgetSummary from '@/components/dashboard/BudgetSummary';
import DetailedBudget from '@/components/dashboard/DetailedBudget';
import { Button } from '@/components/ui/button';
import { BarChart, PieChart, Download, FileDown, Calculator } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Budget from '../services/Budget';

const BudgetPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('summary');
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

  // Export budget data as CSV
  const handleExportCSV = () => {
    try {
      if (!budgetData || !budgetData.breakdown) {
        toast({
          title: "Erreur",
          description: "Aucune donnée de budget disponible pour l'exportation",
          variant: "destructive"
        });
        return;
      }

      // Parse the breakdown data
      const breakdownData = typeof budgetData.breakdown === 'string' 
        ? JSON.parse(budgetData.breakdown) 
        : budgetData.breakdown;

      if (!breakdownData || !breakdownData.categories || !Array.isArray(breakdownData.categories)) {
        toast({
          title: "Erreur",
          description: "Format de données invalide pour l'exportation",
          variant: "destructive"
        });
        return;
      }

      // Create CSV content
      let csvContent = "Catégorie,Élément,Budget Estimé,Coût Réel,Acompte Versé,Reste à Payer\n";
      
      breakdownData.categories.forEach(category => {
        if (category.items && Array.isArray(category.items)) {
          category.items.forEach(item => {
            // Format item data, handle empty fields
            const line = [
              `"${category.name}"`,
              `"${item.name || ''}"`,
              item.estimated || 0,
              item.actual || 0,
              item.deposit || 0,
              item.remaining || 0
            ].join(',');
            csvContent += line + "\n";
          });
        }
        
        // Add category total line
        const totalLine = [
          `"TOTAL ${category.name}"`,
          `""`,
          category.totalEstimated || 0,
          category.totalActual || 0,
          category.totalDeposit || 0,
          category.totalRemaining || 0
        ].join(',');
        csvContent += totalLine + "\n";
      });
      
      // Add grand totals
      csvContent += [
        `"GRAND TOTAL"`,
        `""`,
        breakdownData.totalEstimated || 0,
        breakdownData.totalActual || 0,
        breakdownData.totalDeposit || 0,
        breakdownData.totalRemaining || 0
      ].join(',') + "\n";

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", "budget_mariage.csv");
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement réussi",
        description: "Votre budget a été exporté au format CSV",
      });
    } catch (error) {
      console.error("Error exporting budget data:", error);
      toast({
        title: "Erreur",
        description: "Échec de l'exportation du budget",
        variant: "destructive",
      });
    }
  };

  // Download template file
  const handleDownloadTemplate = () => {
    // Simple template with categories and empty items
    let csvContent = "Catégorie,Élément,Budget Estimé,Coût Réel,Acompte Versé,Reste à Payer\n";
    
    const categories = [
      "Lieu de réception",
      "Traiteur & Boissons",
      "Tenues & Accessoires",
      "Décoration & Fleurs",
      "Photo & Vidéo",
      "Musique & Animation",
      "Transport",
      "Papeterie",
      "Cadeaux",
      "Divers"
    ];
    
    categories.forEach(category => {
      csvContent += `"${category}","",0,0,0,0\n`;
    });

    // Create and download the template
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "template_budget_mariage.csv");
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement du template réussi",
      description: "Le modèle de budget a été téléchargé",
    });
  };

  return (
    <>
      <Helmet>
        <title>Budget | Mariable</title>
        <meta name="description" content="Gérez le budget de votre mariage" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif text-wedding-olive">Budget de Mariage</h1>
          <div className="flex gap-2">
            <Button onClick={handleDownloadTemplate} variant="outline" className="flex gap-2 items-center">
              <FileDown size={18} />
              Template CSV
            </Button>
            <Button onClick={handleExportCSV} className="bg-wedding-olive hover:bg-wedding-olive/80 flex gap-2 items-center">
              <Download size={18} />
              Exporter CSV
            </Button>
          </div>
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

// Composant intégré pour la calculatrice de budget
const BudgetCalculator: React.FC = () => {
  return (
    <div className="p-4">
      <Budget />
    </div>
  );
};

export default BudgetPage;
