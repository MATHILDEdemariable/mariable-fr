import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Phone, Camera, Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWedding } from '@/contexts/WeddingContext';
import JourJHandoffButton from '@/components/jour-j/JourJHandoffButton';

interface KeyPerson {
  id: string;
  full_name: string;
  key_role: string;
  phone: string | null;
  photo_url: string | null;
  notes: string | null;
  position: number;
}

interface GuestOption { id: string; full_name: string; phone: string | null }

const KEY_ROLES: { value: string; en: string }[] = [
  { value: 'Mariés', en: 'Couple' },
  { value: 'Témoins', en: 'Witnesses' },
  { value: 'Parents', en: 'Parents' },
  { value: 'Famille', en: 'Family' },
  { value: 'Officiant', en: 'Officiant' },
  { value: 'Cortège', en: 'Bridal party' },
  { value: 'Amis', en: 'Friends' },
  { value: 'Autre personne', en: 'Other' },
];

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const db = supabase as any;
const selectClass = 'h-11 w-full border border-input bg-background px-2 text-sm';
const emptyForm = { full_name: '', key_role: 'Témoins', phone: '', notes: '', photo_url: '' };

export const getInitials = (fullName: string) =>
  fullName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');

const TrombinoscopePage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const roleLabel = (role: string) => (isEnglish ? KEY_ROLES.find((entry) => entry.value === role)?.en ?? role : role);
  const { user } = useAuth();
  const { currentWeddingId } = useWedding();
  const weddingId = currentWeddingId || user?.id || null;

  const [people, setPeople] = useState<KeyPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isUploading, setIsUploading] = useState(false);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [guestOptions, setGuestOptions] = useState<GuestOption[]>([]);
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set());

  const loadKeyPeople = async () => {
    if (!weddingId) return;
    setIsLoading(true);
    try {
      const { data, error } = await db
        .from('wedding_key_people')
        .select('id, full_name, key_role, phone, photo_url, notes, position')
        .eq('wedding_id', weddingId)
        .order('position')
        .order('created_at');
      if (error) throw error;
      setPeople(data || []);
    } catch (error) {
      console.error('❌ loadKeyPeople failed:', error);
      toast.error(tr('Impossible de charger le trombinoscope', 'Could not load the who’s who'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKeyPeople();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const openEditDialog = (person: KeyPerson) => {
    setEditingId(person.id);
    setForm({ full_name: person.full_name, key_role: person.key_role, phone: person.phone ?? '', notes: person.notes ?? '', photo_url: person.photo_url ?? '' });
    setIsDialogOpen(true);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) {
      toast.error(tr('Choisissez une image', 'Please choose an image'));
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      toast.error(tr('Photo trop lourde (5 Mo max)', 'Photo too large (5 MB max)'));
      return;
    }
    setIsUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${user.id}/trombinoscope/${Date.now()}_${safeName}`;
      const { error } = await supabase.storage.from('wedding-documents').upload(filePath, file);
      if (error) throw error;
      const { data } = supabase.storage.from('wedding-documents').getPublicUrl(filePath);
      setForm((previous) => ({ ...previous, photo_url: data.publicUrl }));
    } catch (error) {
      console.error('❌ handlePhotoUpload failed:', error);
      toast.error(tr("Envoi de la photo impossible", 'Could not upload the photo'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSavePerson = async () => {
    if (!form.full_name.trim() || !weddingId || !user) return;
    const payload = {
      full_name: form.full_name.trim(), key_role: form.key_role, phone: form.phone.trim() || null,
      notes: form.notes.trim() || null, photo_url: form.photo_url || null,
    };
    try {
      if (editingId) {
        const { error } = await db.from('wedding_key_people').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await db.from('wedding_key_people').insert({ ...payload, wedding_id: weddingId, user_id: user.id, position: people.length });
        if (error) throw error;
      }
      setIsDialogOpen(false);
      loadKeyPeople();
    } catch (error) {
      console.error('❌ handleSavePerson failed:', error);
      toast.error(tr('Enregistrement impossible', 'Could not save'));
    }
  };

  const handleDeletePerson = async (person: KeyPerson) => {
    if (!window.confirm(tr(`Retirer ${person.full_name} du trombinoscope ?`, `Remove ${person.full_name}?`))) return;
    const { error } = await db.from('wedding_key_people').delete().eq('id', person.id);
    if (error) {
      console.error('❌ handleDeletePerson failed:', error);
      toast.error(tr('Suppression impossible', 'Could not delete'));
      return;
    }
    setPeople((previous) => previous.filter((entry) => entry.id !== person.id));
  };

  const openGuestPicker = async () => {
    if (!weddingId) return;
    setSelectedGuestIds(new Set());
    setIsGuestPickerOpen(true);
    const { data, error } = await db
      .from('wedding_guest_list')
      .select('id, guest_first_name, guest_last_name, guest_phone')
      .eq('wedding_id', weddingId)
      .order('guest_last_name');
    if (error) {
      console.error('❌ openGuestPicker failed:', error);
      return;
    }
    const existingNames = new Set(people.map((person) => person.full_name.toLowerCase()));
    setGuestOptions(
      (data || [])
        .map((guest: any) => ({ id: guest.id, full_name: `${guest.guest_first_name ?? ''} ${guest.guest_last_name ?? ''}`.trim(), phone: guest.guest_phone }))
        .filter((guest: GuestOption) => guest.full_name && !existingNames.has(guest.full_name.toLowerCase()))
    );
  };

  const handleAddSelectedGuests = async () => {
    if (!weddingId || !user || selectedGuestIds.size === 0) return;
    const rows = guestOptions
      .filter((guest) => selectedGuestIds.has(guest.id))
      .map((guest, index) => ({ wedding_id: weddingId, user_id: user.id, full_name: guest.full_name, phone: guest.phone, key_role: 'Famille', position: people.length + index }));
    const { error } = await db.from('wedding_key_people').insert(rows);
    if (error) {
      console.error('❌ handleAddSelectedGuests failed:', error);
      toast.error(tr('Ajout impossible', 'Could not add'));
      return;
    }
    setIsGuestPickerOpen(false);
    loadKeyPeople();
  };

  const syncKeyPeopleToJourJ = async () => {
    if (!weddingId) throw new Error('NO_WEDDING');
    const { error } = await (supabase as any).rpc('sync_key_people_to_jour_j', { target_wedding_id: weddingId });
    if (error) throw error;
  };

  return (
    <>
      <Helmet>
        <title>{tr('Trombinoscope du mariage | Mariable', 'Wedding who’s who | Mariable')}</title>
        <meta name="description" content={tr('Les personnes clés du mariage avec photo, rôle et téléphone, transmises au Jour J.', 'Key people of the wedding with photo, role and phone, sent to the wedding day.')} />
      </Helmet>

      <section className="space-y-5">
        <header className="bg-editorial-beige border border-border p-4 sm:p-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl">{tr('Trombinoscope', 'Who’s who')}</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              {tr('Mariés, témoins, parents, officiant… Ajoutez une photo et un rôle : une fois validé, le trombinoscope rejoint l’équipe du Jour J et le planning partagé.',
                'Couple, witnesses, parents, officiant… Add a photo and a role: once approved, the who’s who joins the wedding-day team and the shared schedule.')}
            </p>
          </div>
          <JourJHandoffButton module="trombinoscope" onValidate={syncKeyPeopleToJourJ} />
        </header>

        <div className="grid grid-cols-2 sm:flex sm:justify-end gap-2">
          <Button variant="outline" onClick={openGuestPicker} className="min-h-[44px] rounded-none">
            <Users className="h-4 w-4 mr-2" /> {tr('Depuis mes invités', 'From my guests')}
          </Button>
          <Button onClick={openCreateDialog} className="min-h-[44px] rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">
            <Plus className="h-4 w-4 mr-2" /> {tr('Ajouter', 'Add')}
          </Button>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-wedding-olive" /></div>
        ) : people.length === 0 ? (
          <div className="border border-dashed border-wedding-olive/40 p-8 text-center space-y-2">
            <p className="font-serif text-xl">{tr('Personne pour le moment', 'Nobody yet')}</p>
            <p className="text-sm text-muted-foreground">{tr('Ajoutez les personnes que les prestataires doivent reconnaître le jour J.', 'Add the people vendors need to recognise on the day.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {people.map((person) => (
              <article key={person.id} className="border border-wedding-olive/25 bg-background p-3 sm:p-4 text-center space-y-2">
                <div className="mx-auto h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full bg-editorial-beige border border-wedding-olive/30 flex items-center justify-center">
                  {person.photo_url ? (
                    <img src={person.photo_url} alt={person.full_name} className="h-full w-full object-cover object-top" loading="lazy" />
                  ) : (
                    <span className="font-serif text-2xl text-wedding-olive">{getInitials(person.full_name)}</span>
                  )}
                </div>
                <h2 className="font-serif text-base leading-tight">{person.full_name}</h2>
                <p className="text-[11px] uppercase tracking-wider text-wedding-olive">{roleLabel(person.key_role)}</p>
                {person.phone && (
                  <a href={`tel:${person.phone}`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline"><Phone className="h-3 w-3" />{person.phone}</a>
                )}
                {person.notes && <p className="text-xs text-muted-foreground line-clamp-2">{person.notes}</p>}
                <div className="flex justify-center gap-1 pt-1">
                  <button type="button" onClick={() => openEditDialog(person)} className="p-2 hover:bg-muted" aria-label={tr('Modifier', 'Edit')}><Pencil className="h-4 w-4" /></button>
                  <button type="button" onClick={() => handleDeletePerson(person)} className="p-2 hover:bg-muted text-destructive" aria-label={tr('Supprimer', 'Delete')}><Trash2 className="h-4 w-4" /></button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingId ? tr('Modifier la fiche', 'Edit card') : tr('Nouvelle personne clé', 'New key person')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-editorial-beige border border-wedding-olive/30 flex items-center justify-center">
                {form.photo_url ? <img src={form.photo_url} alt="" className="h-full w-full object-cover object-top" /> : <Camera className="h-6 w-6 text-wedding-olive" />}
              </div>
              <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 border border-wedding-olive/40 px-3 text-sm text-wedding-olive hover:bg-wedding-olive/5">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                {form.photo_url ? tr('Changer la photo', 'Change photo') : tr('Ajouter une photo', 'Add a photo')}
                <input type="file" accept="image/*" className="sr-only" onChange={handlePhotoUpload} disabled={isUploading} />
              </label>
            </div>
            <div>
              <Label htmlFor="person-name">{tr('Prénom et nom', 'Full name')}</Label>
              <Input id="person-name" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="person-role">{tr('Rôle', 'Role')}</Label>
                <select id="person-role" className={selectClass} value={form.key_role} onChange={(event) => setForm({ ...form, key_role: event.target.value })}>
                  {KEY_ROLES.map((role) => <option key={role.value} value={role.value}>{isEnglish ? role.en : role.value}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="person-phone">{tr('Téléphone', 'Phone')}</Label>
                <Input id="person-phone" type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="person-notes">{tr('Note', 'Note')}</Label>
              <Textarea id="person-notes" rows={2} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder={tr('Ex. Garde les alliances, fait le discours', 'E.g. Keeps the rings, gives a speech')} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={handleSavePerson} disabled={!form.full_name.trim() || isUploading} className="min-h-[44px] rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">{tr('Enregistrer', 'Save')}</Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="min-h-[44px] rounded-none">{tr('Annuler', 'Cancel')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isGuestPickerOpen} onOpenChange={setIsGuestPickerOpen}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif">{tr('Choisir dans la liste d’invités', 'Pick from the guest list')}</DialogTitle>
            <DialogDescription>{tr('Le rôle et la photo se complètent ensuite sur chaque fiche.', 'Role and photo can be completed on each card afterwards.')}</DialogDescription>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto space-y-1">
            {guestOptions.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">{tr('Aucun invité disponible', 'No guests available')}</p>
            ) : guestOptions.map((guest) => (
              <label key={guest.id} className="flex min-h-[44px] items-center gap-3 border-b border-border px-1 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedGuestIds.has(guest.id)}
                  onCheckedChange={(checked) => setSelectedGuestIds((previous) => {
                    const next = new Set(previous);
                    if (checked) next.add(guest.id); else next.delete(guest.id);
                    return next;
                  })}
                />
                {guest.full_name}
              </label>
            ))}
          </div>
          <Button onClick={handleAddSelectedGuests} disabled={selectedGuestIds.size === 0} className="min-h-[44px] rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">
            {tr(`Ajouter (${selectedGuestIds.size})`, `Add (${selectedGuestIds.size})`)}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrombinoscopePage;
