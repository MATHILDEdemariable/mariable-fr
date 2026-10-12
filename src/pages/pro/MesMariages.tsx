import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Plus, CalendarDays, MapPin, Users, ArrowRight, Building2, Crown, Save, Pencil, Archive, RotateCcw, GraduationCap, BookUser, Settings, ClipboardList } from 'lucide-react';
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
import { openProTutorial } from '@/components/pro/ProSupportHost';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProSeasonOverview from '@/components/pro/ProSeasonOverview';
import { openProUpgradeMail } from '@/components/pro/proUpgradeMail';

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
  const {
    weddings,
    archivedWeddings,
    loading,
    selectWedding,
    canCreateMoreWeddings,
    accountType,
    setWeddingArchived,
  } = useWedding();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWedding, setEditingWedding] = useState<Wedding | null>(null);
  const [form, setForm] = useState<ProProfileForm>(emptyForm);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const handleOpenWedding = (weddingId: string, targetPath = '/dashboard') => {
    selectWedding(weddingId);
    navigate(targetPath);
  };

  const handleArchive = async (weddingId: string, archived: boolean) => {
    if (archived && !window.confirm(t('weddings.archiveConfirm'))) return;
    try {
      await setWeddingArchived(weddingId, archived);
      toast({ title: archived ? t('weddings.archiveDone') : t('weddings.restoreDone') });
    } catch (error) {
      console.error('❌ EspacePro: archivage impossible', error);
      toast({ title: t('weddings.archiveError'), variant: 'destructive' });
    }
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

  const isEnglish = i18n.language?.startsWith('en');
  const dateLocale = isEnglish ? 'en-GB' : 'fr-FR';
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const getDaysUntil = (date: string | null | undefined) =>
    date ? Math.ceil((new Date(date).getTime() - todayDate.getTime()) / 86400000) : null;

  const toolboxItems = [
    {
      icon: GraduationCap,
      title: isEnglish ? 'Tutorial & guide' : 'Tuto & guide',
      text: isEnglish ? 'Get started in 3 steps' : 'Prendre en main en 3 étapes',
      onClick: openProTutorial,
    },
    {
      icon: BookUser,
      title: t('nav.addressBook'),
      text: isEnglish ? 'Your trusted vendors' : 'Vos prestataires de confiance',
      onClick: () => navigate('/pro/carnet-adresses'),
    },
    {
      icon: Settings,
      title: isEnglish ? 'Account settings' : 'Paramètres du compte',
      text: isEnglish ? 'Agency details & offer' : 'Coordonnées agence & offre',
      onClick: () => setSettingsOpen(true),
    },
  ];

  return (
    <DashboardLayout variant="pro">
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* En-tête cockpit */}
        <header className="relative overflow-hidden bg-foreground text-background p-6 md:p-8">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-wedding-olive/40 blur-2xl" aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-none bg-wedding-olive text-background hover:bg-wedding-olive/90">
                <Building2 className="h-3 w-3 mr-1" />
                {t('header.badge')}
              </Badge>
              <span className="text-xs uppercase tracking-widest text-background/70">
                {todayDate.toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
            <h1 className="mt-4 font-serif text-3xl md:text-4xl font-bold">
              {form.first_name
                ? (isEnglish ? `Hello ${form.first_name}` : `Bonjour ${form.first_name}`)
                : t('header.title')}
            </h1>
            <p className="mt-2 text-background/80">
              {form.company_name ? `${form.company_name} · ` : ''}
              {isEnglish
                ? `${weddings.length} wedding${weddings.length > 1 ? 's' : ''} under your coordination`
                : `${weddings.length} mariage${weddings.length > 1 ? 's' : ''} en régie`}
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              disabled={!canCreateMoreWeddings && weddings.length > 0}
              className="mt-5 rounded-none min-h-[44px] bg-background text-foreground hover:bg-background/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('weddings.create')}
            </Button>
          </div>
        </header>

        {isProfileIncomplete && (
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="w-full text-left border border-l-4 border-l-wedding-olive border-border bg-background p-4 text-sm text-muted-foreground hover:text-foreground"
          >
            {t('header.incompleteProfile')} →
          </button>
        )}

        {!loading && <ProSeasonOverview weddings={weddings} />}

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
              {weddings.map((wedding) => {
                const daysUntil = getDaysUntil(wedding.wedding_date);
                const isSoon = daysUntil !== null && daysUntil >= 0 && daysUntil <= 30;
                return (
                <Card key={wedding.id} className="rounded-none border-border border-t-4 border-t-wedding-olive bg-background transition-shadow hover:shadow-lg">
                  <CardContent className="p-5">
                    {daysUntil !== null && daysUntil >= 0 && (
                      <span className={`inline-block mb-2 px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${isSoon ? 'bg-foreground text-background' : 'bg-wedding-olive/15 text-wedding-olive'}`}>
                        {daysUntil === 0 ? (isEnglish ? "Today's the day" : "C'est le Jour J") : `J-${daysUntil}`}
                      </span>
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-2xl font-bold text-foreground flex-1">{wedding.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-none h-8 w-8 shrink-0"
                        aria-label={t('weddings.edit')}
                        onClick={() => setEditingWedding(wedding)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-none h-8 w-8 shrink-0"
                        aria-label={t('weddings.archive')}
                        onClick={() => handleArchive(wedding.id, true)}
                      >
                        <Archive className="h-4 w-4" />
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
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="rounded-none min-h-[44px] border-wedding-olive/40 hover:bg-wedding-olive/10"
                        onClick={() => handleOpenWedding(wedding.id, '/mon-jour-m/planning')}
                      >
                        <ClipboardList className="h-4 w-4 mr-1.5 text-wedding-olive" />
                        {isEnglish ? 'Wedding day' : 'Planning Jour J'}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-none min-h-[44px] border-wedding-olive/40 hover:bg-wedding-olive/10"
                        onClick={() => handleOpenWedding(wedding.id, '/dashboard/rsvp')}
                      >
                        <Users className="h-4 w-4 mr-1.5 text-wedding-olive" />
                        {isEnglish ? 'Guests' : 'Invités'}
                      </Button>
                      <Button
                        className="col-span-2 rounded-none min-h-[44px]"
                        onClick={() => handleOpenWedding(wedding.id)}
                      >
                        {t('weddings.open')}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}

          {archivedWeddings.length > 0 && (
            <div className="mt-8">
              <h3 className="font-serif text-lg text-foreground mb-3">{t('weddings.archivedTitle')}</h3>
              <div className="space-y-2">
                {archivedWeddings.map((wedding) => (
                  <div
                    key={wedding.id}
                    className="flex flex-wrap items-center justify-between gap-3 border border-border bg-background p-4"
                  >
                    <div className="text-sm">
                      <p className="text-foreground">{wedding.title}</p>
                      <p className="text-muted-foreground">{t('weddings.archived')}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-none"
                      onClick={() => handleArchive(wedding.id, false)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {t('weddings.restore')}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Boîte à outils transverse */}
        <section aria-labelledby="pro-toolbox-title">
          <h2 id="pro-toolbox-title" className="font-serif text-2xl text-foreground mb-4">
            {isEnglish ? 'Toolbox' : 'Boîte à outils'}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {toolboxItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={item.onClick}
                className="group flex items-center gap-4 border border-border bg-background p-4 text-left min-h-[72px] transition-all hover:border-wedding-olive hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-wedding-olive/10 text-wedding-olive group-hover:bg-wedding-olive group-hover:text-background transition-colors">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">{item.title}</span>
                  <span className="block text-xs text-muted-foreground">{item.text}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="rounded-none max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{isEnglish ? 'Account settings' : 'Paramètres du compte'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
        <section id="mes-informations">
          <h3 className="font-serif text-lg text-foreground mb-3">{t('profile.title')}</h3>
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
        <section id="mon-offre">
          <h3 className="font-serif text-lg text-foreground mb-3">{t('offer.title')}</h3>
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
              <Button className="rounded-none" onClick={() => openProUpgradeMail(i18n.language?.startsWith('en'))}>
                {t('offer.cta')}
              </Button>
            </CardContent>
          </Card>
        </section>
          </div>
        </DialogContent>
      </Dialog>

      <NouveauMariageDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <ModifierMariageDialog wedding={editingWedding} onOpenChange={(open) => !open && setEditingWedding(null)} />
    </DashboardLayout>
  );
};

export default MesMariages;
