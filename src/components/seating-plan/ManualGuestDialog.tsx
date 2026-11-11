import { useEffect, useMemo, useState } from 'react';
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
import { useWeddingScope } from '@/hooks/useWeddingScope';

interface ManualGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  tables: SeatingTable[];
  onAdded: () => void;
  /** Noms déjà placés dans ce plan de table, pour éviter les doublons */
  existingGuestNames?: string[];
}

const normalizeName = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();

const ManualGuestDialog = ({ open, onOpenChange, planId, tables, onAdded, existingGuestNames = [] }: ManualGuestDialogProps) => {
  const [guestName, setGuestName] = useState('');
  const [guestType, setGuestType] = useState<'adult' | 'child' | 'vip'>('adult');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [notes, setNotes] = useState('');
  const [tableId, setTableId] = useState<string>('unassigned');
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.language?.startsWith('en') ? en : fr);
  const { scopeQuery, withWedding } = useWeddingScope();
  const [guestListNames, setGuestListNames] = useState<string[]>([]);

  // Liste d'invités (onglet Invités) chargée à l'ouverture : source unique pour éviter les doublons
  useEffect(() => {
    if (!open) return;
    scopeQuery(supabase.from('wedding_guest_list').select('guest_first_name, guest_last_name') as any)
      .then(({ data, error }: any) => {
        if (error) { console.error('❌ ManualGuestDialog: liste invités indisponible', error); return; }
        setGuestListNames((data || []).map((row: any) => `${row.guest_first_name ?? ''} ${row.guest_last_name ?? ''}`.replace(/\s-\s*$|^-\s/g, '').trim()));
      });
  }, [open, scopeQuery]);

  const normalizedInput = normalizeName(guestName);
  const isAlreadySeated = !!normalizedInput && existingGuestNames.some((name) => normalizeName(name) === normalizedInput);
  const isInGuestList = useMemo(
    () => !!normalizedInput && guestListNames.some((name) => normalizeName(name) === normalizedInput),
    [normalizedInput, guestListNames]
  );

  const handleAdd = async () => {
    if (!guestName.trim()) {
      toast({ title: tr('Erreur', 'Error'), description: tr('Le nom est requis', 'Name is required'), variant: 'destructive' });
      return;
    }

    if (isAlreadySeated) {
      toast({ title: tr('Doublon', 'Duplicate'), description: tr('Cet invité est déjà dans le plan de table.', 'This guest is already in the seating plan.'), variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      // Invité absent de la liste : on l'y ajoute aussi pour garder liste et plan synchronisés
      if (!isInGuestList) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const [firstName, ...lastNameParts] = guestName.trim().split(/\s+/);
          const { error: guestListError } = await supabase.from('wedding_guest_list').insert(withWedding({
            user_id: user.id,
            guest_first_name: firstName,
            guest_last_name: lastNameParts.join(' ') || '-',
            guest_type: guestType === 'child' ? 'child' : 'adult',
            notes: dietaryRestrictions ? `Régime : ${dietaryRestrictions}` : null,
            source: 'seating_plan',
          }) as any);
          if (guestListError) console.error('❌ ManualGuestDialog: ajout liste invités échoué', guestListError);
        }
      }

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

      toast({ title: tr('Invité ajouté', 'Guest added'), description: isInGuestList ? undefined : tr('Ajouté aussi à la liste d’invités.', 'Also added to the guest list.') });
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
