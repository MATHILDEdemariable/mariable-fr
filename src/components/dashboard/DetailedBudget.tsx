import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Save, Download, MessageSquare } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { exportBudgetToPDF } from '@/services/budgetExportService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Type for budget category
interface BudgetItem {
  id: string;
  name: string;
  estimated: number;
  actual: number;
  deposit: number;
  remaining: number;
  who_pays: string;
  comment: string;
}

interface BudgetCategory {
  name: string;
  items: BudgetItem[];
  totalEstimated: number;
  totalActual: number;
  totalDeposit: number;
  totalRemaining: number;
}

// Who pays options - removed empty string option to fix Select error
const WHO_PAYS_OPTIONS = [
  { value: 'marie_1', label: 'Marié·e 1' },
  { value: 'marie_2', label: 'Marié·e 2' },
  { value: 'famille_marie_1', label: 'Famille Marié·e 1' },
  { value: 'famille_marie_2', label: 'Famille Marié·e 2' },
  { value: 'partage', label: 'Partagé' },
  { value: 'autre', label: 'Autre' }
];

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
  const [isExporting, setIsExporting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  
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
        throw error;
      }
      
      return data;
    }
  });

  // Initialize categories once budget data is loaded
  useEffect(() => {
    if (budgetData?.breakdown) {
      try {
        const breakdownData = typeof budgetData.breakdown === 'string' 
          ? JSON.parse(budgetData.breakdown) 
          : budgetData.breakdown;

        if (breakdownData && breakdownData.categories) {
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
              remaining: typeof item.remaining === 'number' ? item.remaining : 0,
              who_pays: typeof item.who_pays === 'string' ? item.who_pays : '',
              comment: typeof item.comment === 'string' ? item.comment : ''
            })) : []
          })) : DEFAULT_CATEGORIES;
          
          setCategories(processedCategories);
          
          setTotalEstimated(typeof breakdownData.totalEstimated === 'number' ? breakdownData.totalEstimated : 0);
          setTotalActual(typeof breakdownData.totalActual === 'number' ? breakdownData.totalActual : 0);
          setTotalDeposit(typeof breakdownData.totalDeposit === 'number' ? breakdownData.totalDeposit : 0);
          setTotalRemaining(typeof breakdownData.totalRemaining === 'number' ? breakdownData.totalRemaining : 0);
        } else {
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

      const budgetPayload = {
        user_id: userData.user.id,
        total_budget: totalEstimated,
        guests_count: budgetData?.guests_count || 100,
        region: budgetData?.region || 'paris',
        season: budgetData?.season || 'summer',
        service_level: budgetData?.service_level || 'standard',
        selected_vendors: budgetData?.selected_vendors || [],
        breakdown: {
          categories,
          totalEstimated,
          totalActual,
          totalDeposit,
          totalRemaining
        } as any // Cast to any to satisfy Json type requirement
      };

      console.log('Saving budget data:', budgetPayload);

      const { data, error } = await supabase
        .from('budgets_dashboard')
        .upsert(budgetPayload, {
          onConflict: 'user_id'
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Budget saved successfully:', data);
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
        description: "Impossible de sauvegarder les modifications. Vérifiez votre connexion.",
        variant: "destructive",
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
      who_pays: '',
      comment: ''
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

  // Update an item property
  const handleItemChange = (categoryIndex: number, itemIndex: number, field: keyof BudgetItem, value: string | number) => {
    const newCategories = [...categories];
    const item = newCategories[categoryIndex].items[itemIndex];
    
    if (field === 'name' || field === 'who_pays' || field === 'comment') {
      (item[field] as string) = value as string;
    } else {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      (item[field] as number) = numValue;
      
      if (field === 'estimated' || field === 'actual' || field === 'deposit') {
        item.remaining = (item.estimated > item.actual ? item.estimated : item.actual) - item.deposit;
      }
    }
    
    setCategories(newCategories);
    updateTotals(newCategories);
  };

  // Toggle comment expansion
  const toggleCommentExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedComments(newExpanded);
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
    <TooltipProvider>
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
                  Exporter en PDF
                </span>
              )}
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
                  <th className="px-4 py-3 text-center font-medium">Qui paye ?</th>
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
                      <td className="px-4 py-2 text-center">-</td>
                      <td className="px-4 py-2 text-center">-</td>
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
                        <td className="px-4 py-2">
                          <Select
                            value={item.who_pays || ''}
                            onValueChange={(value) => handleItemChange(categoryIndex, itemIndex, 'who_pays', value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Qui paye ?" />
                            </SelectTrigger>
                            <SelectContent>
                              {WHO_PAYS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleCommentExpansion(item.id)}
                                  className={`h-8 w-8 p-0 ${item.comment ? 'text-wedding-olive' : 'text-gray-400'}`}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ajouter un commentaire</p>
                              </TooltipContent>
                            </Tooltip>
                            {expandedComments.has(item.id) && (
                              <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg p-2 min-w-[200px]">
                                <Textarea
                                  value={item.comment || ''}
                                  onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'comment', e.target.value)}
                                  placeholder="Commentaire (max 100 caractères)"
                                  maxLength={100}
                                  rows={2}
                                  className="text-xs"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleCommentExpansion(item.id)}
                                  className="mt-1 h-6 text-xs"
                                >
                                  Fermer
                                </Button>
                              </div>
                            )}
                          </div>
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
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default DetailedBudget;
