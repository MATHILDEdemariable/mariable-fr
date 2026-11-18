import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, Loader2, Save, Upload, UserRound } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { buildGuideSlug, countGuideProfileCompletion, GUIDE_PROFILE_FIELDS, GuideProfileField } from '@/lib/proGuideProfile';

type GuideForm = Record<GuideProfileField, string>;
const EMPTY_FORM: GuideForm = { nom: '', responsable_nom: '', ville: '', telephone: '', email: '', instagram: '', site_web: '', photo_portrait_url: '', description: '' };
// Colonnes récentes : types générés pas encore à jour
const guideTable = () => (supabase as any).from('prestataires_rows');

const FicheGuide: React.FC = () => {
  const { i18n } = useTranslation('pro');
  const isEnglish = !!i18n.language?.startsWith('en');
  const tr = (frText: string, enText: string) => (isEnglish ? enText : frText);
  const { toast } = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState<GuideForm>(EMPTY_FORM);
  const [ficheId, setFicheId] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loadGuideProfile = async () => {
      try {
        const { data, error } = await guideTable()
          .select(`id, slug, visible, ${GUIDE_PROFILE_FIELDS.join(', ')}`)
          .eq('owner_user_id', user.id).maybeSingle();
        if (error) throw error;
        if (data) {
          setFicheId(data.id); setSlug(data.slug); setIsVisible(!!data.visible);
          setForm(Object.fromEntries(GUIDE_PROFILE_FIELDS.map((f) => [f, data[f] ?? ''])) as GuideForm);
        } else {
          // Pré-remplissage depuis le compte
          const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).maybeSingle();
          setForm({ ...EMPTY_FORM, email: user.email ?? '', responsable_nom: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') });
        }
      } catch (error) {
        console.error('❌ FicheGuide: chargement impossible', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGuideProfile();
  }, [user]);

  const updateField = (field: GuideProfileField, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handlePortraitUpload = async (file: File | undefined) => {
    if (!file || !user) return;
    if (!file.type.startsWith('image/') || file.size > 5_000_000) {
      toast({ title: tr('Image invalide (5 Mo max)', 'Invalid image (5 MB max)'), variant: 'destructive' });
      return;
    }
    setIsUploading(true);
    try {
      const path = `guide/${user.id}/portrait-${Date.now()}.${file.name.split('.').pop() || 'jpg'}`;
      const { error } = await supabase.storage.from('prestataires-photos').upload(path, file, { upsert: false });
      if (error) throw error;
      updateField('photo_portrait_url', supabase.storage.from('prestataires-photos').getPublicUrl(path).data.publicUrl);
    } catch (error) {
      console.error('❌ FicheGuide: upload portrait impossible', error);
      toast({ title: tr('Envoi de la photo impossible', 'Photo upload failed'), variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.nom.trim()) {
      toast({ title: tr('Le nom de l’agence est obligatoire', 'Agency name is required'), variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      const payload = Object.fromEntries(GUIDE_PROFILE_FIELDS.map((f) => [f, form[f].trim() || null]));
      if (ficheId) {
        const { error } = await guideTable().update(payload).eq('id', ficheId);
        if (error) throw error;
      } else {
        const newSlug = buildGuideSlug(form.nom, user.id.replace(/-/g, ''));
        const { data, error } = await guideTable()
          .insert({ ...payload, owner_user_id: user.id, categorie: 'Coordination', slug: newSlug })
          .select('id, slug').single();
        if (error) throw error;
        setFicheId(data.id); setSlug(data.slug);
        await supabase.from('profiles').update({ prestataire_id: data.id } as any).eq('id', user.id);
      }
      toast({ title: tr('Fiche enregistrée', 'Profile saved') });
    } catch (error) {
      console.error('❌ FicheGuide: enregistrement impossible', error);
      toast({ title: tr('Enregistrement impossible', 'Save failed'), variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const completion = countGuideProfileCompletion(form);
  const textFields: { field: GuideProfileField; label: string; placeholder?: string; type?: string }[] = [
    { field: 'nom', label: tr('Nom de l’agence *', 'Agency name *') },
    { field: 'responsable_nom', label: tr('Prénom et nom', 'First and last name') },
    { field: 'ville', label: tr('Ville principale', 'Main city'), placeholder: 'Paris, Tours…' },
    { field: 'telephone', label: tr('Téléphone', 'Phone'), type: 'tel' },
    { field: 'email', label: 'Email', type: 'email' },
    { field: 'instagram', label: 'Instagram', placeholder: '@monagence' },
    { field: 'site_web', label: tr('Site web', 'Website'), placeholder: 'https://', type: 'url' },
  ];

  return (
    <DashboardLayout variant="pro">
      <Helmet><title>{tr('Ma fiche Guide', 'My Guide profile')} | Mariable Pro</title></Helmet>
      <section className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-serif text-3xl font-bold">{tr('Ma fiche sur le Guide Mariable', 'My Mariable Guide profile')}</h1>
          <p className="text-sm text-muted-foreground">
            {tr('Complétez votre fiche pour être référencée auprès des futurs mariés. Elle est publiée après validation par l’équipe Mariable.', 'Complete your profile to be listed for engaged couples. It is published after review by the Mariable team.')}
          </p>
        </div>

        {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-wedding-olive" /> : (
          <>
            <div className="border border-wedding-olive/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{tr('Fiche complétée', 'Profile completed')} : {completion}/{GUIDE_PROFILE_FIELDS.length}</span>
                <span className="text-muted-foreground">
                  {!ficheId ? tr('Pas encore créée', 'Not created yet') : isVisible ? tr('En ligne', 'Live') : tr('En attente de validation', 'Awaiting review')}
                </span>
              </div>
              <div className="h-2 bg-muted" role="progressbar" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={GUIDE_PROFILE_FIELDS.length}>
                <div className="h-2 bg-wedding-olive transition-all" style={{ width: `${(completion / GUIDE_PROFILE_FIELDS.length) * 100}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {form.photo_portrait_url
                ? <img src={form.photo_portrait_url} alt={tr('Portrait de la wedding planner', 'Wedding planner portrait')} className="h-24 w-24 object-cover" />
                : <div className="h-24 w-24 bg-muted flex items-center justify-center"><UserRound className="h-10 w-10 text-muted-foreground" /></div>}
              <Label className="inline-flex items-center gap-2 cursor-pointer border px-4 min-h-[44px] text-sm">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {tr('Ajouter votre photo portrait', 'Add your portrait photo')}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => handlePortraitUpload(e.target.files?.[0])} />
              </Label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {textFields.map(({ field, label, placeholder, type }) => (
                <div key={field} className="space-y-1">
                  <Label htmlFor={`guide-${field}`}>{label}</Label>
                  <Input id={`guide-${field}`} type={type ?? 'text'} value={form[field]} placeholder={placeholder}
                    onChange={(e) => updateField(field, e.target.value)} className="text-base" />
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <Label htmlFor="guide-description">{tr('Présentation courte', 'Short description')}</Label>
              <Textarea id="guide-description" rows={5} value={form.description} onChange={(e) => updateField('description', e.target.value)}
                placeholder={tr('Votre approche, vos spécialités, votre zone d’intervention…', 'Your approach, specialties, area…')} className="text-base" />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSave} disabled={isSaving} className="bg-wedding-olive hover:bg-wedding-olive/90 rounded-none min-h-[44px]">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {tr('Enregistrer ma fiche', 'Save my profile')}
              </Button>
              {slug && isVisible && (
                <Button asChild variant="outline" className="rounded-none min-h-[44px]">
                  <a href={`/prestataire/${slug}`} target="_blank" rel="noopener noreferrer">
                    {tr('Voir ma fiche publique', 'View my public profile')} <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
};

export default FicheGuide;
