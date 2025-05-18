
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Type for budget category
interface BudgetItem {
  id: string;
  name: string;
  estimated: number;
  actual: number;
  deposit: number;
  remaining: number;
}

interface BudgetCategory {
  name: string;
  items: BudgetItem[];
  totalEstimated: number;
  totalActual: number;
  totalDeposit: number;
  totalRemaining: number;
}

// Default categories with proper initialization of all required properties
const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { name: 'Lieu de réception', items: [], totalEstimated: 0, totalActual: 0, totalDeposit: 0, totalRemaining: 0 },
  { name: 'Traiteur & Boissons', items: [], totalEstimated: 0, totalActual: 0, totalDeposit: 0, totalRemaining: 0 },
  { name: 'Tenues & Accessoires', items: [], totalEstimated: 0, totalActual: 0, totalDeposit: 0, totalRemaining: 0 },
  { name: 'Décoration & Fleurs', items: [], totalEstimated: 0, totalActual: 0, totalDeposit: 0, totalRemaining: 0 },
  { name: 'Photo & Vidéo', items: [], totalEstimated: 0, totalActual: 0, totalDeposit: 0, totalRemaining: 0 },
  { name: 'Musique & Animation', items: [], totalEstimated: 0, totalActual: 0, totalDeposit: 0, totalRemaining: 0 },
  { name: 'Transport', items: [], totalEstimated: 0, totalActual: 0, totalDeposit: 0, totalRemaining: 0 },
  { name: 'Papeterie', items: [], totalEstimated: 0, totalActual: 0, totalDeposit: 0, totalRemaining: 0 },
  { name: 'Cadeaux', items: [], totalEstimated: 0, totalActual: 0, totalDeposit: 0, totalRemaining: 0 },
  { name: 'Divers', items: [], totalEstimated: 0, totalActual: 0, totalDeposit: 0, totalRemaining: 0 },
];

const DetailedBudget: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [totalEstimated, setTotalEstimated] = useState(0);
  const [totalActual, setTotalActual] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);
  
  // Fetch budget data from Supabase
  const { data: budgetData, isLoading } = useQuery({
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
        // PGRST116 means no rows returned
        throw error;
      }
      
      return data;
    }
  });

  // Initialize categories once budget data is loaded
  useEffect(() => {
    if (budgetData?.breakdown) {
      try {
        // Check if breakdown contains the 'categories' property
        const breakdownData = typeof budgetData.breakdown === 'string' 
          ? JSON.parse(budgetData.breakdown) 
          : budgetData.breakdown;

        if (breakdownData && breakdownData.categories) {
          // Make sure we initialize totals properly for each category
          const processedCategories = Array.isArray(breakdownData.categories) ? breakdownData.categories.map(cat => ({
            ...cat,
            totalEstimated: typeof cat.totalEstimated === 'number' ? cat.totalEstimated : 0,
            totalActual: typeof cat.totalActual === 'number' ? cat.totalActual : 0,
            totalDeposit: typeof cat.totalDeposit === 'number' ? cat.totalDeposit : 0,
            totalRemaining: typeof cat.totalRemaining === 'number' ? cat.totalRemaining : 0,
            items: Array.isArray(cat.items) ? cat.items.map(item => ({
              ...item,
              estimated: typeof item.estimated === 'number' ? item.estimated : 0,
              actual: typeof item.actual === 'number' ? item.actual : 0,
              deposit: typeof item.deposit === 'number' ? item.deposit : 0,
              remaining: typeof item.remaining === 'number' ? item.remaining : 0
            })) : []
          })) : DEFAULT_CATEGORIES;
          
          setCategories(processedCategories);
          
          // Update totals with safe values
          setTotalEstimated(typeof breakdownData.totalEstimated === 'number' ? breakdownData.totalEstimated : 0);
          setTotalActual(typeof breakdownData.totalActual === 'number' ? breakdownData.totalActual : 0);
          setTotalDeposit(typeof breakdownData.totalDeposit === 'number' ? breakdownData.totalDeposit : 0);
          setTotalRemaining(typeof breakdownData.totalRemaining === 'number' ? breakdownData.totalRemaining : 0);
        } else {
          // If no categories found, initialize with default categories
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (e) {
        console.error("Error parsing budget data:", e);
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }
  }, [budgetData]);

  // Update budget data in Supabase
  const updateBudgetMutation = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('budgets_dashboard')
        .upsert({
          user_id: userData.user.id,
          total_budget: totalEstimated,
          guests_count: budgetData?.guests_count || 100,
          region: budgetData?.region || 'paris',
          season: budgetData?.season || 'summer',
          service_level: budgetData?.service_level || 'standard',
          selected_vendors: budgetData?.selected_vendors || [],
          breakdown: JSON.stringify({
            categories,
            totalEstimated,
            totalActual,
            totalDeposit,
            totalRemaining
          })
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetDashboard'] });
      toast({
        title: "Budget sauvegardé",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    },
    onError: (error) => {
      console.error("Error saving budget:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    }
  });

  // Add a new item to a category
  const handleAddItem = (categoryIndex: number) => {
    const newCategories = [...categories];
    const newItem: BudgetItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      estimated: 0,
      actual: 0,
      deposit: 0,
      remaining: 0
    };
    
    newCategories[categoryIndex].items.push(newItem);
    setCategories(newCategories);
  };

  // Remove an item from a category
  const handleRemoveItem = (categoryIndex: number, itemIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].items.splice(itemIndex, 1);
    setCategories(newCategories);
    updateTotals(newCategories);
  };

  // Update an item property (name, estimated, actual, etc.)
  const handleItemChange = (categoryIndex: number, itemIndex: number, field: keyof BudgetItem, value: string | number) => {
    const newCategories = [...categories];
    const item = newCategories[categoryIndex].items[itemIndex];
    
    // Update field value
    if (field === 'name') {
      item.name = value as string;
    } else {
      // Fix: Convert string to number safely
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      // Fix: Use type assertion to handle the TypeScript error
      (item[field] as number) = numValue;
      
      // Auto-calculate remaining amount
      if (field === 'estimated' || field === 'actual' || field === 'deposit') {
        item.remaining = (item.estimated > item.actual ? item.estimated : item.actual) - item.deposit;
      }
    }
    
    setCategories(newCategories);
    updateTotals(newCategories);
  };

  // Update totals for all categories and overall totals
  const updateTotals = (updatedCategories: BudgetCategory[]) => {
    let estimatedTotal = 0;
    let actualTotal = 0;
    let depositTotal = 0;
    let remainingTotal = 0;
    
    const categoriesWithTotals = updatedCategories.map(category => {
      let categoryEstimated = 0;
      let categoryActual = 0;
      let categoryDeposit = 0;
      let categoryRemaining = 0;
      
      category.items.forEach(item => {
        categoryEstimated += item.estimated || 0;
        categoryActual += item.actual || 0;
        categoryDeposit += item.deposit || 0;
        categoryRemaining += item.remaining || 0;
      });
      
      // Update category totals
      const updatedCategory = {
        ...category,
        totalEstimated: categoryEstimated,
        totalActual: categoryActual,
        totalDeposit: categoryDeposit,
        totalRemaining: categoryRemaining
      };
      
      // Add to overall totals
      estimatedTotal += categoryEstimated;
      actualTotal += categoryActual;
      depositTotal += categoryDeposit;
      remainingTotal += categoryRemaining;
      
      return updatedCategory;
    });
    
    // Update state
    setCategories(categoriesWithTotals);
    setTotalEstimated(estimatedTotal);
    setTotalActual(actualTotal);
    setTotalDeposit(depositTotal);
    setTotalRemaining(remainingTotal);
  };

  // Save budget to database
  const handleSaveBudget = () => {
    updateBudgetMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Chargement du budget détaillé...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between bg-white sticky top-0 z-10">
        <CardTitle className="text-xl font-serif">Budget Détaillé</CardTitle>
        <Button 
          onClick={handleSaveBudget} 
          className="bg-wedding-olive hover:bg-wedding-olive/90"
          disabled={updateBudgetMutation.isPending}
        >
          {updateBudgetMutation.isPending ? (
            <span className="flex items-center">
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
              Enregistrement...
            </span>
          ) : (
            <span className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </span>
          )}
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-y">
                <th className="px-4 py-3 text-left font-medium">Catégorie / Élément</th>
                <th className="px-4 py-3 text-right font-medium">Budget Estimé (€)</th>
                <th className="px-4 py-3 text-right font-medium">Coût Réel (€)</th>
                <th className="px-4 py-3 text-right font-medium">Acompte Versé (€)</th>
                <th className="px-4 py-3 text-right font-medium">Reste à Payer (€)</th>
                <th className="px-4 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, categoryIndex) => (
                <React.Fragment key={`category-${categoryIndex}`}>
                  {/* Category row */}
                  <tr className="bg-wedding-cream/20 border-t">
                    <td className="px-4 py-2 font-medium text-base">{category.name}</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {(category.totalEstimated ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {(category.totalActual ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {(category.totalDeposit ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {(category.totalRemaining ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleAddItem(categoryIndex)}
                        className="h-8 text-wedding-olive hover:text-wedding-olive/70"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        <span>Ajouter</span>
                      </Button>
                    </td>
                  </tr>
                  
                  {/* Items rows */}
                  {category.items.map((item, itemIndex) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 border-t border-gray-100">
                      <td className="px-4 py-2">
                        <Input
                          type="text"
                          value={item.name || ''}
                          onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'name', e.target.value)}
                          className="h-8 border-gray-200"
                          placeholder="Nom de l'élément"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={item.estimated || ''}
                          onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'estimated', e.target.value)}
                          className="h-8 text-right border-gray-200"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={item.actual || ''}
                          onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'actual', e.target.value)}
                          className="h-8 text-right border-gray-200"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={item.deposit || ''}
                          onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'deposit', e.target.value)}
                          className="h-8 text-right border-gray-200"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        {(item.remaining ?? 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(categoryIndex, itemIndex)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              
              {/* Totals row */}
              <tr className="border-t-2 border-t-wedding-olive/50 font-semibold">
                <td className="px-4 py-3">TOTAL</td>
                <td className="px-4 py-3 text-right">{(totalEstimated ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">{(totalActual ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">{(totalDeposit ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">{(totalRemaining ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedBudget;
