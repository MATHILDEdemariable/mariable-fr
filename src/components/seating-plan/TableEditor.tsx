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
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.language?.startsWith('en') ? en : fr);

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
      toast({ title: tr('Erreur', 'Error'), description: tr('Le nom de la table est requis', 'Table name is required'), variant: 'destructive' });
      return;
    }

    const capacityNum = parseInt(capacity);
    if (capacityNum < 2 || capacityNum > 20) {
      toast({ title: tr('Erreur', 'Error'), description: tr('La capacité doit être entre 2 et 20', 'Capacity must be between 2 and 20'), variant: 'destructive' });
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
        toast({ title: tr('Table mise à jour', 'Table updated') });
      } else {
        const { error } = await supabase
          .from('seating_tables')
          .insert({
            seating_plan_id: planId,
            table_name: tableName,
            table_number: parseInt(tableNumber),
            capacity: capacityNum,
            shape,
            color,
            // Nouvelle table placée au centre de la vue visuelle
            position_x: 420,
            position_y: 300
          });

        if (error) throw error;
        toast({ title: tr('Table créée', 'Table created') });
      }

      onSaved();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: tr('Erreur', 'Error'), description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{table ? tr('Modifier la table', 'Edit table') : tr('Nouvelle table', 'New table')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="tableName">{tr('Nom de la table *', 'Table name *')}</Label>
            <Input
              id="tableName"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder={tr('Ex : Table des mariés, Table 1...', 'e.g. Head table, Table 1...')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tableNumber">{tr('Numéro', 'Number')}</Label>
              <Input
                id="tableNumber"
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="capacity">{tr('Capacité *', 'Capacity *')}</Label>
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
            <Label htmlFor="shape">{tr('Forme', 'Shape')}</Label>
            <Select value={shape} onValueChange={(v) => setShape(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round">{tr('Ronde', 'Round')}</SelectItem>
                <SelectItem value="rectangle">Rectangle</SelectItem>
                <SelectItem value="oval">{tr('Ovale', 'Oval')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="color">{tr('Couleur', 'Colour')}</Label>
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
            {tr('Annuler', 'Cancel')}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? tr('Enregistrement...', 'Saving...') : tr('Enregistrer', 'Save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableEditor;
