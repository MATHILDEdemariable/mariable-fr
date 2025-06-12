
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip
} from 'recharts';
import { 
  Euro, ArrowRight, Download, Share2,
  MapPin, Calculator, Users, Calendar, Info, ChevronRight, ChevronDown, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { exportDashboardToPDF } from '@/services/pdfExportService';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Import des types et utilitaires
import { 
  BudgetCategory, 
  DashboardBudgetData, 
  DatabaseBudgetRecord 
} from '@/types/budgetTypes';
import { 
  formatDatabaseBudgetForDashboard, 
  sanitizeBudgetData, 
  validateBudgetStructure, 
  getDefaultBudgetData 
} from '@/utils/budgetDataUtils';

const BudgetSummary: React.FC = () => {
  // État pour les données de budget
  const [budgetData, setBudgetData] = useState<DashboardBudgetData>(getDefaultBudgetData());
  const [showCalculator, setShowCalculator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pour les toasts
  const { toast } = useToast();
  
  // Formater les montants en euros
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Query pour récupérer les données budget
  const { data: budgetRecord, refetch: refetchBudget } = useQuery({
    queryKey: ['budgetDashboard'],
    queryFn: async (): Promise<DatabaseBudgetRecord | null> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("User not authenticated");
        
        const { data, error } = await supabase
          .from('budgets_dashboard')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        return data && data.length > 0 ? data[0] : null;
      } catch (error) {
        console.error("Erreur lors de la récupération des données budget:", error);
        throw error;
      }
    }
  });

  // Effet pour traiter les données récupérées
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      if (budgetRecord) {
        console.log("Données budget récupérées:", budgetRecord);
        
        // Convertir les données database vers format dashboard
        const dashboardData = formatDatabaseBudgetForDashboard(budgetRecord);
        
        // Sanitizer les données
        const sanitizedData = sanitizeBudgetData(dashboardData);
        
        if (sanitizedData && validateBudgetStructure(sanitizedData)) {
          setBudgetData(sanitizedData);
          console.log("Données budget mises à jour:", sanitizedData);
        } else {
          console.warn("Données budget invalides, utilisation des données par défaut");
          setBudgetData(getDefaultBudgetData());
        }
      } else {
        console.log("Aucune donnée budget trouvée, utilisation des données par défaut");
        setBudgetData(getDefaultBudgetData());
      }
    } catch (error) {
      console.error("Erreur lors du traitement des données budget:", error);
      setError("Erreur lors du chargement des données budget");
      setBudgetData(getDefaultBudgetData());
    } finally {
      setIsLoading(false);
    }
  }, [budgetRecord]);

  // Fonction pour rafraîchir les données
  const refreshBudgetData = async () => {
    try {
      await refetchBudget();
      toast({
        title: "Données actualisées",
        description: "Les données du budget ont été mises à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rafraîchir les données",
        variant: "destructive"
      });
    }
  };

  // Gérer l'export CSV
  const handleDirectExport = () => {
    toast({
      title: "Export CSV en cours",
      description: "Préparation de votre document...",
    });
    
    setTimeout(() => {
      // Create CSV content from budget data
      let csvContent = "Catégorie,Montant\n";
      budgetData.categories.forEach(item => {
        csvContent += `"${item.name}","${item.amount}"\n`;
      });
      csvContent += `"TOTAL","${budgetData.total}"\n`;
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `budget-summary-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export réussi",
        description: "Votre résumé budgétaire a été exporté au format CSV",
      });
    }, 500);
  };

  if (isLoading) {
    return (
      <Card className="bg-wedding-cream/5 border-wedding-cream/20">
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-wedding-olive">Budget</CardTitle>
          <CardDescription className="text-muted-foreground">
            Chargement des données...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-wedding-cream/5 border-wedding-cream/20">
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-wedding-olive">Budget</CardTitle>
          <CardDescription className="text-muted-foreground">
            Erreur de chargement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refreshBudgetData} variant="outline">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-wedding-cream/5 border-wedding-cream/20">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-wedding-olive">Budget</CardTitle>
        <CardDescription className="text-muted-foreground">
          Répartition de votre budget de mariage
          {budgetData.source === 'calculator' && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Calculé
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Graphique en secteurs */}
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetData.categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius="90%"
                paddingAngle={2}
                dataKey="amount"
                nameKey="name"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#7F9474', strokeWidth: 0.5 }}
                strokeWidth={1}
                stroke="#f8f6f0"
              >
                {budgetData.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Total et informations */}
        <div className="pt-6 border-t border-wedding-cream/30">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-wedding-cream/20 p-2 rounded-full">
              <Euro className="h-8 w-8 text-wedding-olive" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Budget total</p>
              <p className="text-2xl font-medium text-wedding-olive">{formatCurrency(budgetData.total)}</p>
            </div>
          </div>
        </div>
        
        {/* Détail des catégories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {budgetData.categories.map((category, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 bg-white/50 rounded-md">
              <div 
                className="h-4 w-4 rounded-full shrink-0" 
                style={{ backgroundColor: category.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{category.name}</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(category.amount)}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Métadonnées si disponibles */}
        {budgetData.metadata && (
          <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-md">
            {budgetData.metadata.region && (
              <p>Région: {budgetData.metadata.region}</p>
            )}
            {budgetData.metadata.guestsCount && (
              <p>Invités: {budgetData.metadata.guestsCount}</p>
            )}
            {budgetData.metadata.season && (
              <p>Saison: {budgetData.metadata.season}</p>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
          <Link to="/budget" className="w-full sm:flex-1">
            <Button 
              variant="outline" 
              className="w-full bg-wedding-cream/10 hover:bg-wedding-cream/20" 
            >
              <Calculator className="mr-2 h-4 w-4" />
              Calculer mon budget
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button 
              onClick={refreshBudgetData}
              variant="outline"
              size="sm"
            >
              Actualiser
            </Button>
            
            <Button 
              onClick={handleDirectExport}
              className="bg-wedding-olive hover:bg-wedding-olive/80 flex gap-2 items-center"
              size="sm"
            >
              <Download className="h-4 w-4" />
              Exporter CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;
