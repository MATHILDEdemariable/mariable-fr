import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SeatingTable } from '@/types/seating';

interface TableEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: SeatingTable | null;
  planId: string;
  onSaved: () => void;
}

const TableEditor = ({ open, onOpenChange, table, planId, onSaved }: TableEditorProps) => {
  const [tableName, setTableName] = useState('');
  const [tableNumber, setTableNumber] = useState('1');
  const [capacity, setCapacity] = useState('8');
  const [shape, setShape] = useState<'round' | 'rectangle' | 'oval'>('round');
  const [color, setColor] = useState('#8B7355');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (table) {
      setTableName(table.table_name);
      setTableNumber(table.table_number.toString());
      setCapacity(table.capacity.toString());
      setShape(table.shape);
      setColor(table.color);
    } else {
      setTableName('');
      setTableNumber('1');
      setCapacity('8');
      setShape('round');
      setColor('#8B7355');
    }
  }, [table, open]);

  const handleSave = async () => {
    if (!tableName.trim()) {
      toast({ title: 'Erreur', description: 'Le nom de la table est requis', variant: 'destructive' });
      return;
    }

    const capacityNum = parseInt(capacity);
    if (capacityNum < 2 || capacityNum > 20) {
      toast({ title: 'Erreur', description: 'La capacité doit être entre 2 et 20', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      if (table) {
        const { error } = await supabase
          .from('seating_tables')
          .update({
            table_name: tableName,
            table_number: parseInt(tableNumber),
            capacity: capacityNum,
            shape,
            color
          })
          .eq('id', table.id);

        if (error) throw error;
        toast({ title: 'Table mise à jour' });
      } else {
        const { error } = await supabase
          .from('seating_tables')
          .insert({
            seating_plan_id: planId,
            table_name: tableName,
            table_number: parseInt(tableNumber),
            capacity: capacityNum,
            shape,
            color
          });

        if (error) throw error;
        toast({ title: 'Table créée' });
      }

      onSaved();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{table ? 'Modifier la table' : 'Nouvelle table'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="tableName">Nom de la table *</Label>
            <Input
              id="tableName"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Ex: Table des Mariés, Table 1..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tableNumber">Numéro</Label>
              <Input
                id="tableNumber"
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacité *</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="2"
                max="20"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="shape">Forme</Label>
            <Select value={shape} onValueChange={(v) => setShape(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round">Ronde</SelectItem>
                <SelectItem value="rectangle">Rectangle</SelectItem>
                <SelectItem value="oval">Ovale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="color">Couleur</Label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableEditor;
