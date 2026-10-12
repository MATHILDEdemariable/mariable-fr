import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Loader2, ImagePlus, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  GUEST_PAGE_FONTS,
  GUEST_PAGE_FONTS_URL,
  GUEST_PAGE_INFO_FIELDS,
  GUEST_PAGE_PALETTES,
  GuestPageCustomization,
  GuestPageContact,
  GuestPageProgramItem,
} from '@/data/guestPageThemes';

export interface GuestPageEventDetails {
  event_name: string;
  welcome_message: string | null;
  event_date: string | null;
  event_location: string | null;
}

interface GuestPageCustomizerProps {
  eventId: string;
  initialCustomization?: GuestPageCustomization | null;
  /** Titre, message, date et lieu : modifiables depuis le mini-site */
  initialEventDetails?: GuestPageEventDetails;
  onSaved?: (customization: GuestPageCustomization, details?: GuestPageEventDetails) => void;
  /** Affiche les réglages directement dans la page (vue Mini-site) au lieu d'une fenêtre */
  inline?: boolean;
}

const MAX_PHOTO_SIZE = 8 * 1024 * 1024;

/** Carte de section « papeterie » du mini-site */
const SettingsCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <section className="bg-wedding-cream/60 border border-wedding-olive/15 p-4 sm:p-6 space-y-4">
    <header className="space-y-1">
      <h3 className="font-serif text-xl">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </header>
    {children}
  </section>
);

/** Réglages du mini-site des mariés : couverture, programme, infos, contact et style. */
const GuestPageCustomizer: React.FC<GuestPageCustomizerProps> = ({ eventId, initialCustomization, initialEventDetails, onSaved, inline = false }) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [eventDetails, setEventDetails] = useState<GuestPageEventDetails | undefined>(initialEventDetails);
  const [customization, setCustomization] = useState<GuestPageCustomization>({
    palette: 'sauge',
    font: 'editorial',
    showSchedule: true,
    showCountdown: true,
    infos: {},
    ...(initialCustomization ?? {}),
  });

  const updateInfo = (key: string, patch: { text?: string; visible?: boolean }) =>
    setCustomization((prev) => ({
      ...prev,
      infos: { ...prev.infos, [key]: { visible: true, ...(prev.infos as any)?.[key], ...patch } },
    }));

  const updateContact = (patch: Partial<GuestPageContact>) =>
    setCustomization((prev) => ({ ...prev, contact: { visible: true, ...prev.contact, ...patch } }));

  const programItems = customization.program ?? [];
  const updateProgramItem = (index: number, patch: Partial<GuestPageProgramItem>) =>
    setCustomization((prev) => ({
      ...prev,
      program: (prev.program ?? []).map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));

  const handlePhotoUpload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > MAX_PHOTO_SIZE) {
      toast({ title: isEnglish ? 'Image up to 8 MB only' : 'Image de 8 Mo maximum uniquement', variant: 'destructive' });
      return;
    }
    setUploadingPhoto(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `guest-pages/${user.id}/${eventId}-${Date.now()}.${extension}`;
      const { error } = await supabase.storage.from('jeunes-maries-photos').upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from('jeunes-maries-photos').getPublicUrl(path);
      setCustomization((prev) => ({ ...prev, heroPhotoUrl: data.publicUrl }));
      toast({ title: isEnglish ? 'Photo added — remember to save' : 'Photo ajoutée — pensez à enregistrer' });
    } catch (error) {
      console.error('❌ GuestPageCustomizer photo upload failed:', error);
      toast({ title: isEnglish ? 'Upload failed' : 'Envoi de la photo impossible', variant: 'destructive' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (eventDetails && !eventDetails.event_name.trim()) {
      toast({ title: isEnglish ? 'The title is required' : 'Le titre est obligatoire', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const cleanedCustomization: GuestPageCustomization = {
        ...customization,
        program: programItems.filter((item) => item.title?.trim()),
      };
      const { error } = await (supabase as any)
        .from('wedding_rsvp_events')
        .update({
          customization: cleanedCustomization,
          ...(eventDetails
            ? {
                event_name: eventDetails.event_name.trim(),
                welcome_message: eventDetails.welcome_message || null,
                event_date: eventDetails.event_date || null,
                event_location: eventDetails.event_location || null,
              }
            : {}),
        })
        .eq('id', eventId);
      if (error) throw error;
      setCustomization(cleanedCustomization);
      onSaved?.(cleanedCustomization, eventDetails);
      toast({ title: isEnglish ? 'Mini-site saved' : 'Mini-site enregistré' });
      setOpen(false);
    } catch (error) {
      console.error('❌ GuestPageCustomizer save failed:', error);
      toast({ title: isEnglish ? 'Save failed' : 'Enregistrement impossible', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const contact = customization.contact ?? {};

  const settingsContent = (
    <>
      {eventDetails && (
        <SettingsCard
          title={isEnglish ? 'Cover & welcome' : 'Couverture & accueil'}
          subtitle={isEnglish ? 'Editable at any time.' : 'Modifiable à tout moment.'}
        >
          <div className="space-y-2">
            <Label htmlFor={`title-${eventId}`}>{isEnglish ? 'Wedding title' : 'Titre du mariage'}</Label>
            <Input
              id={`title-${eventId}`}
              value={eventDetails.event_name}
              onChange={(e) => setEventDetails({ ...eventDetails, event_name: e.target.value })}
              placeholder="Camille & Thomas"
              className="font-serif text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`welcome-${eventId}`}>{isEnglish ? 'Welcome message' : "Message d'accueil"}</Label>
            <Textarea
              id={`welcome-${eventId}`}
              rows={3}
              value={eventDetails.welcome_message ?? ''}
              onChange={(e) => setEventDetails({ ...eventDetails, welcome_message: e.target.value })}
              placeholder={isEnglish ? 'We can’t wait to celebrate with you…' : 'Nous avons hâte de célébrer cette journée avec vous…'}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`date-${eventId}`}>{isEnglish ? 'Date' : 'Date'}</Label>
              <Input
                id={`date-${eventId}`}
                type="date"
                value={eventDetails.event_date ?? ''}
                onChange={(e) => setEventDetails({ ...eventDetails, event_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`location-${eventId}`}>{isEnglish ? 'Venue' : 'Lieu'}</Label>
              <Input
                id={`location-${eventId}`}
                value={eventDetails.event_location ?? ''}
                onChange={(e) => setEventDetails({ ...eventDetails, event_location: e.target.value })}
                placeholder="Château de…"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isEnglish ? 'Cover photo' : 'Photo de couverture'}</Label>
            {customization.heroPhotoUrl ? (
              <div className="relative">
                <img src={customization.heroPhotoUrl} alt={isEnglish ? 'Cover photo' : 'Photo de couverture'} className="w-full h-48 object-cover" />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 rounded-none"
                  onClick={() => setCustomization((prev) => ({ ...prev, heroPhotoUrl: undefined }))}
                >
                  <Trash2 className="h-4 w-4 mr-1" />{isEnglish ? 'Remove' : 'Retirer'}
                </Button>
              </div>
            ) : null}
            <label className="flex items-center justify-center gap-2 min-h-[56px] border border-dashed border-wedding-olive/40 cursor-pointer hover:bg-background text-sm">
              {uploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {customization.heroPhotoUrl
                ? isEnglish ? 'Replace the photo' : 'Remplacer la photo'
                : isEnglish ? 'Add a beautiful photo' : 'Ajouter une jolie photo'}
              <input type="file" accept="image/*" className="sr-only" disabled={uploadingPhoto} onChange={(e) => handlePhotoUpload(e.target.files?.[0])} />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor={`countdown-${eventId}`}>{isEnglish ? 'Show the countdown' : 'Afficher le décompte'}</Label>
            <Switch
              id={`countdown-${eventId}`}
              checked={customization.showCountdown !== false}
              onCheckedChange={(checked) => setCustomization((prev) => ({ ...prev, showCountdown: checked }))}
            />
          </div>
        </SettingsCard>
      )}

      <SettingsCard
        title={isEnglish ? 'Programme' : 'Programme'}
        subtitle={isEnglish ? 'The key moments of the day.' : 'Les grands moments de la journée.'}
      >
        {programItems.map((item, index) => (
          <div key={index} className="grid grid-cols-[80px_1fr_auto] sm:grid-cols-[90px_1fr_1fr_auto] gap-2 items-center">
            <Input type="time" value={item.time ?? ''} onChange={(e) => updateProgramItem(index, { time: e.target.value })} aria-label={isEnglish ? 'Time' : 'Heure'} />
            <Input value={item.title ?? ''} onChange={(e) => updateProgramItem(index, { title: e.target.value })} placeholder={isEnglish ? 'Ceremony' : 'Cérémonie'} aria-label={isEnglish ? 'Moment' : 'Moment'} />
            <Input className="col-span-2 sm:col-span-1 row-start-2 sm:row-start-auto" value={item.place ?? ''} onChange={(e) => updateProgramItem(index, { place: e.target.value })} placeholder={isEnglish ? 'Place (optional)' : 'Lieu (optionnel)'} aria-label={isEnglish ? 'Place' : 'Lieu'} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="row-start-1 col-start-3 sm:col-start-4"
              aria-label={isEnglish ? 'Remove' : 'Supprimer'}
              onClick={() => setCustomization((prev) => ({ ...prev, program: (prev.program ?? []).filter((_, i) => i !== index) }))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="rounded-none w-full"
          onClick={() => setCustomization((prev) => ({ ...prev, program: [...(prev.program ?? []), { time: '', title: '', place: '' }] }))}
        >
          <Plus className="h-4 w-4 mr-1" />{isEnglish ? 'Add a moment' : 'Ajouter un moment'}
        </Button>
        <div className="flex items-center justify-between">
          <Label htmlFor={`show-schedule-${eventId}`}>{isEnglish ? 'Also show RSVP sub-events' : 'Afficher aussi les sous-événements du RSVP'}</Label>
          <Switch
            id={`show-schedule-${eventId}`}
            checked={customization.showSchedule !== false}
            onCheckedChange={(checked) => setCustomization((prev) => ({ ...prev, showSchedule: checked }))}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title={isEnglish ? 'Practical info' : 'Infos pratiques'}
        subtitle={isEnglish ? 'Empty blocks are not shown.' : 'Les blocs vides ne sont pas affichés.'}
      >
        {GUEST_PAGE_INFO_FIELDS.map((field) => {
          const info = customization.infos?.[field.key];
          return (
            <div key={field.key} className="space-y-2 bg-background p-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={`info-${eventId}-${field.key}`}>
                  {field.emoji} {isEnglish ? field.labelEn : field.labelFr}
                </Label>
                <Switch
                  checked={info?.visible !== false}
                  onCheckedChange={(checked) => updateInfo(field.key, { visible: checked })}
                  aria-label={isEnglish ? 'Show' : 'Afficher'}
                />
              </div>
              <Textarea
                id={`info-${eventId}-${field.key}`}
                rows={2}
                value={info?.text ?? ''}
                onChange={(e) => updateInfo(field.key, { text: e.target.value })}
                placeholder={field.placeholderFr}
              />
              {field.key === 'registry' && (
                <Input
                  type="url"
                  value={customization.registryUrl ?? ''}
                  onChange={(e) => setCustomization((prev) => ({ ...prev, registryUrl: e.target.value }))}
                  placeholder="https://…"
                  aria-label={isEnglish ? 'Registry link' : 'Lien de la cagnotte'}
                />
              )}
            </div>
          );
        })}
      </SettingsCard>

      <SettingsCard
        title={isEnglish ? 'Contact details' : 'Contact & coordonnées'}
        subtitle={isEnglish ? 'Shown as a signature at the bottom of the page.' : 'Affiché comme une signature en bas de page.'}
      >
        <div className="flex items-center justify-between">
          <Label htmlFor={`contact-visible-${eventId}`}>{isEnglish ? 'Show contact block' : 'Afficher le bloc contact'}</Label>
          <Switch id={`contact-visible-${eventId}`} checked={contact.visible !== false} onCheckedChange={(checked) => updateContact({ visible: checked })} />
        </div>
        <Input value={contact.names ?? ''} onChange={(e) => updateContact({ names: e.target.value })} placeholder={isEnglish ? 'First & last names' : 'Prénoms et noms des mariés'} aria-label={isEnglish ? 'Names' : 'Noms'} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Input type="email" value={contact.email ?? ''} onChange={(e) => updateContact({ email: e.target.value })} placeholder="Email" aria-label="Email" />
          <Input type="tel" value={contact.phone ?? ''} onChange={(e) => updateContact({ phone: e.target.value })} placeholder={isEnglish ? 'Phone' : 'Téléphone'} aria-label={isEnglish ? 'Phone' : 'Téléphone'} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor={`postal-visible-${eventId}`}>{isEnglish ? 'Show postal address' : "Afficher l'adresse postale"}</Label>
          <Switch id={`postal-visible-${eventId}`} checked={!!contact.showPostalAddress} onCheckedChange={(checked) => updateContact({ showPostalAddress: checked })} />
        </div>
        {contact.showPostalAddress && (
          <Textarea rows={2} value={contact.postalAddress ?? ''} onChange={(e) => updateContact({ postalAddress: e.target.value })} placeholder={isEnglish ? 'Postal address' : 'Adresse postale'} aria-label={isEnglish ? 'Postal address' : 'Adresse postale'} />
        )}
      </SettingsCard>

      <SettingsCard title={isEnglish ? 'Style & colours' : 'Style & couleurs'}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {GUEST_PAGE_PALETTES.map((palette) => (
            <button
              key={palette.key}
              type="button"
              onClick={() => setCustomization((prev) => ({ ...prev, palette: palette.key }))}
              aria-pressed={customization.palette === palette.key}
              className={`bg-background p-3 text-left text-xs min-h-[44px] border transition ${customization.palette === palette.key ? 'border-foreground ring-1 ring-foreground' : 'border-transparent hover:border-border'}`}
            >
              <span className="flex h-6 mb-2 overflow-hidden">
                {[palette.background, palette.accent, palette.text].map((color) => (
                  <span key={color} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </span>
              {isEnglish ? palette.labelEn : palette.labelFr}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {GUEST_PAGE_FONTS.map((font) => (
            <button
              key={font.key}
              type="button"
              onClick={() => setCustomization((prev) => ({ ...prev, font: font.key }))}
              aria-pressed={customization.font === font.key}
              className={`bg-background p-3 min-h-[56px] border text-xl ${customization.font === font.key ? 'border-foreground ring-1 ring-foreground' : 'border-transparent hover:border-border'}`}
              style={{ fontFamily: font.heading }}
            >
              {eventDetails?.event_name || font.label}
            </button>
          ))}
        </div>
      </SettingsCard>

      <Button onClick={handleSave} disabled={saving || uploadingPhoto} className="w-full min-h-[48px] rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEnglish ? 'Save the mini-site' : 'Enregistrer le mini-site'}
      </Button>
    </>
  );

  if (inline) {
    return (
      <div className="space-y-6">
        <link rel="stylesheet" href={GUEST_PAGE_FONTS_URL} />
        {settingsContent}
      </div>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" className="w-full rounded-none" onClick={() => setOpen(true)}>
        <Palette className="h-4 w-4 mr-1" />
        {isEnglish ? 'Customise the guest page' : 'Personnaliser la page invités'}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-none">
          <link rel="stylesheet" href={GUEST_PAGE_FONTS_URL} />
          <DialogHeader>
            <DialogTitle className="font-serif">{isEnglish ? 'Your guest page' : 'Votre feuille des mariés'}</DialogTitle>
            <DialogDescription>
              {isEnglish
                ? 'Key information for your guests, with the RSVP form at the bottom.'
                : 'Les infos clés pour vos invités, avec le formulaire de réponse en bas de page.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">{settingsContent}</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GuestPageCustomizer;
