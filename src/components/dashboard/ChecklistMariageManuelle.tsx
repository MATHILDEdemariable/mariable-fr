import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  { key: 'invites', label: 'Invités', color: 'bg-blue-500' },
  { key: 'budget', label: 'Budget', color: 'bg-green-500' },
  { key: 'lieu', label: 'Lieu', color: 'bg-purple-500' },
  { key: 'traiteur', label: 'Traiteur', color: 'bg-orange-500' },
  { key: 'image', label: 'Image', color: 'bg-pink-500' },
  { key: 'decorations', label: 'Décorations', color: 'bg-indigo-500' },
  { key: 'jour-j', label: 'Jour-J', color: 'bg-red-500' },
  { key: 'tenues', label: 'Tenues', color: 'bg-yellow-500' },
  { key: 'beaute', label: 'Mise en beauté', color: 'bg-cyan-500' },
  { key: 'autres', label: 'Autres', color: 'bg-gray-500' },
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

  const addItem = async () => {
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

      setNewItem({ title: '', description: '', category: '', due_date: '' });
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

  const getCategoryColor = (categoryKey: string) => {
    return CATEGORIES.find(cat => cat.key === categoryKey)?.color || 'bg-gray-500';
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
            <span className="text-sm text-muted-foreground">
              {items.filter(item => item.completed).length} / {items.length} tâches
            </span>
          </div>
          <Progress value={getOverallProgress()} className="h-3" />
          <div className="text-center mt-2 text-sm text-muted-foreground">
            {getOverallProgress()}% complété
          </div>
        </CardContent>
      </Card>

      {/* Bouton d'ajout */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ma check-list personnalisée</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une tâche
            </Button>
          </DialogTrigger>
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
                <Button onClick={addItem}>
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Accordéons par catégorie */}
      <Accordion type="multiple" className="w-full">
        {CATEGORIES.map((category) => {
          const categoryItems = items.filter(item => item.category === category.key);
          if (categoryItems.length === 0) return null;

          return (
            <AccordionItem key={category.key} value={category.key}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 w-full">
                  <div className={`w-4 h-4 rounded-full ${category.color}`} />
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.label}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {categoryItems.filter(item => item.completed).length} / {categoryItems.length}
                        </Badge>
                        <Progress value={getProgressByCategory(category.key)} className="w-20 h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-4">
                  {categoryItems.map((item) => (
                    <Card key={item.id} className="border-l-4" style={{ borderLeftColor: getCategoryColor(category.key) }}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              onClick={() => toggleItem(item)}
                              className="mt-1 text-primary hover:text-primary/80"
                            >
                              {item.completed ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>
                            <div className="flex-1">
                              <h4 className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {item.title}
                              </h4>
                              {item.description && (
                                <p className={`text-sm mt-1 ${item.completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                                  {item.description}
                                </p>
                              )}
                              {item.due_date && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(item.due_date).toLocaleDateString('fr-FR')}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem(item.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

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