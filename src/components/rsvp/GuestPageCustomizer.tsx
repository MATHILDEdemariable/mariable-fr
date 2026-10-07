import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Loader2 } from 'lucide-react';
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
} from '@/data/guestPageThemes';

interface GuestPageCustomizerProps {
  eventId: string;
  initialCustomization?: GuestPageCustomization | null;
  onSaved?: (customization: GuestPageCustomization) => void;
}

/** Réglages de la feuille des mariés : couleurs, police et infos pratiques. */
const GuestPageCustomizer: React.FC<GuestPageCustomizerProps> = ({ eventId, initialCustomization, onSaved }) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customization, setCustomization] = useState<GuestPageCustomization>({
    palette: 'sauge',
    font: 'editorial',
    showSchedule: true,
    infos: {},
    ...(initialCustomization ?? {}),
  });

  const updateInfo = (key: string, patch: { text?: string; visible?: boolean }) =>
    setCustomization((prev) => ({
      ...prev,
      infos: { ...prev.infos, [key]: { visible: true, ...(prev.infos as any)?.[key], ...patch } },
    }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from('wedding_rsvp_events')
        .update({ customization })
        .eq('id', eventId);
      if (error) throw error;
      onSaved?.(customization);
      toast({ title: isEnglish ? 'Page saved' : 'Page enregistrée' });
      setOpen(false);
    } catch (error) {
      console.error('❌ GuestPageCustomizer save failed:', error);
      toast({ title: isEnglish ? 'Save failed' : 'Enregistrement impossible', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

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

          <section className="space-y-2">
            <h3 className="text-sm font-medium">{isEnglish ? 'Colours' : 'Couleurs'}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GUEST_PAGE_PALETTES.map((palette) => (
                <button
                  key={palette.key}
                  type="button"
                  onClick={() => setCustomization((prev) => ({ ...prev, palette: palette.key }))}
                  aria-pressed={customization.palette === palette.key}
                  className={`border p-2 text-left text-xs min-h-[44px] ${customization.palette === palette.key ? 'border-foreground ring-1 ring-foreground' : 'border-border'}`}
                >
                  <span className="flex gap-1 mb-1">
                    {[palette.background, palette.accent, palette.text].map((color) => (
                      <span key={color} className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: color }} />
                    ))}
                  </span>
                  {isEnglish ? palette.labelEn : palette.labelFr}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium">{isEnglish ? 'Font' : 'Police'}</h3>
            <div className="grid grid-cols-3 gap-2">
              {GUEST_PAGE_FONTS.map((font) => (
                <button
                  key={font.key}
                  type="button"
                  onClick={() => setCustomization((prev) => ({ ...prev, font: font.key }))}
                  aria-pressed={customization.font === font.key}
                  className={`border p-2 text-base min-h-[44px] ${customization.font === font.key ? 'border-foreground ring-1 ring-foreground' : 'border-border'}`}
                  style={{ fontFamily: font.heading }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-schedule">{isEnglish ? 'Show the schedule (sub-events)' : 'Afficher le déroulé (sous-événements)'}</Label>
              <Switch
                id="show-schedule"
                checked={customization.showSchedule !== false}
                onCheckedChange={(checked) => setCustomization((prev) => ({ ...prev, showSchedule: checked }))}
              />
            </div>

            {GUEST_PAGE_INFO_FIELDS.map((field) => {
              const info = customization.infos?.[field.key];
              return (
                <div key={field.key} className="space-y-1 border border-border p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`info-${field.key}`}>
                      {field.emoji} {isEnglish ? field.labelEn : field.labelFr}
                    </Label>
                    <Switch
                      checked={info?.visible !== false}
                      onCheckedChange={(checked) => updateInfo(field.key, { visible: checked })}
                      aria-label={isEnglish ? 'Show' : 'Afficher'}
                    />
                  </div>
                  <Textarea
                    id={`info-${field.key}`}
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
            <p className="text-xs text-muted-foreground">
              {isEnglish ? 'Empty blocks are not shown.' : 'Les blocs vides ne sont pas affichés.'}
            </p>
          </section>

          <Button onClick={handleSave} disabled={saving} className="w-full rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEnglish ? 'Save' : 'Enregistrer'}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GuestPageCustomizer;
