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

  const handleAdd = async () => {
    if (!guestName.trim()) {
      toast({ title: 'Erreur', description: 'Le nom est requis', variant: 'destructive' });
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

      toast({ title: 'Invité ajouté' });
      onAdded();
      onOpenChange(false);

      // Reset form
      setGuestName('');
      setGuestType('adult');
      setDietaryRestrictions('');
      setNotes('');
      setTableId('unassigned');
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
          <DialogTitle>Ajouter un invité manuellement</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="guestName">Nom de l'invité *</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Prénom Nom"
            />
          </div>

          <div>
            <Label htmlFor="guestType">Type</Label>
            <Select value={guestType} onValueChange={(v) => setGuestType(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adult">Adulte</SelectItem>
                <SelectItem value="child">Enfant</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="table">Table (optionnel)</Label>
            <Select value={tableId} onValueChange={setTableId}>
              <SelectTrigger>
                <SelectValue placeholder="Non assigné" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Non assigné</SelectItem>
                {tables.map(table => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.table_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dietary">Restrictions alimentaires</Label>
            <Textarea
              id="dietary"
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
              placeholder="Ex: Végétarien, allergie aux fruits de mer..."
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes personnelles..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? 'Ajout...' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualGuestDialog;
