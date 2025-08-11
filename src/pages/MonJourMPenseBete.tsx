import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface PenseBeteItem {
  id: string;
  content: string;
  is_checked: boolean;
  position: number;
}

const MonJourMPenseBete: React.FC = () => {
  const [coordinationId, setCoordinationId] = useState<string>('');
  const [penseBeteItems, setPenseBeteItems] = useState<PenseBeteItem[]>([]);
  const [newItemContent, setNewItemContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Charger la coordination
          const { data: coordinations } = await supabase
            .from('wedding_coordination')
            .select('id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (coordinations && coordinations.length > 0) {
            setCoordinationId(coordinations[0].id);
          }

          // Charger les items du pense-bête
          const { data: items } = await supabase
            .from('pense_bete')
            .select('*')
            .eq('user_id', user.id)
            .order('position', { ascending: true });

          if (items) {
            setPenseBeteItems(items);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addItem = async () => {
    if (!newItemContent.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newPosition = penseBeteItems.length;
      
      const { data, error } = await supabase
        .from('pense_bete')
        .insert({
          user_id: user.id,
          coordination_id: coordinationId || null,
          content: newItemContent.trim(),
          position: newPosition,
          is_checked: false
        })
        .select()
        .single();

      if (error) throw error;

      setPenseBeteItems([...penseBeteItems, data]);
      setNewItemContent('');
      toast.success('Idée ajoutée !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const toggleItem = async (id: string, isChecked: boolean) => {
    try {
      const { error } = await supabase
        .from('pense_bete')
        .update({ is_checked: isChecked })
        .eq('id', id);

      if (error) throw error;

      setPenseBeteItems(items =>
        items.map(item =>
          item.id === id ? { ...item, is_checked: isChecked } : item
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pense_bete')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPenseBeteItems(items => items.filter(item => item.id !== id));
      toast.success('Idée supprimée');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <MonJourMLayout coordinationId={coordinationId}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MonJourMLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pense-bête - Mon Jour J | Mariable</title>
        <meta name="description" content="Notez toutes vos idées et pensées pour votre mariage dans votre pense-bête personnel." />
      </Helmet>

      <MonJourMLayout coordinationId={coordinationId}>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 Pense-bête personnel
              </CardTitle>
              <p className="text-muted-foreground">
                Notez ici tout ce qui vous passe par la tête concernant votre mariage. 
                Format libre, sans transformation IA.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ajouter une nouvelle idée */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Nouvelle idée, pensée, ou chose à ne pas oublier..."
                  value={newItemContent}
                  onChange={(e) => setNewItemContent(e.target.value)}
                  className="flex-1"
                  rows={2}
                />
                <Button 
                  onClick={addItem}
                  disabled={!newItemContent.trim()}
                  size="sm"
                  className="self-start"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Liste des items */}
              <div className="space-y-3">
                {penseBeteItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Aucune idée notée pour le moment.</p>
                    <p className="text-sm mt-2">Commencez par ajouter une première pensée !</p>
                  </div>
                ) : (
                  penseBeteItems.map((item) => (
                    <div 
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                        item.is_checked 
                          ? 'bg-muted/50 text-muted-foreground' 
                          : 'bg-background'
                      }`}
                    >
                      <Checkbox
                        checked={item.is_checked}
                        onCheckedChange={(checked) => 
                          toggleItem(item.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <div 
                        className={`flex-1 ${
                          item.is_checked ? 'line-through' : ''
                        }`}
                      >
                        {item.content}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {penseBeteItems.length > 0 && (
                <div className="text-sm text-muted-foreground text-center">
                  {penseBeteItems.filter(item => !item.is_checked).length} idées en attente · {' '}
                  {penseBeteItems.filter(item => item.is_checked).length} traitées
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MonJourMLayout>
    </>
  );
};

export default MonJourMPenseBete;