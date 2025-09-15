import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, CheckCircle2, Circle, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ChecklistMariageShareButton from './ChecklistMariageShareButton';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  completed: boolean;
  due_date?: string;
  position: number;
}

interface NewItemForm {
  title: string;
  description: string;
  category: string;
  due_date: string;
}

const CATEGORIES = [
  { key: 'invites', label: 'Invités', color: 'from-blue-100 to-blue-50', borderColor: 'border-blue-200', badgeColor: 'bg-blue-100 text-blue-800' },
  { key: 'budget', label: 'Budget', color: 'from-green-100 to-green-50', borderColor: 'border-green-200', badgeColor: 'bg-green-100 text-green-800' },
  { key: 'lieu', label: 'Lieu', color: 'from-purple-100 to-purple-50', borderColor: 'border-purple-200', badgeColor: 'bg-purple-100 text-purple-800' },
  { key: 'traiteur', label: 'Traiteur', color: 'from-orange-100 to-orange-50', borderColor: 'border-orange-200', badgeColor: 'bg-orange-100 text-orange-800' },
  { key: 'image', label: 'Image', color: 'from-pink-100 to-pink-50', borderColor: 'border-pink-200', badgeColor: 'bg-pink-100 text-pink-800' },
  { key: 'decorations', label: 'Décorations', color: 'from-indigo-100 to-indigo-50', borderColor: 'border-indigo-200', badgeColor: 'bg-indigo-100 text-indigo-800' },
  { key: 'jour-j', label: 'Jour-J', color: 'from-red-100 to-red-50', borderColor: 'border-red-200', badgeColor: 'bg-red-100 text-red-800' },
  { key: 'tenues', label: 'Tenues', color: 'from-yellow-100 to-yellow-50', borderColor: 'border-yellow-200', badgeColor: 'bg-yellow-100 text-yellow-800' },
  { key: 'beaute', label: 'Mise en beauté', color: 'from-cyan-100 to-cyan-50', borderColor: 'border-cyan-200', badgeColor: 'bg-cyan-100 text-cyan-800' },
  { key: 'autres', label: 'Autres', color: 'from-gray-100 to-gray-50', borderColor: 'border-gray-200', badgeColor: 'bg-gray-100 text-gray-800' },
];

const ChecklistMariageManuelle: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState<NewItemForm>({
    title: '',
    description: '',
    category: '',
    due_date: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('checklist_mariage_manuel')
        .select('*')
        .eq('user_id', user.id)
        .order('position');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading checklist items:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la checklist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (categoryKey?: string) => {
    if (!newItem.title || !newItem.category) {
      toast({
        title: "Erreur",
        description: "Le titre et la catégorie sont requis",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const maxPosition = Math.max(...items.filter(item => item.category === newItem.category).map(item => item.position), -1);

      const { error } = await supabase
        .from('checklist_mariage_manuel')
        .insert({
          title: newItem.title,
          description: newItem.description || null,
          category: newItem.category,
          user_id: user.id,
          position: maxPosition + 1,
          due_date: newItem.due_date || null,
        });

      if (error) throw error;

      setNewItem({ title: '', description: '', category: categoryKey || '', due_date: '' });
      setShowAddDialog(false);
      loadItems();
      
      toast({
        title: "Succès",
        description: "Tâche ajoutée avec succès",
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = (categoryKey?: string) => {
    if (categoryKey) {
      setNewItem(prev => ({ ...prev, category: categoryKey }));
    }
    setShowAddDialog(true);
  };

  const toggleItem = async (item: ChecklistItem) => {
    try {
      const { error } = await supabase
        .from('checklist_mariage_manuel')
        .update({ completed: !item.completed })
        .eq('id', item.id);

      if (error) throw error;
      loadItems();
    } catch (error) {
      console.error('Error toggling item:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la tâche",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('checklist_mariage_manuel')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      loadItems();
      
      toast({
        title: "Succès",
        description: "Tâche supprimée",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive",
      });
    }
  };

  const getProgressByCategory = (category: string) => {
    const categoryItems = items.filter(item => item.category === category);
    if (categoryItems.length === 0) return 0;
    const completed = categoryItems.filter(item => item.completed).length;
    return Math.round((completed / categoryItems.length) * 100);
  };

  const getOverallProgress = () => {
    if (items.length === 0) return 0;
    const completed = items.filter(item => item.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  const getCategoryData = (categoryKey: string) => {
    return CATEGORIES.find(cat => cat.key === categoryKey) || CATEGORIES[9]; // fallback to 'autres'
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Progress global */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Progression globale</h3>
            <div className="flex items-center gap-2">
              <ChecklistMariageShareButton />
              <span className="text-sm text-muted-foreground">
                {items.filter(item => item.completed).length} / {items.length} tâches
              </span>
            </div>
          </div>
          <Progress value={getOverallProgress()} className="h-3" />
          <div className="text-center mt-2 text-sm text-muted-foreground">
            {getOverallProgress()}% complété
          </div>
        </CardContent>
      </Card>

      {/* Interface Post-it - Grille des catégories */}
      <h2 className="text-xl font-semibold">Ma check-list personnalisée</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => {
          const categoryItems = items.filter(item => item.category === category.key);
          const categoryData = getCategoryData(category.key);
          const completedCount = categoryItems.filter(item => item.completed).length;
          const progress = categoryItems.length > 0 ? Math.round((completedCount / categoryItems.length) * 100) : 0;

          return (
            <Card 
              key={category.key} 
              className={`relative overflow-hidden bg-gradient-to-br ${categoryData.color} ${categoryData.borderColor} border-2 hover:shadow-md transition-all duration-200`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-800">
                    {category.label}
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openAddDialog(category.key)}
                    className="h-6 w-6 p-0 rounded-full hover:bg-white/50"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs px-2 py-0.5 ${categoryData.badgeColor} border-0`}>
                    {completedCount} / {categoryItems.length}
                  </Badge>
                  {categoryItems.length > 0 && (
                    <div className="flex-1">
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-2 max-h-40 overflow-y-auto">
                {categoryItems.length === 0 ? (
                  <p className="text-xs text-gray-500 italic text-center py-4">
                    Aucune tâche
                  </p>
                ) : (
                  categoryItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-2 p-2 bg-white/40 rounded-md">
                      <button
                        onClick={() => toggleItem(item)}
                        className="mt-0.5 text-gray-600 hover:text-gray-800"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Circle className="w-3 h-3" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {item.title}
                        </p>
                        {item.due_date && (
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="w-2 h-2 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {new Date(item.due_date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                        className="h-4 w-4 p-0 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal d'ajout de tâche */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle tâche</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Titre de la tâche"
              />
            </div>
            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.key} value={category.key}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Description de la tâche"
              />
            </div>
            <div>
              <Label htmlFor="due_date">Date d'échéance</Label>
              <Input
                id="due_date"
                type="date"
                value={newItem.due_date}
                onChange={(e) => setNewItem({ ...newItem, due_date: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Annuler
              </Button>
              <Button onClick={() => addItem()}>
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {items.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Aucune tâche dans votre checklist pour le moment.
            </p>
            <p className="text-sm text-muted-foreground">
              Cliquez sur "Ajouter une tâche" pour commencer à organiser votre mariage !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChecklistMariageManuelle;