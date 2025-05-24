import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Download, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BudgetItem {
  id: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
  category: string;
}

interface BudgetCategory {
  name: string;
  items: BudgetItem[];
}

const Budget: React.FC = () => {
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      name: "Lieu de réception",
      items: [
        { id: "1", name: "Location salle", estimatedCost: 3000, actualCost: 0, category: "Lieu de réception" },
        { id: "2", name: "Décoration", estimatedCost: 800, actualCost: 0, category: "Lieu de réception" }
      ]
    },
    {
      name: "Restauration",
      items: [
        { id: "3", name: "Traiteur", estimatedCost: 4000, actualCost: 0, category: "Restauration" },
        { id: "4", name: "Boissons", estimatedCost: 1200, actualCost: 0, category: "Restauration" },
        { id: "5", name: "Gâteau de mariage", estimatedCost: 300, actualCost: 0, category: "Restauration" }
      ]
    },
    {
      name: "Vêtements",
      items: [
        { id: "6", name: "Robe de mariée", estimatedCost: 1500, actualCost: 0, category: "Vêtements" },
        { id: "7", name: "Costume marié", estimatedCost: 800, actualCost: 0, category: "Vêtements" }
      ]
    },
    {
      name: "Photographie",
      items: [
        { id: "8", name: "Photographe", estimatedCost: 2000, actualCost: 0, category: "Photographie" },
        { id: "9", name: "Vidéaste", estimatedCost: 1500, actualCost: 0, category: "Photographie" }
      ]
    },
    {
      name: "Musique",
      items: [
        { id: "10", name: "DJ/Groupe", estimatedCost: 1000, actualCost: 0, category: "Musique" }
      ]
    },
    {
      name: "Fleurs",
      items: [
        { id: "11", name: "Bouquet mariée", estimatedCost: 200, actualCost: 0, category: "Fleurs" },
        { id: "12", name: "Centres de table", estimatedCost: 400, actualCost: 0, category: "Fleurs" }
      ]
    },
    {
      name: "Transport",
      items: [
        { id: "13", name: "Voiture mariés", estimatedCost: 300, actualCost: 0, category: "Transport" }
      ]
    },
    {
      name: "Divers",
      items: [
        { id: "14", name: "Alliances", estimatedCost: 1000, actualCost: 0, category: "Divers" },
        { id: "15", name: "Faire-part", estimatedCost: 200, actualCost: 0, category: "Divers" }
      ]
    }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('budgets_dashboard')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setTotalBudget(data.total_budget || 0);
        if (data.breakdown) {
          // Handle JSON parsing safely
          const breakdown = typeof data.breakdown === 'string' 
            ? JSON.parse(data.breakdown)
            : data.breakdown;
          if (breakdown.categories) {
            setCategories(breakdown.categories);
          }
        }
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
    }
  };

  const saveBudgetData = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const budgetData = {
        user_id: userData.user.id,
        total_budget: totalBudget,
        breakdown: JSON.stringify({ categories }),
        updated_at: new Date().toISOString(),
        // Add required fields with default values
        guests_count: 100,
        region: 'France',
        season: 'Printemps',
        selected_vendors: [],
        service_level: 'Standard'
      };

      const { error } = await supabase
        .from('budgets_dashboard')
        .upsert(budgetData);

      if (error) throw error;

      toast({
        title: "Budget sauvegardé",
        description: "Vos données ont été sauvegardées avec succès."
      });
    } catch (error) {
      console.error('Error saving budget data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le budget.",
        variant: "destructive"
      });
    }
  };

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Export PDF en cours",
        description: "Préparation de votre budget..."
      });

      // Import and use the budget export service
      const { exportBudgetToPDF } = await import('@/services/budgetExportService');
      
      const success = await exportBudgetToPDF({
        categories,
        totalBudget,
        coupleNames: "Votre mariage"
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
    }
  };

  const updateItemCost = (categoryIndex: number, itemIndex: number, field: 'estimatedCost' | 'actualCost', value: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].items[itemIndex][field] = value;
    setCategories(newCategories);
  };

  const addItem = (categoryIndex: number) => {
    const newCategories = [...categories];
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      name: "Nouveau poste",
      estimatedCost: 0,
      actualCost: 0,
      category: newCategories[categoryIndex].name
    };
    newCategories[categoryIndex].items.push(newItem);
    setCategories(newCategories);
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].items.splice(itemIndex, 1);
    setCategories(newCategories);
  };

  const updateItemName = (categoryIndex: number, itemIndex: number, name: string) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].items[itemIndex].name = name;
    setCategories(newCategories);
  };

  const getTotalEstimated = () => {
    return categories.reduce((total, category) => {
      return total + category.items.reduce((catTotal, item) => catTotal + item.estimatedCost, 0);
    }, 0);
  };

  const getTotalActual = () => {
    return categories.reduce((total, category) => {
      return total + category.items.reduce((catTotal, item) => catTotal + item.actualCost, 0);
    }, 0);
  };

  const getCategoryTotal = (category: BudgetCategory, field: 'estimatedCost' | 'actualCost') => {
    return category.items.reduce((total, item) => total + item[field], 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif text-wedding-olive">
          Calculatrice de budget mariage
        </h1>
        <p className="text-lg text-muted-foreground">
          Estimez le budget de votre mariage en quelques étapes
        </p>
      </div>

      {/* Budget Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-wedding-olive">Budget total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="total-budget">Budget prévu (€)</Label>
              <Input
                id="total-budget"
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="text-lg font-semibold"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-wedding-cream/20 rounded-lg">
                <h3 className="font-medium text-wedding-olive">Budget prévu</h3>
                <p className="text-2xl font-bold">{totalBudget.toLocaleString()}€</p>
              </div>
              <div className="p-4 bg-wedding-cream/20 rounded-lg">
                <h3 className="font-medium text-wedding-olive">Estimé</h3>
                <p className="text-2xl font-bold">{getTotalEstimated().toLocaleString()}€</p>
              </div>
              <div className="p-4 bg-wedding-cream/20 rounded-lg">
                <h3 className="font-medium text-wedding-olive">Dépensé</h3>
                <p className="text-2xl font-bold">{getTotalActual().toLocaleString()}€</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <div className="space-y-4">
        {categories.map((category, categoryIndex) => (
          <Card key={category.name}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-wedding-olive">{category.name}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Estimé: {getCategoryTotal(category, 'estimatedCost').toLocaleString()}€ | 
                  Dépensé: {getCategoryTotal(category, 'actualCost').toLocaleString()}€
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-3 border rounded-lg">
                    <Input
                      value={item.name}
                      onChange={(e) => updateItemName(categoryIndex, itemIndex, e.target.value)}
                      className="font-medium"
                    />
                    <div>
                      <Label className="text-xs text-muted-foreground">Estimé (€)</Label>
                      <Input
                        type="number"
                        value={item.estimatedCost}
                        onChange={(e) => updateItemCost(categoryIndex, itemIndex, 'estimatedCost', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Dépensé (€)</Label>
                      <Input
                        type="number"
                        value={item.actualCost}
                        onChange={(e) => updateItemCost(categoryIndex, itemIndex, 'actualCost', Number(e.target.value))}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(categoryIndex, itemIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => addItem(categoryIndex)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un poste
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleExportPDF}
          className="bg-wedding-olive hover:bg-wedding-olive/80 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exporter en PDF
        </Button>
      </div>
    </div>
  );
};

export default Budget;
