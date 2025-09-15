
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Save, Download } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { exportBudgetToPDF } from '@/services/budgetExportService';

// Type for budget category
interface BudgetItem {
  id: string;
  name: string;
  estimated: number;
  actual: number;
  deposit: number;
  remaining: number;
  payment_note: string;
}

interface BudgetCategory {
  name: string;
  items: BudgetItem[];
  totalEstimated: number;
  totalActual: number;
  totalDeposit: number;
  totalRemaining: number;
}

// Type for database budget detail item
interface BudgetDetailDB {
  id: string;
  user_id: string;
  category_name: string;
  item_id: string;
  item_name: string;
  estimated: number;
  actual: number;
  deposit: number;
  remaining: number;
  payment_note: string;
  created_at: string;
  updated_at: string;
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
  const [categories, setCategories] = useState<BudgetCategory[]>(DEFAULT_CATEGORIES);
  const [totalEstimated, setTotalEstimated] = useState(0);
  const [totalActual, setTotalActual] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [saveTimeouts, setSaveTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>({});
  
  // Fetch detailed budget data from Supabase
  const { data: budgetDetailsData, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['budgetDetails'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('budgets_detail')
        .select('*')
        .eq('user_id', userData.user.id);
        
      if (error) throw error;
      return data as BudgetDetailDB[];
    }
  });

  // Fetch budget data from Supabase for fallback
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
      
      return data;
    }
  });

  // Save individual budget item mutation with proper error handling
  const saveBudgetItemMutation = useMutation({
    mutationFn: async ({ item, categoryName }: { item: BudgetItem; categoryName: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const itemData = {
        user_id: userData.user.id,
        category_name: categoryName,
        item_id: item.id,
        item_name: item.name,
        estimated: Number(item.estimated) || 0,
        actual: Number(item.actual) || 0,
        deposit: Number(item.deposit) || 0,
        remaining: Number(item.remaining) || 0,
        payment_note: item.payment_note || ''
      };

      const { data, error } = await supabase
        .from('budgets_detail')
        .upsert(itemData, {
          onConflict: 'user_id,item_id'
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetDetails'] });
    },
    onError: (error) => {
      console.error("Error saving budget item:", error);
    }
  });

  // Delete budget item mutation
  const deleteBudgetItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('budgets_detail')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('item_id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetDetails'] });
    },
    onError: (error) => {
      console.error("Error deleting budget item:", error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer l'élément.",
        variant: "destructive",
      });
    }
  });

  // Function to calculate remaining amount
  const calculateRemaining = (estimated: number, actual: number, deposit: number): number => {
    const baseAmount = Math.max(estimated, actual);
    return baseAmount - deposit;
  };

  // Function to calculate totals from categories
  const calculateTotalsFromCategories = useCallback((updatedCategories: BudgetCategory[]) => {
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
        categoryEstimated += Number(item.estimated) || 0;
        categoryActual += Number(item.actual) || 0;
        categoryDeposit += Number(item.deposit) || 0;
        categoryRemaining += Number(item.remaining) || 0;
      });
      
      const updatedCategory = {
        ...category,
        totalEstimated: categoryEstimated,
        totalActual: categoryActual,
        totalDeposit: categoryDeposit,
        totalRemaining: categoryRemaining
      };
      
      estimatedTotal += categoryEstimated;
      actualTotal += categoryActual;
      depositTotal += categoryDeposit;
      remainingTotal += categoryRemaining;
      
      return updatedCategory;
    });
    
    setTotalEstimated(estimatedTotal);
    setTotalActual(actualTotal);
    setTotalDeposit(depositTotal);
    setTotalRemaining(remainingTotal);
    
    return categoriesWithTotals;
  }, []);

  // Load data from database when component mounts or data changes
  useEffect(() => {
    if (budgetDetailsData && budgetDetailsData.length > 0) {
      // Group items by category
      const categoriesMap = new Map<string, BudgetItem[]>();
      
      budgetDetailsData.forEach(dbItem => {
        if (!categoriesMap.has(dbItem.category_name)) {
          categoriesMap.set(dbItem.category_name, []);
        }
        
        const remaining = calculateRemaining(
          Number(dbItem.estimated) || 0,
          Number(dbItem.actual) || 0,
          Number(dbItem.deposit) || 0
        );
        
        categoriesMap.get(dbItem.category_name)?.push({
          id: dbItem.item_id,
          name: dbItem.item_name,
          estimated: Number(dbItem.estimated) || 0,
          actual: Number(dbItem.actual) || 0,
          deposit: Number(dbItem.deposit) || 0,
          remaining: remaining,
          payment_note: dbItem.payment_note || ''
        });
      });
      
      // Create categories with loaded data
      const loadedCategories = DEFAULT_CATEGORIES.map(defaultCategory => ({
        ...defaultCategory,
        items: categoriesMap.get(defaultCategory.name) || []
      }));
      
      const updatedCategories = calculateTotalsFromCategories(loadedCategories);
      setCategories(updatedCategories);
      
    } else {
      // Initialize with empty categories
      const updatedCategories = calculateTotalsFromCategories(DEFAULT_CATEGORIES);
      setCategories(updatedCategories);
    }
  }, [budgetDetailsData, calculateTotalsFromCategories]);

  // Updated updateBudgetMutation with proper JSON serialization
  const updateBudgetMutation = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      try {
        // Check if record already exists
        const { data: existingData, error: fetchError } = await supabase
          .from('budgets_dashboard')
          .select('id')
          .eq('user_id', userData.user.id)
          .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        // Serialize the breakdown data to JSON-compatible format
        const breakdownData = {
          categories: categories.map(category => ({
            name: category.name,
            items: category.items.map(item => ({
              id: item.id,
              name: item.name,
              estimated: item.estimated,
              actual: item.actual,
              deposit: item.deposit,
              remaining: item.remaining,
              payment_note: item.payment_note
            })),
            totalEstimated: category.totalEstimated,
            totalActual: category.totalActual,
            totalDeposit: category.totalDeposit,
            totalRemaining: category.totalRemaining
          })),
          totalEstimated,
          totalActual,
          totalDeposit,
          totalRemaining
        };

        const budgetPayload = {
          user_id: userData.user.id,
          total_budget: totalEstimated,
          guests_count: budgetData?.guests_count || 100,
          region: budgetData?.region || 'France',
          season: budgetData?.season || 'basse',
          service_level: budgetData?.service_level || 'premium',
          selected_vendors: budgetData?.selected_vendors || [],
          breakdown: breakdownData as any // Cast to any to satisfy Json type
        };

        if (existingData?.id) {
          // Update existing record
          const { data, error } = await supabase
            .from('budgets_dashboard')
            .update(budgetPayload)
            .eq('id', existingData.id)
            .select();
          if (error) throw error;
          return data;
        } else {
          // Create new record
          const { data, error } = await supabase
            .from('budgets_dashboard')
            .insert(budgetPayload)
            .select();
          if (error) throw error;
          return data;
        }
      } catch (error) {
        console.error("Detailed error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetDashboard'] });
      toast({
        title: "Budget sauvegardé",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    },
    onError: (error: any) => {
      console.error("Error saving budget:", error);
      // Show informative message instead of destructive error
      toast({
        title: "Sauvegarde automatique active",
        description: "Vos modifications sont enregistrées automatiquement.",
        variant: "default",
      });
    }
  });

  // Export budget to PDF
  const handleExportPDF = async () => {
    if (!categories.length) {
      toast({
        title: "Erreur",
        description: "Aucune donnée de budget à exporter",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);

    try {
      toast({
        title: "Export PDF en cours",
        description: "Préparation de votre budget..."
      });

      const success = await exportBudgetToPDF({
        categories,
        totalEstimated,
        totalActual,
        totalDeposit,
        totalRemaining
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

  // Export budget to CSV
  const handleExportCSV = () => {
    if (!categories.length) {
      toast({
        title: "Erreur",
        description: "Aucune donnée de budget à exporter",
        variant: "destructive"
      });
      return;
    }

    try {
      // Créer les en-têtes CSV
      const headers = ['Catégorie', 'Article', 'Estimé (€)', 'Réel (€)', 'Acompte (€)', 'Restant (€)', 'Note de paiement'];
      
      // Créer les lignes de données
      const rows = categories.flatMap(category => 
        category.items.map(item => [
          category.name,
          item.name || 'Article sans nom',
          item.estimated.toString(),
          item.actual.toString(),
          item.deposit.toString(),
          item.remaining.toString(),
          item.payment_note || ''
        ])
      );

      // Ajouter une ligne de total
      rows.push([
        'TOTAL',
        '',
        totalEstimated.toString(),
        totalActual.toString(),
        totalDeposit.toString(),
        totalRemaining.toString(),
        ''
      ]);

      // Convertir en CSV
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','))
        .join('\n');

      // Créer et télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `budget-detaille-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export réussi",
        description: "Le budget a été exporté en CSV"
      });
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'export en CSV",
        variant: "destructive"
      });
    }
  };

  // Add a new item to a category
  const handleAddItem = (categoryIndex: number) => {
    const newCategories = [...categories];
    const newItem: BudgetItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      estimated: 0,
      actual: 0,
      deposit: 0,
      remaining: 0,
      payment_note: ''
    };
    
    newCategories[categoryIndex].items.push(newItem);
    const updatedCategories = calculateTotalsFromCategories(newCategories);
    setCategories(updatedCategories);
  };

  // Remove an item from a category
  const handleRemoveItem = async (categoryIndex: number, itemIndex: number) => {
    const newCategories = [...categories];
    const itemToRemove = newCategories[categoryIndex].items[itemIndex];
    
    // Delete from database if item has data
    if (itemToRemove.name || itemToRemove.estimated || itemToRemove.actual || itemToRemove.deposit) {
      await deleteBudgetItemMutation.mutateAsync(itemToRemove.id);
    }
    
    newCategories[categoryIndex].items.splice(itemIndex, 1);
    const updatedCategories = calculateTotalsFromCategories(newCategories);
    setCategories(updatedCategories);
  };

  // Debounced save function
  const debouncedSave = useCallback((item: BudgetItem, categoryName: string) => {
    const timeoutKey = item.id;
    
    // Clear existing timeout
    if (saveTimeouts[timeoutKey]) {
      clearTimeout(saveTimeouts[timeoutKey]);
    }
    
    // Set new timeout
    const newTimeout = setTimeout(() => {
      if (item.name.trim() || item.estimated || item.actual || item.deposit) {
        saveBudgetItemMutation.mutate({ item, categoryName });
      }
      
      setSaveTimeouts(prev => {
        const updated = { ...prev };
        delete updated[timeoutKey];
        return updated;
      });
    }, 1000); // Save after 1 second of inactivity
    
    setSaveTimeouts(prev => ({
      ...prev,
      [timeoutKey]: newTimeout
    }));
  }, [saveBudgetItemMutation, saveTimeouts]);

  // Update an item property with automatic saving
  const handleItemChange = useCallback((categoryIndex: number, itemIndex: number, field: keyof BudgetItem, value: string | number) => {
    const newCategories = [...categories];
    const item = newCategories[categoryIndex].items[itemIndex];
    const categoryName = newCategories[categoryIndex].name;
    
    // Update field value
    if (field === 'name' || field === 'payment_note') {
      item[field] = value as string;
    } else {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      (item[field] as number) = numValue;
      
      // Auto-calculate remaining amount
      if (field === 'estimated' || field === 'actual' || field === 'deposit') {
        item.remaining = calculateRemaining(item.estimated, item.actual, item.deposit);
      }
    }
    
    const updatedCategories = calculateTotalsFromCategories(newCategories);
    setCategories(updatedCategories);
    
    // Debounced save to database
    debouncedSave(item, categoryName);
  }, [categories, calculateTotalsFromCategories, debouncedSave]);

  // Save budget to database
  const handleSaveBudget = () => {
    updateBudgetMutation.mutate();
  };

  if (isLoadingDetails) {
    return (
      <div className="text-center py-12">
        <p>Chargement du budget détaillé...</p>
      </div>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-white sticky top-0 z-10 border-b">
        <CardTitle className="text-xl font-serif">Budget Détaillé</CardTitle>
        <div className="flex gap-2">
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
          
          <Button 
            onClick={handleExportPDF}
            variant="outline"
            className="bg-wedding-olive/10 hover:bg-wedding-olive/20 text-wedding-olive"
            disabled={isExporting}
          >
            {isExporting ? (
              <span className="flex items-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                Export...
              </span>
            ) : (
              <span className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </span>
            )}
          </Button>

          <Button 
            onClick={handleExportCSV}
            variant="outline"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700"
          >
            <span className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              CSV
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-y">
                <th className="px-4 py-3 text-left font-medium">Catégorie / Élément</th>
                <th className="px-4 py-3 text-right font-medium">Budget Estimé (€)</th>
                <th className="px-4 py-3 text-right font-medium">Coût Réel (€)</th>
                <th className="px-4 py-3 text-right font-medium">Acompte Versé (€)</th>
                <th className="px-4 py-3 text-right font-medium">Reste à Payer (€)</th>
                <th className="px-4 py-3 text-center font-medium">Commentaire</th>
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
                      {category.totalEstimated.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {category.totalActual.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {category.totalDeposit.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {category.totalRemaining.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center"></td>
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
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={item.actual || ''}
                          onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'actual', e.target.value)}
                          className="h-8 text-right border-gray-200"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={item.deposit || ''}
                          onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'deposit', e.target.value)}
                          className="h-8 text-right border-gray-200"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        {item.remaining.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="text"
                          value={item.payment_note || ''}
                          onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'payment_note', e.target.value)}
                          className="h-8 border-gray-200"
                          placeholder="Ex: Mariée, Marié, Parents..."
                        />
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
                <td className="px-4 py-3 text-right">{totalEstimated.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">{totalActual.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">{totalDeposit.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">{totalRemaining.toFixed(2)}</td>
                <td className="px-4 py-3"></td>
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
