import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Calendar, CheckCircle2, Circle } from 'lucide-react';
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

interface AfterWeddingItem {
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
  { key: 'administratif', label: 'Administratif', items: [
    'Changer de nom sur les documents officiels',
    'Mettre à jour la carte d\'identité',
    'Modifier le passeport',
    'Changer le nom sur les comptes bancaires'
  ]},
  { key: 'remerciements', label: 'Remerciements', items: [
    'Envoyer les remerciements aux invités',
    'Remercier les prestataires',
    'Partager les photos avec la famille',
    'Écrire des avis sur les prestataires'
  ]},
  { key: 'photos', label: 'Photos & Souvenirs', items: [
    'Récupérer toutes les photos',
    'Créer un album photo',
    'Faire développer les meilleures photos',
    'Partager les photos avec les invités'
  ]},
  { key: 'materiel', label: 'Matériel & Rangement', items: [
    'Ranger la robe de mariée',
    'Nettoyer le costume',
    'Rendre le matériel loué',
    'Trier les cadeaux de mariage'
  ]},
  { key: 'voyage', label: 'Voyage de noces', items: [
    'Finaliser les préparatifs du voyage',
    'Vérifier les documents de voyage',
    'Faire les valises',
    'Organiser la garde des animaux/plantes'
  ]},
  { key: 'autres', label: 'Autres', items: [] }
];

const ApresJourJManuelle: React.FC = () => {
  const { t, i18n } = useTranslation('weddingDay');
  const [items, setItems] = useState<AfterWeddingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState<NewItemForm>({
    title: '',
    description: '',
    category: '',
    due_date: '',
  });
  const { toast } = useToast();
  const getCategoryLabel = (key: string) => t(`apresJourJ.manuelle.categories.${key}`);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('apres_jour_j_manuel')
        .select('*')
        .eq('user_id', user.id)
        .order('position');

      if (error) throw error;
      
      // Si aucune donnée, créer les tâches par défaut
      if (!data || data.length === 0) {
        await createDefaultItems(user.id);
        return;
      }
      
      setItems(data);
    } catch (error) {
      console.error('Error loading after wedding items:', error);
      toast({
        title: t('apresJourJ.manuelle.errors.title'),
        description: t('apresJourJ.manuelle.errors.load'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultItems = async (userId: string) => {
    try {
      const defaultItems = CATEGORIES.flatMap((category, categoryIndex) =>
        category.items.map((item, itemIndex) => ({
          title: item,
          description: '',
          category: category.key,
          user_id: userId,
          position: categoryIndex * 100 + itemIndex,
          completed: false
        }))
      );

      if (defaultItems.length > 0) {
        const { error } = await supabase
          .from('apres_jour_j_manuel')
          .insert(defaultItems);

        if (error) throw error;
        loadItems();
      } else {
        setItems([]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error creating default items:', error);
      setIsLoading(false);
    }
  };

  const addItem = async () => {
    if (!newItem.title || !newItem.category) {
      toast({
        title: t('apresJourJ.manuelle.errors.title'),
        description: t('apresJourJ.manuelle.errors.required'),
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const maxPosition = Math.max(...items.filter(item => item.category === newItem.category).map(item => item.position), -1);

      const { error } = await supabase
        .from('apres_jour_j_manuel')
        .insert({
          title: newItem.title,
          description: newItem.description || '',
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
        title: t('apresJourJ.manuelle.success.title'),
        description: t('apresJourJ.manuelle.success.added'),
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: t('apresJourJ.manuelle.errors.title'),
        description: t('apresJourJ.manuelle.errors.add'),
        variant: "destructive",
      });
    }
  };

  const toggleItem = async (item: AfterWeddingItem) => {
    try {
      const { error } = await supabase
        .from('apres_jour_j_manuel')
        .update({ completed: !item.completed })
        .eq('id', item.id);

      if (error) throw error;
      loadItems();
    } catch (error) {
      console.error('Error toggling item:', error);
      toast({
        title: t('apresJourJ.manuelle.errors.title'),
        description: t('apresJourJ.manuelle.errors.toggle'),
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('apres_jour_j_manuel')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      loadItems();
      
      toast({
        title: t('apresJourJ.manuelle.success.title'),
        description: t('apresJourJ.manuelle.success.deleted'),
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: t('apresJourJ.manuelle.errors.title'),
        description: t('apresJourJ.manuelle.errors.delete'),
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

  if (isLoading) {
    return <div className="text-center py-8">{t('apresJourJ.manuelle.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Progress global */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{t('apresJourJ.manuelle.overallProgress')}</h3>
            <span className="text-sm text-muted-foreground">
              {t('apresJourJ.manuelle.tasksCount', { done: items.filter(item => item.completed).length, total: items.length })}
            </span>
          </div>
          <Progress value={getOverallProgress()} className="h-3" />
          <div className="text-center mt-2 text-sm text-muted-foreground">
            {t('apresJourJ.manuelle.completedPercent', { percent: getOverallProgress() })}
          </div>
        </CardContent>
      </Card>

      {/* Bouton d'ajout */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('apresJourJ.manuelle.heading')}</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('apresJourJ.manuelle.addTask')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('apresJourJ.manuelle.addDialogTitle')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t('apresJourJ.manuelle.titleLabel')}</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder={t('apresJourJ.manuelle.titlePlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="category">{t('apresJourJ.manuelle.categoryLabel')}</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('apresJourJ.manuelle.categoryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.key} value={category.key}>
                        {getCategoryLabel(category.key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">{t('apresJourJ.manuelle.descLabel')}</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder={t('apresJourJ.manuelle.descPlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="due_date">{t('apresJourJ.manuelle.dueLabel')}</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newItem.due_date}
                  onChange={(e) => setNewItem({ ...newItem, due_date: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  {t('apresJourJ.manuelle.cancel')}
                </Button>
                <Button onClick={addItem}>
                  {t('apresJourJ.manuelle.addBtn')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>


      {/* Liste par catégorie */}
      {CATEGORIES.map((category) => {
        const categoryItems = items.filter(item => item.category === category.key);
        if (categoryItems.length === 0) return null;

        return (
          <Card key={category.key}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{getCategoryLabel(category.key)}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {categoryItems.filter(item => item.completed).length} / {categoryItems.length}
                  </Badge>
                  <Progress value={getProgressByCategory(category.key)} className="w-20 h-2" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-3 border rounded-lg">
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
                          <p className="text-sm mt-1 text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                        {item.due_date && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.due_date).toLocaleDateString(i18n.language.startsWith('en') ? 'en-US' : 'fr-FR')}
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
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {items.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Votre checklist après le mariage sera créée automatiquement.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApresJourJManuelle;