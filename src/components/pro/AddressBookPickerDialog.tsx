import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { AddressBookContact } from '@/pages/pro/CarnetAdresses';

interface AddressBookPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (contact: AddressBookContact) => Promise<boolean>;
}

/** Choisir un partenaire du carnet d'adresses pro pour l'ajouter au suivi du mariage. */
const AddressBookPickerDialog: React.FC<AddressBookPickerDialogProps> = ({ open, onOpenChange, onPick }) => {
  const [contacts, setContacts] = useState<AddressBookContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [pickedIds, setPickedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    const loadContacts = async () => {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('pro_address_book')
        .select('id, company_name, contact_name, category, email, phone, city, website, notes, prestataire_id, source')
        .order('company_name');
      if (error) console.error('❌ AddressBookPicker: chargement impossible', error);
      setContacts(data ?? []);
      setLoading(false);
    };
    loadContacts();
  }, [open]);

  const query = search.trim().toLowerCase();
  const filteredContacts = contacts.filter((c) =>
    !query || `${c.company_name} ${c.category} ${c.city ?? ''}`.toLowerCase().includes(query)
  );

  const handlePick = async (contact: AddressBookContact) => {
    if (await onPick(contact)) setPickedIds((prev) => new Set(prev).add(contact.id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-none">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-wedding-olive">Depuis mon carnet d'adresses</DialogTitle>
        </DialogHeader>
        <Input placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-none" />
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Votre carnet est vide. <Link to="/pro/carnet-adresses" className="underline text-wedding-olive">Ajouter des partenaires</Link>
          </p>
        ) : (
          <ul className="divide-y divide-border border border-border max-h-[50vh] overflow-y-auto">
            {filteredContacts.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{c.company_name}</p>
                  <p className="text-xs text-muted-foreground">{c.category}{c.city ? ` · ${c.city}` : ''}</p>
                </div>
                <Button size="sm" className="rounded-none shrink-0" disabled={pickedIds.has(c.id)} onClick={() => handlePick(c)}>
                  {pickedIds.has(c.id) ? <Check className="h-3 w-3" /> : <><Plus className="h-3 w-3 mr-1" />Ajouter</>}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddressBookPickerDialog;
