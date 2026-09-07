import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, CalendarDays, MapPin, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWedding } from '@/contexts/WeddingContext';
import NouveauMariageDialog from '@/components/pro/NouveauMariageDialog';

const MesMariages: React.FC = () => {
  const navigate = useNavigate();
  const { weddings, loading, selectWedding, canCreateMoreWeddings, accountType } = useWedding();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = (weddingId: string) => {
    selectWedding(weddingId);
    navigate('/dashboard');
  };

  return (
    <>
      <Helmet>
        <title>Mes mariages | Mariable</title>
        <meta name="description" content="Gérez tous vos mariages depuis un seul espace professionnel." />
      </Helmet>

      <div className="min-h-screen bg-[#F8F5EF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl text-foreground">Mes mariages</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Ouvrez un mariage pour retrouver tous vos outils dans son contexte.
              </p>
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              disabled={!canCreateMoreWeddings && weddings.length > 0}
              className="rounded-none"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau mariage
            </Button>
          </div>

          {accountType === 'b2b' && !canCreateMoreWeddings && weddings.length > 0 && (
            <div className="mb-6 border border-border bg-background p-4 flex items-start gap-3">
              <Lock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Votre compte inclut un mariage. Pour en gérer plusieurs sans limite, passez à l'offre
                professionnelle.{' '}
                <button className="underline" onClick={() => navigate('/partenariat')}>
                  Découvrir l'offre
                </button>
              </p>
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
                    <h2 className="font-serif text-xl text-foreground">{wedding.title}</h2>
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
                    </div>
                    <Button
                      variant="outline"
                      className="mt-5 rounded-none w-full"
                      onClick={() => handleOpen(wedding.id)}
                    >
                      Ouvrir
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <NouveauMariageDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default MesMariages;
