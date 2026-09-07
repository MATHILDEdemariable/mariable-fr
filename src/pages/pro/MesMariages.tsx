import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, CalendarDays, MapPin, Users, ArrowRight, Building2, Crown, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useWedding } from '@/contexts/WeddingContext';
import NouveauMariageDialog from '@/components/pro/NouveauMariageDialog';

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
  const { weddings, loading, selectWedding, canCreateMoreWeddings, accountType } = useWedding();
  const [dialogOpen, setDialogOpen] = useState(false);
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

      toast({ title: 'Informations enregistrées' });
    } catch (error) {
      console.error('❌ EspacePro: enregistrement impossible', error);
      toast({
        title: 'Enregistrement impossible',
        description: 'Vos informations n’ont pas pu être enregistrées. Réessayez dans un instant.',
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
        <title>Espace professionnel | Mariable</title>
        <meta name="description" content="Gérez tous vos mariages depuis votre espace professionnel Mariable." />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* En-tête */}
        <header>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl text-foreground">Espace professionnel</h1>
            <Badge className="bg-wedding-olive text-white hover:bg-wedding-olive/90">
              <Building2 className="h-3 w-3 mr-1" />
              Compte pro
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {form.company_name
              ? form.company_name
              : 'Vos projets mariage, chacun avec ses propres outils.'}
          </p>
        </header>

        {isProfileIncomplete && (
          <div className="border border-border bg-background p-4 text-sm text-muted-foreground">
            Complétez vos informations ci-dessous pour personnaliser votre espace et vos documents.
          </div>
        )}

        {/* Mes mariages */}
        <section id="mes-mariages" className="scroll-mt-32">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="font-serif text-2xl text-foreground">Mes mariages</h2>
            <Button
              onClick={() => setDialogOpen(true)}
              disabled={!canCreateMoreWeddings && weddings.length > 0}
              className="rounded-none"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer un mariage
            </Button>
          </div>

          {accountType === 'b2b' && !canCreateMoreWeddings && weddings.length > 0 && (
            <div className="mb-4 border border-border bg-background p-4 text-sm text-muted-foreground">
              Votre compte inclut un mariage. Pour en gérer plusieurs sans limite, passez au compte pro.{' '}
              <button className="underline" onClick={() => navigate('/partenariat#mariable-pro')}>
                Découvrir l’offre
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
                <p className="text-muted-foreground mb-4">Aucun mariage pour le moment.</p>
                <Button onClick={() => setDialogOpen(true)} className="rounded-none">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer mon premier mariage
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {weddings.map((wedding) => (
                <Card key={wedding.id} className="rounded-none border-border bg-background">
                  <CardContent className="p-5">
                    <h3 className="font-serif text-xl text-foreground">{wedding.title}</h3>
                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {wedding.wedding_date && (
                        <p className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(wedding.wedding_date).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                      {wedding.wedding_location && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {wedding.wedding_location}
                        </p>
                      )}
                      {wedding.guest_count ? (
                        <p className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {wedding.guest_count} invités
                        </p>
                      ) : null}
                    </div>
                    <Button
                      variant="outline"
                      className="mt-5 rounded-none w-full"
                      onClick={() => handleOpenWedding(wedding.id)}
                    >
                      Ouvrir
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
          <h2 className="font-serif text-2xl text-foreground mb-4">Mes informations</h2>
          <Card className="rounded-none border-border bg-background">
            <CardContent className="p-5">
              <form onSubmit={handleSaveProfile} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="pro-first-name">Prénom</Label>
                  <Input
                    id="pro-first-name"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pro-last-name">Nom</Label>
                  <Input
                    id="pro-last-name"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pro-company">Société</Label>
                  <Input
                    id="pro-company"
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pro-phone">Téléphone</Label>
                  <Input
                    id="pro-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="pro-city">Ville</Label>
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
                    {savingProfile ? 'Enregistrement…' : 'Enregistrer'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Mon offre */}
        <section id="mon-offre" className="scroll-mt-32">
          <h2 className="font-serif text-2xl text-foreground mb-4">Mon offre</h2>
          <Card className="rounded-none border-border bg-background">
            <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-foreground flex items-center gap-2">
                  <Crown className="h-4 w-4 text-wedding-olive" />
                  Compte Pro Mariable
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Mariages illimités, tous les modules débloqués pour chaque projet et visibilité sur la sélection Mariable.
                </p>
              </div>
              <Button className="rounded-none" onClick={() => navigate('/partenariat#mariable-pro')}>
                Passer au compte pro
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      <NouveauMariageDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </DashboardLayout>
  );
};

export default MesMariages;
