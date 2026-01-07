import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Guest {
  id: string;
  guest_first_name: string | null;
  guest_last_name: string | null;
  rsvp_status: string | null;
}

interface ImportGuestListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  onImported: () => void;
}

const ImportGuestListDialog = ({ open, onOpenChange, planId, onImported }: ImportGuestListDialogProps) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (open) {
      loadGuests();
    }
  }, [open]);

  const loadGuests = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('wedding_guest_list')
        .select('id, guest_first_name, guest_last_name, rsvp_status')
        .eq('user_id', user.id);

      if (error) throw error;
      setGuests(data || []);
      
      const confirmed = new Set(
        (data || [])
          .filter(g => g.rsvp_status === 'confirmed' || g.rsvp_status === 'oui')
          .map(g => g.id)
      );
      setSelectedGuests(confirmed);
    } catch (error) {
      console.error('Erreur chargement liste invités:', error);
      toast({ title: 'Erreur', description: 'Impossible de charger la liste des invités', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleGuest = (id: string) => {
    const newSelected = new Set(selectedGuests);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedGuests(newSelected);
  };

  const toggleAll = () => {
    if (selectedGuests.size === guests.length) setSelectedGuests(new Set());
    else setSelectedGuests(new Set(guests.map(g => g.id)));
  };

  const handleImport = async () => {
    if (selectedGuests.size === 0) {
      toast({ title: 'Aucun invité sélectionné', description: 'Veuillez sélectionner au moins un invité', variant: 'destructive' });
      return;
    }
    setImporting(true);
    try {
      const selectedGuestsList = guests.filter(g => selectedGuests.has(g.id));
      const { error } = await supabase.from('seating_assignments').insert(
        selectedGuestsList.map(guest => ({
          seating_plan_id: planId,
          guest_name: `${guest.guest_first_name || ''} ${guest.guest_last_name || ''}`.trim(),
          guest_type: 'invite',
          table_id: null
        }))
      );
      if (error) throw error;
      toast({ title: 'Import réussi', description: `${selectedGuestsList.length} invité(s) importé(s)` });
      onImported();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur import:', error);
      toast({ title: 'Erreur', description: 'Impossible d\'importer les invités', variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Importer liste manuelle</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : guests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground"><Users className="h-12 w-12 mx-auto mb-3 opacity-50" /><p>Aucun invité dans votre liste</p></div>
        ) : (
          <>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">{selectedGuests.size} sur {guests.length}</span>
              <Button variant="ghost" size="sm" onClick={toggleAll}>{selectedGuests.size === guests.length ? 'Tout désélectionner' : 'Tout sélectionner'}</Button>
            </div>
            <ScrollArea className="h-64">
              <div className="space-y-1">
                {guests.map(guest => (
                  <div key={guest.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 cursor-pointer" onClick={() => toggleGuest(guest.id)}>
                    <Checkbox checked={selectedGuests.has(guest.id)} onCheckedChange={() => toggleGuest(guest.id)} />
                    <p className="font-medium text-sm">{guest.guest_first_name} {guest.guest_last_name}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleImport} disabled={importing || selectedGuests.size === 0} className="bg-editorial-noir hover:bg-editorial-noir/80">
            {importing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Importer ({selectedGuests.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportGuestListDialog;
