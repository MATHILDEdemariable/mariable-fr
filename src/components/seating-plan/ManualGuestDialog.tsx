import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SeatingTable } from '@/types/seating';
import { useTranslation } from 'react-i18next';

interface ManualGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  tables: SeatingTable[];
  onAdded: () => void;
}

const ManualGuestDialog = ({ open, onOpenChange, planId, tables, onAdded }: ManualGuestDialogProps) => {
  const [guestName, setGuestName] = useState('');
  const [guestType, setGuestType] = useState<'adult' | 'child' | 'vip'>('adult');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [notes, setNotes] = useState('');
  const [tableId, setTableId] = useState<string>('unassigned');
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.language?.startsWith('en') ? en : fr);

  const handleAdd = async () => {
    if (!guestName.trim()) {
      toast({ title: tr('Erreur', 'Error'), description: tr('Le nom est requis', 'Name is required'), variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('seating_assignments')
        .insert({
          seating_plan_id: planId,
          table_id: tableId === 'unassigned' ? null : tableId,
          guest_name: guestName,
          guest_type: guestType,
          dietary_restrictions: dietaryRestrictions || null,
          notes: notes || null
        });

      if (error) throw error;

      toast({ title: tr('Invité ajouté', 'Guest added') });
      onAdded();
      onOpenChange(false);

      // Reset form
      setGuestName('');
      setGuestType('adult');
      setDietaryRestrictions('');
      setNotes('');
      setTableId('unassigned');
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
          <DialogTitle>{tr('Ajouter un invité manuellement', 'Add a guest manually')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="guestName">{tr("Nom de l'invité *", 'Guest name *')}</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder={tr('Prénom Nom', 'First Last')}
            />
          </div>

          <div>
            <Label htmlFor="guestType">Type</Label>
            <Select value={guestType} onValueChange={(v) => setGuestType(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adult">{tr('Adulte', 'Adult')}</SelectItem>
                <SelectItem value="child">{tr('Enfant', 'Child')}</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="table">{tr('Table (optionnel)', 'Table (optional)')}</Label>
            <Select value={tableId} onValueChange={setTableId}>
              <SelectTrigger>
                <SelectValue placeholder={tr('Non assigné', 'Unassigned')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">{tr('Non assigné', 'Unassigned')}</SelectItem>
                {tables.map(table => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.table_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dietary">{tr('Restrictions alimentaires', 'Dietary requirements')}</Label>
            <Textarea
              id="dietary"
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
              placeholder={tr('Ex : végétarien, allergie aux fruits de mer...', 'e.g. Vegetarian, shellfish allergy...')}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={tr('Notes personnelles...', 'Personal notes...')}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tr('Annuler', 'Cancel')}
          </Button>
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? tr('Ajout...', 'Adding...') : tr('Ajouter', 'Add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualGuestDialog;
