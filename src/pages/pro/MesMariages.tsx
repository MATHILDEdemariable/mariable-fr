import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Plus, CalendarDays, MapPin, Users, ArrowRight, Building2, Crown, Save, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useWedding, type Wedding } from '@/contexts/WeddingContext';
import NouveauMariageDialog from '@/components/pro/NouveauMariageDialog';
import ModifierMariageDialog from '@/components/pro/ModifierMariageDialog';

interface ProProfileForm {
  first_name: string;
  last_name: string;
  company_name: string;
  phone: string;
  city: string;
}

const emptyForm: ProProfileForm = {
  first_name: '',
  last_name: '',
  company_name: '',
  phone: '',
  city: '',
};

const MesMariages: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation('pro');
  const { weddings, loading, selectWedding, canCreateMoreWeddings, accountType } = useWedding();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWedding, setEditingWedding] = useState<Wedding | null>(null);
  const [form, setForm] = useState<ProProfileForm>(emptyForm);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await (supabase as any)
          .from('profiles')
          .select('first_name, last_name, company_name, phone, city')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setForm({
            first_name: data.first_name ?? '',
            last_name: data.last_name ?? '',
            company_name: data.company_name ?? '',
            phone: data.phone ?? '',
            city: data.city ?? '',
          });
        }
      } catch (error) {
        console.error('❌ EspacePro: profil illisible', error);
      } finally {
        setProfileLoaded(true);
      }
    };

    loadProfile();
  }, []);

  const handleOpenWedding = (weddingId: string) => {
    selectWedding(weddingId);
    navigate('/dashboard');
  };

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSavingProfile(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          first_name: form.first_name.trim() || null,
          last_name: form.last_name.trim() || null,
          company_name: form.company_name.trim() || null,
          phone: form.phone.trim() || null,
          city: form.city.trim() || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({ title: t('profile.saved') });
    } catch (error) {
      console.error('❌ EspacePro: enregistrement impossible', error);
      toast({
        title: t('profile.saveErrorTitle'),
        description: t('profile.saveErrorDesc'),
        variant: 'destructive',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const isProfileIncomplete =
    profileLoaded && (!form.first_name.trim() || !form.last_name.trim() || !form.company_name.trim());

  return (
    <DashboardLayout variant="pro">
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* En-tête */}
        <header>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl text-foreground">{t('header.title')}</h1>
            <Badge className="bg-wedding-olive text-white hover:bg-wedding-olive/90">
              <Building2 className="h-3 w-3 mr-1" />
              {t('header.badge')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {form.company_name
              ? form.company_name
              : t('header.subtitle')}
          </p>
        </header>

        {isProfileIncomplete && (
          <div className="border border-border bg-background p-4 text-sm text-muted-foreground">
            {t('header.incompleteProfile')}
          </div>
        )}

        {/* Mes mariages */}
        <section id="mes-mariages" className="scroll-mt-32">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="font-serif text-2xl text-foreground">{t('weddings.title')}</h2>
            <Button
              onClick={() => setDialogOpen(true)}
              disabled={!canCreateMoreWeddings && weddings.length > 0}
              className="rounded-none"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('weddings.create')}
            </Button>
          </div>

          {accountType === 'b2b' && !canCreateMoreWeddings && weddings.length > 0 && (
            <div className="mb-4 border border-border bg-background p-4 text-sm text-muted-foreground">
              {t('weddings.limit')}{' '}
              <button className="underline" onClick={() => navigate('/partenariat#mariable-pro')}>
                {t('weddings.limitCta')}
              </button>
            </div>
          )}

          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : weddings.length === 0 ? (
            <Card className="rounded-none border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">{t('weddings.empty')}</p>
                <Button onClick={() => setDialogOpen(true)} className="rounded-none">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('weddings.createFirst')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {weddings.map((wedding) => (
                <Card key={wedding.id} className="rounded-none border-border bg-background">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-xl text-foreground">{wedding.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-none h-8 w-8 shrink-0"
                        aria-label={t('weddings.edit')}
                        onClick={() => setEditingWedding(wedding)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {wedding.wedding_date ? (
                          new Date(wedding.wedding_date).toLocaleDateString(i18n.language?.startsWith('en') ? 'en-GB' : 'fr-FR')
                        ) : (
                          <button
                            type="button"
                            className="underline hover:text-foreground"
                            onClick={() => setEditingWedding(wedding)}
                          >
                            {t('weddings.dateToDefine')}
                          </button>
                        )}
                      </p>
                      {wedding.wedding_location && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {wedding.wedding_location}
                        </p>
                      )}
                      {wedding.guest_count ? (
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {t('weddings.guests', { count: wedding.guest_count })}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      variant="outline"
                      className="mt-5 rounded-none w-full"
                      onClick={() => handleOpenWedding(wedding.id)}
                    >
                      {t('weddings.open')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Mes informations */}
        <section id="mes-informations" className="scroll-mt-32">
          <h2 className="font-serif text-2xl text-foreground mb-4">{t('profile.title')}</h2>
          <Card className="rounded-none border-border bg-background">
            <CardContent className="p-5">
              <form onSubmit={handleSaveProfile} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="pro-first-name">{t('profile.firstName')}</Label>
                  <Input
                    id="pro-first-name"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pro-last-name">{t('profile.lastName')}</Label>
                  <Input
                    id="pro-last-name"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pro-company">{t('profile.company')}</Label>
                  <Input
                    id="pro-company"
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pro-phone">{t('profile.phone')}</Label>
                  <Input
                    id="pro-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="pro-city">{t('profile.city')}</Label>
                  <Input
                    id="pro-city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="rounded-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={savingProfile} className="rounded-none w-full sm:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    {savingProfile ? t('profile.saving') : t('profile.save')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Mon offre */}
        <section id="mon-offre" className="scroll-mt-32">
          <h2 className="font-serif text-2xl text-foreground mb-4">{t('offer.title')}</h2>
          <Card className="rounded-none border-border bg-background">
            <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-foreground flex items-center gap-2">
                  <Crown className="h-4 w-4 text-wedding-olive" />
                  {t('offer.name')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('offer.description')}
                </p>
              </div>
              <Button className="rounded-none" onClick={() => navigate('/partenariat#mariable-pro')}>
                {t('offer.cta')}
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      <NouveauMariageDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <ModifierMariageDialog wedding={editingWedding} onOpenChange={(open) => !open && setEditingWedding(null)} />
    </DashboardLayout>
  );
};

export default MesMariages;
