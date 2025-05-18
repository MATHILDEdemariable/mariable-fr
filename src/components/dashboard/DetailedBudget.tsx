
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

// Types for the budget data
interface BudgetItem {
  id: string;
  category: string;
  subCategory: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
  comment: string;
  deposit: number;
  depositDate: Date | null;
  payer: string;
  remaining: number;
}

interface BudgetCategory {
  name: string;
  items: BudgetItem[];
}

const INITIAL_CATEGORIES: BudgetCategory[] = [
  {
    name: "Lieu de réception",
    items: [
      { id: "lieu-1", category: "Lieu de réception", subCategory: "Location salle", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "lieu-2", category: "Lieu de réception", subCategory: "Options (logement/ménage)", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "lieu-3", category: "Lieu de réception", subCategory: "Mobilier supplémentaire", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Coordination Jour-J",
    items: [
      { id: "coord-1", category: "Coordination Jour-J", subCategory: "Wedding planner", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "coord-2", category: "Coordination Jour-J", subCategory: "Assistants", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Traiteur",
    items: [
      { id: "traiteur-1", category: "Traiteur", subCategory: "Cocktail", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "traiteur-2", category: "Traiteur", subCategory: "Dîner (adultes)", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "traiteur-3", category: "Traiteur", subCategory: "Dîner (enfants)", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "traiteur-4", category: "Traiteur", subCategory: "Dessert/Gâteau", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "traiteur-5", category: "Traiteur", subCategory: "Brunch", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "traiteur-6", category: "Traiteur", subCategory: "Personnel de service", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Boissons",
    items: [
      { id: "boissons-1", category: "Boissons", subCategory: "Vin", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "boissons-2", category: "Boissons", subCategory: "Champagne", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "boissons-3", category: "Boissons", subCategory: "Alcools forts", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "boissons-4", category: "Boissons", subCategory: "Softs", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "boissons-5", category: "Boissons", subCategory: "Bar et service", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Décoration",
    items: [
      { id: "deco-1", category: "Décoration", subCategory: "Fleurs", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "deco-2", category: "Décoration", subCategory: "Bougies / Photophores", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "deco-3", category: "Décoration", subCategory: "Éclairage", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "deco-4", category: "Décoration", subCategory: "Plan de table", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "deco-5", category: "Décoration", subCategory: "Décoration de table", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Papeterie",
    items: [
      { id: "papeterie-1", category: "Papeterie", subCategory: "Faire-parts", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "papeterie-2", category: "Papeterie", subCategory: "Menu", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "papeterie-3", category: "Papeterie", subCategory: "Cartes de remerciement", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Musique",
    items: [
      { id: "musique-1", category: "Musique", subCategory: "DJ", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "musique-2", category: "Musique", subCategory: "Sonorisation", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "musique-3", category: "Musique", subCategory: "Groupe live", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "musique-4", category: "Musique", subCategory: "Cérémonie", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Souvenirs & cadeaux invités",
    items: [
      { id: "souvenirs-1", category: "Souvenirs & cadeaux invités", subCategory: "Cadeaux invités", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "souvenirs-2", category: "Souvenirs & cadeaux invités", subCategory: "Témoins / Parents", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Animations",
    items: [
      { id: "animations-1", category: "Animations", subCategory: "Bar à bonbons", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "animations-2", category: "Animations", subCategory: "Photobooth", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "animations-3", category: "Animations", subCategory: "Bar à cigares", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "animations-4", category: "Animations", subCategory: "Autres animations", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Photo & vidéo",
    items: [
      { id: "photo-1", category: "Photo & vidéo", subCategory: "Photographe", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "photo-2", category: "Photo & vidéo", subCategory: "Vidéaste", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "photo-3", category: "Photo & vidéo", subCategory: "Albums / Tirages", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Tenues",
    items: [
      { id: "tenue-1", category: "Tenues", subCategory: "Mariée (robe)", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "tenue-2", category: "Tenues", subCategory: "Marié (costume)", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "tenue-3", category: "Tenues", subCategory: "Accessoires mariée", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "tenue-4", category: "Tenues", subCategory: "Accessoires marié", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "tenue-5", category: "Tenues", subCategory: "Enfants", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "tenue-6", category: "Tenues", subCategory: "Coiffure & maquillage", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Alliances & accessoires",
    items: [
      { id: "alliances-1", category: "Alliances & accessoires", subCategory: "Alliances", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "alliances-2", category: "Alliances & accessoires", subCategory: "Bijoux", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Cérémonie",
    items: [
      { id: "ceremonie-1", category: "Cérémonie", subCategory: "Religieuse", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "ceremonie-2", category: "Cérémonie", subCategory: "Civile", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "ceremonie-3", category: "Cérémonie", subCategory: "Officiant", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "ceremonie-4", category: "Cérémonie", subCategory: "Décoration", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Transport & hébergement",
    items: [
      { id: "transport-1", category: "Transport & hébergement", subCategory: "Voiture des mariés", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "transport-2", category: "Transport & hébergement", subCategory: "Invités", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "transport-3", category: "Transport & hébergement", subCategory: "Hébergement mariés", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "transport-4", category: "Transport & hébergement", subCategory: "Hébergement invités", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  },
  {
    name: "Autres dépenses",
    items: [
      { id: "autres-1", category: "Autres dépenses", subCategory: "Voyage de noces", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "autres-2", category: "Autres dépenses", subCategory: "Assurance mariage", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "autres-3", category: "Autres dépenses", subCategory: "Imprévus", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 },
      { id: "autres-4", category: "Autres dépenses", subCategory: "Divers", description: "", estimatedCost: 0, actualCost: 0, comment: "", deposit: 0, depositDate: null, payer: "", remaining: 0 }
    ]
  }
];

const DetailedBudget: React.FC = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>(INITIAL_CATEGORIES);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newItemCategory, setNewItemCategory] = useState<string>("");
  const { toast } = useToast();
  
  // Get the estimated and actual total budget
  const getTotalEstimated = () => {
    return categories.reduce((total, category) => 
      total + category.items.reduce((catTotal, item) => catTotal + item.estimatedCost, 0), 0);
  };
  
  const getTotalActual = () => {
    return categories.reduce((total, category) => 
      total + category.items.reduce((catTotal, item) => catTotal + item.actualCost, 0), 0);
  };

  const getTotalDeposit = () => {
    return categories.reduce((total, category) => 
      total + category.items.reduce((catTotal, item) => catTotal + item.deposit, 0), 0);
  };

  const getTotalRemaining = () => {
    return categories.reduce((total, category) => 
      total + category.items.reduce((catTotal, item) => catTotal + item.remaining, 0), 0);
  };
  
  const getCategoryTotal = (categoryName: string, field: 'estimatedCost' | 'actualCost' | 'deposit' | 'remaining') => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return 0;
    return category.items.reduce((total, item) => total + item[field], 0);
  };
  
  const handleItemChange = (id: string, field: keyof BudgetItem, value: any) => {
    setCategories(prevCategories => 
      prevCategories.map(category => ({
        ...category,
        items: category.items.map(item => {
          if (item.id === id) {
            const updatedItem = { ...item, [field]: value };
            
            // Auto-calculate remaining amount when deposit or actual cost changes
            if (field === 'deposit' || field === 'actualCost') {
              updatedItem.remaining = updatedItem.actualCost - updatedItem.deposit;
            }
            
            return updatedItem;
          }
          return item;
        })
      }))
    );
  };
  
  const handleAddItem = () => {
    if (!newItemCategory) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie",
        variant: "destructive"
      });
      return;
    }
    
    const category = categories.find(c => c.name === newItemCategory);
    if (!category) return;
    
    const newId = `${newItemCategory.toLowerCase().replace(/\s+/g, '-')}-${category.items.length + 1}`;
    
    setCategories(prevCategories => 
      prevCategories.map(c => {
        if (c.name === newItemCategory) {
          return {
            ...c,
            items: [
              ...c.items,
              { 
                id: newId, 
                category: newItemCategory, 
                subCategory: "Autre", 
                description: "", 
                estimatedCost: 0, 
                actualCost: 0, 
                comment: "", 
                deposit: 0, 
                depositDate: null, 
                payer: "", 
                remaining: 0 
              }
            ]
          };
        }
        return c;
      })
    );
    
    setNewItemCategory("");
    
    toast({
      title: "Ligne ajoutée",
      description: "Une nouvelle ligne a été ajoutée à votre budget"
    });
  };
  
  const saveBudget = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save to Supabase
        await supabase.from('detailed_budget')
          .upsert({ 
            user_id: user.id, 
            budget_data: categories,
            total_estimated: getTotalEstimated(),
            total_actual: getTotalActual(),
            updated_at: new Date()
          });
        
        toast({
          title: "Budget sauvegardé",
          description: "Vos modifications ont été enregistrées"
        });
      } else {
        toast({
          title: "Non connecté",
          description: "Connectez-vous pour sauvegarder votre budget",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive"
      });
    }
  };

  // Charger les données sauvegardées
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data } = await supabase
            .from('detailed_budget')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1);
            
          if (data && data.length > 0 && data[0].budget_data) {
            setCategories(data[0].budget_data);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    
    fetchBudgetData();
  }, []);
  
  const exportToCSV = () => {
    // Create CSV content
    let csvContent = "Category,Sub-Category,Description,Estimated Cost,Actual Cost,Comment,Deposit,Deposit Date,Payer,Remaining\n";
    
    categories.forEach(category => {
      category.items.forEach(item => {
        const row = [
          item.category,
          item.subCategory,
          item.description,
          item.estimatedCost,
          item.actualCost,
          item.comment,
          item.deposit,
          item.depositDate ? format(item.depositDate, 'yyyy-MM-dd') : '',
          item.payer,
          item.remaining
        ].map(cell => `"${cell}"`).join(',');
        
        csvContent += row + "\n";
      });
    });
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `budget-mariage-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: "Votre budget a été exporté en format CSV"
    });
  };
  
  const exportToGoogleSheets = () => {
    // This would integrate with Google Sheets API in a real implementation
    // For now we'll just simulate it with a toast
    toast({
      title: "Export vers Google Sheets",
      description: "Cette fonctionnalité sera disponible prochainement"
    });
  };
  
  return (
    <Card className="bg-wedding-cream/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-serif text-wedding-olive">Budget Détaillé</CardTitle>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span>Exporter</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exporter mon budget</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Button onClick={exportToCSV} className="w-full flex items-center justify-center gap-2 bg-wedding-olive hover:bg-wedding-olive/90">
                  <FileText className="h-4 w-4" />
                  Exporter vers Excel (CSV)
                </Button>
                <Button onClick={exportToGoogleSheets} className="w-full flex items-center justify-center gap-2 bg-wedding-olive hover:bg-wedding-olive/90">
                  <FileText className="h-4 w-4" />
                  Exporter vers Google Sheets
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button size="sm" variant="wedding" onClick={saveBudget}>
            Sauvegarder
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto">
          <Table className="w-full">
            <TableHeader className="bg-wedding-cream/20 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[220px]">Catégorie / Sous-catégorie</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Budget Estimé</TableHead>
                <TableHead className="text-right">Coût Réel</TableHead>
                <TableHead>Commentaire</TableHead>
                <TableHead className="text-right">Acompte</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payeur</TableHead>
                <TableHead className="text-right">Reste à payer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <React.Fragment key={category.name}>
                  <TableRow className="bg-wedding-olive/10">
                    <TableCell colSpan={2} className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right font-medium">
                      {getCategoryTotal(category.name, 'estimatedCost').toLocaleString('fr-FR')} €
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {getCategoryTotal(category.name, 'actualCost').toLocaleString('fr-FR')} €
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-medium">
                      {getCategoryTotal(category.name, 'deposit').toLocaleString('fr-FR')} €
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-medium">
                      {getCategoryTotal(category.name, 'remaining').toLocaleString('fr-FR')} €
                    </TableCell>
                  </TableRow>
                  
                  {category.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.subCategory}</TableCell>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="h-8 min-w-[100px]"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.estimatedCost}
                          onChange={(e) => handleItemChange(item.id, 'estimatedCost', parseFloat(e.target.value) || 0)}
                          className="h-8 w-20 text-right"
                        /> €
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.actualCost}
                          onChange={(e) => handleItemChange(item.id, 'actualCost', parseFloat(e.target.value) || 0)}
                          className="h-8 w-20 text-right"
                        /> €
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.comment}
                          onChange={(e) => handleItemChange(item.id, 'comment', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.deposit}
                          onChange={(e) => handleItemChange(item.id, 'deposit', parseFloat(e.target.value) || 0)}
                          className="h-8 w-20 text-right"
                        /> €
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 justify-start text-left font-normal w-[130px]"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {item.depositDate ? format(item.depositDate, 'dd/MM/yyyy', { locale: fr }) : <span>Sélectionner</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={item.depositDate || undefined}
                              onSelect={(date) => handleItemChange(item.id, 'depositDate', date)}
                              locale={fr}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.payer}
                          onChange={(e) => handleItemChange(item.id, 'payer', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.remaining.toLocaleString('fr-FR')} €
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
              
              <TableRow className="bg-wedding-olive/20">
                <TableCell colSpan={2} className="font-bold text-lg">TOTAL</TableCell>
                <TableCell className="text-right font-bold text-lg">
                  {getTotalEstimated().toLocaleString('fr-FR')} €
                </TableCell>
                <TableCell className="text-right font-bold text-lg">
                  {getTotalActual().toLocaleString('fr-FR')} €
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-bold">
                  {getTotalDeposit().toLocaleString('fr-FR')} €
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-bold">
                  {getTotalRemaining().toLocaleString('fr-FR')} €
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 flex items-end gap-4">
          <div className="space-y-2 flex-1">
            <div className="text-sm font-medium">Ajouter une nouvelle ligne</div>
            <div className="flex gap-2">
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Button onClick={handleAddItem} className="bg-wedding-olive hover:bg-wedding-olive/90">Ajouter</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedBudget;
