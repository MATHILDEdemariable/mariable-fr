import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useWeddingScope } from '@/hooks/useWeddingScope';

interface ParsedGuest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  guest_type: 'adult' | 'child';
  notes: string;
  selected: boolean;
}

/** Ajout d'invités depuis des notes en vrac : l'IA crée les lignes, on valide avant d'enregistrer. */
const GuestBulkNotesDialog: React.FC<{ isOpen: boolean; onClose: () => void; onAdded: () => void }> = ({ isOpen, onClose, onAdded }) => {
  const { weddingId } = useWeddingScope();
  const { toast } = useToast();
  const [noteText, setNoteText] = useState('');
  const [parsedGuests, setParsedGuests] = useState<ParsedGuest[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setNoteText('');
    setParsedGuests([]);
    onClose();
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-guest-notes', { body: { noteText } });
      if (error || data?.error) throw new Error(data?.error || error?.message);
      const guests: ParsedGuest[] = (data.guests ?? []).map((g: any) => ({ ...g, selected: true }));
      if (guests.length === 0) toast({ title: 'Aucun invité trouvé dans la note' });
      setParsedGuests(guests);
    } catch (error: any) {
      console.error('❌ handleAnalyze failed:', error);
      toast({ title: 'Analyse impossible', description: error?.message, variant: 'destructive' });
    } finally {
      setAnalyzing(false);
    }
  };

  const updateGuest = (index: number, patch: Partial<ParsedGuest>) =>
    setParsedGuests((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));

  const handleSave = async () => {
    const selectedGuests = parsedGuests.filter((g) => g.selected && (g.first_name || g.last_name));
    if (selectedGuests.length === 0) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('not signed in');
      const { error } = await supabase.from('wedding_guest_list').insert(
        selectedGuests.map((g) => ({
          user_id: user.id,
          ...(weddingId ? { wedding_id: weddingId } : {}),
          guest_first_name: g.first_name || '-',
          guest_last_name: g.last_name || '-',
          guest_email: g.email || null,
          guest_phone: g.phone || null,
          guest_type: g.guest_type,
          notes: g.notes || null,
          source: 'txt',
        })) as any
      );
      if (error) throw error;
      toast({ title: `${selectedGuests.length} invité(s) ajouté(s)` });
      onAdded();
      handleClose();
    } catch (error) {
      console.error('❌ GuestBulkNotes save failed:', error);
      toast({ title: 'Enregistrement impossible', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = parsedGuests.filter((g) => g.selected).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none">
        <DialogHeader>
          <DialogTitle className="font-serif">Notes en vrac</DialogTitle>
          <DialogDescription>
            Collez vos notes, un message ou un email : l'IA crée les lignes d'invités. Vous vérifiez avant d'enregistrer.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          rows={6}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Famille Dubois : Thomas et Hélène + 2 enfants (Tom 7 ans, Léa 4 ans allergique aux fruits à coque). Julien Petit julien@email.com 0612345678 végétarien…"
          aria-label="Notes des invités"
        />
        <Button onClick={handleAnalyze} disabled={analyzing || noteText.trim().length < 2} variant="outline" className="rounded-none">
          {analyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Analyser avec l'IA
        </Button>

        {parsedGuests.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{parsedGuests.length} invité(s) détecté(s) — corrigez ou décochez si besoin.</p>
            <div className="overflow-x-auto border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="p-2" />
                    <th className="p-2 text-left">Prénom</th>
                    <th className="p-2 text-left">Nom</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Téléphone</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedGuests.map((g, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2"><Checkbox checked={g.selected} onCheckedChange={(c) => updateGuest(i, { selected: !!c })} aria-label="Garder" /></td>
                      {(['first_name', 'last_name', 'email', 'phone'] as const).map((field) => (
                        <td key={field} className="p-1">
                          <input className="w-full min-w-[90px] border border-border bg-background px-2 py-1" value={g[field]} onChange={(e) => updateGuest(i, { [field]: e.target.value })} />
                        </td>
                      ))}
                      <td className="p-1">
                        <select className="border border-border bg-background px-2 py-1" value={g.guest_type} onChange={(e) => updateGuest(i, { guest_type: e.target.value as 'adult' | 'child' })}>
                          <option value="adult">Adulte</option>
                          <option value="child">Enfant</option>
                        </select>
                      </td>
                      <td className="p-1">
                        <input className="w-full min-w-[120px] border border-border bg-background px-2 py-1" value={g.notes} onChange={(e) => updateGuest(i, { notes: e.target.value })} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button onClick={handleSave} disabled={saving || selectedCount === 0} className="w-full rounded-none">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : `Ajouter ${selectedCount} invité(s) à la liste`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GuestBulkNotesDialog;
