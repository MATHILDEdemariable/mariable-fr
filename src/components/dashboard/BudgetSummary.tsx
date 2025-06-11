
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PieChart, Plus, Wallet, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Legend,
  Tooltip 
} from 'recharts';
import { 
  formatBudgetForDashboard, 
  mergeBudgetData, 
  validateBudgetStructure, 
  sanitizeBudgetData,
  DashboardBudgetData,
  CalculatorBudgetData 
} from '@/utils/budgetDataUtils';

const BudgetSummary: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch budget data from database
  const { data: budgetData, isLoading, error, refetch } = useQuery({
    queryKey: ['budgetDashboard'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('budgets_dashboard')
        .select('*')
        .eq('user_id', userData.user.id)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    }
  });

  // Save budget mutation with improved data handling
  const saveBudgetMutation = useMutation({
    mutationFn: async (budgetDataToSave: DashboardBudgetData) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      // Validate data structure before saving
      if (!validateBudgetStructure(budgetDataToSave)) {
        throw new Error("Invalid budget data structure");
      }

      const budgetPayload = {
        user_id: userData.user.id,
        total_budget: budgetDataToSave.totalEstimated,
        guests_count: budgetData?.guests_count || 100,
        region: budgetData?.region || 'France',
        season: budgetData?.season || 'basse',
        service_level: budgetData?.service_level || 'premium',
        selected_vendors: budgetData?.selected_vendors || [],
        breakdown: {
          ...budgetDataToSave,
          source: budgetDataToSave.source || 'dashboard',
          lastUpdated: new Date().toISOString()
        } as any
      };

      if (budgetData?.id) {
        const { data, error } = await supabase
          .from('budgets_dashboard')
          .update(budgetPayload)
          .eq('id', budgetData.id)
          .select();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('budgets_dashboard')
          .insert(budgetPayload)
          .select();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetDashboard'] });
      toast({
        title: "Budget sauvegardé",
        description: "Les données ont été mises à jour avec succès.",
      });
    },
    onError: (error: any) => {
      console.error("Error saving budget:", error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder le budget. Vos données restent visibles localement.",
        variant: "destructive",
      });
    }
  });

  // Parse and merge budget data intelligently
  const getBudgetSummary = (): DashboardBudgetData | null => {
    if (!budgetData?.breakdown) return null;

    try {
      // Try to parse the breakdown data
      let parsedBreakdown;
      if (typeof budgetData.breakdown === 'string') {
        parsedBreakdown = JSON.parse(budgetData.breakdown);
      } else {
        parsedBreakdown = budgetData.breakdown;
      }

      // Check if it's calculator data format
      if (parsedBreakdown.breakdown && Array.isArray(parsedBreakdown.breakdown)) {
        // Calculator format
        const calculatorData: CalculatorBudgetData = {
          total: parsedBreakdown.total || budgetData.total_budget || 0,
          breakdown: parsedBreakdown.breakdown,
          source: 'calculator'
        };
        return formatBudgetForDashboard(calculatorData);
      }

      // Check if it's dashboard format
      if (parsedBreakdown.categories && Array.isArray(parsedBreakdown.categories)) {
        const sanitized = sanitizeBudgetData(parsedBreakdown);
        if (sanitized) return sanitized;
      }

      // Fallback: try to create basic structure
      if (budgetData.total_budget) {
        return {
          categories: [{
            name: 'Budget global',
            items: [{
              id: 'global_budget',
              name: 'Budget total',
              estimated: budgetData.total_budget,
              actual: 0,
              deposit: 0,
              remaining: budgetData.total_budget,
              payment_note: ''
            }],
            totalEstimated: budgetData.total_budget,
            totalActual: 0,
            totalDeposit: 0,
            totalRemaining: budgetData.total_budget
          }],
          totalEstimated: budgetData.total_budget,
          totalActual: 0,
          totalDeposit: 0,
          totalRemaining: budgetData.total_budget,
          source: 'dashboard'
        };
      }

    } catch (error) {
      console.error('Error parsing budget data:', error);
    }

    return null;
  };

  const budgetSummary = getBudgetSummary();

  // Force refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Données actualisées",
        description: "Le budget a été rechargé depuis la base de données.",
      });
    } catch (error) {
      toast({
        title: "Erreur de rechargement",
        description: "Impossible de recharger les données.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Prepare chart data
  const chartData = budgetSummary?.categories?.map((category, index) => ({
    name: category.name,
    value: category.totalEstimated,
    color: `hsl(${(index * 360) / (budgetSummary?.categories?.length || 1)}, 70%, 50%)`
  })) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">
            Impossible de charger les données du budget.
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!budgetSummary) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun budget configuré</h3>
          <p className="text-gray-600 mb-4">
            Commencez par créer votre budget dans l'onglet calculatrice ou budget détaillé.
          </p>
          <Button asChild>
            <a href="/dashboard/budget?tab=calculator">
              <Plus className="h-4 w-4 mr-2" />
              Créer mon budget
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif text-wedding-olive">Résumé du Budget</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          {budgetSummary.source && (
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-md">
              Source: {budgetSummary.source === 'calculator' ? 'Calculatrice' : 'Dashboard'}
            </span>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Total</p>
                <p className="text-2xl font-bold text-wedding-olive">
                  {budgetSummary.totalEstimated.toLocaleString('fr-FR')} €
                </p>
              </div>
              <Wallet className="h-8 w-8 text-wedding-olive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dépenses Réelles</p>
                <p className="text-2xl font-bold text-blue-600">
                  {budgetSummary.totalActual.toLocaleString('fr-FR')} €
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Acomptes Versés</p>
                <p className="text-2xl font-bold text-orange-600">
                  {budgetSummary.totalDeposit.toLocaleString('fr-FR')} €
                </p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">€</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reste à Payer</p>
                <p className="text-2xl font-bold text-red-600">
                  {budgetSummary.totalRemaining.toLocaleString('fr-FR')} €
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString('fr-FR')} €`, 'Montant']}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Détail par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {budgetSummary.categories.map((category, index) => (
                <div key={category.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: chartData[index]?.color || '#aaadb0' }}
                    />
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-gray-600">{category.items.length} élément(s)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{category.totalEstimated.toLocaleString('fr-FR')} €</p>
                    {category.totalActual > 0 && (
                      <p className="text-xs text-blue-600">
                        Réel: {category.totalActual.toLocaleString('fr-FR')} €
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetSummary;
