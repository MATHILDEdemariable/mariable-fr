import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { FileText, Download, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { supabase } from '@/integrations/supabase/client';
import PremiumModal from '@/components/premium/PremiumModal';
import { GUIDES } from '@/data/guides';

const GuidesPage = () => {
  const { toast } = useToast();
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  const { executeAction, showPremiumModal, closePremiumModal, isPremium, feature, description } = usePremiumAction({
    feature: 'Guides PDF Premium',
    description: 'Téléchargez nos guides exclusifs pour organiser votre mariage parfait.'
  });

  const handleDownload = async (slug: string) => {
    executeAction(async () => {
      setDownloadingSlug(slug);
      try {
        const { data, error } = await supabase.functions.invoke('get-ebook-download-url', {
          body: { slug },
        });
        if (error || !data?.url) throw new Error(error?.message || 'Téléchargement impossible');
        window.open(data.url, '_blank');
      } catch (e) {
        toast({
          title: 'Erreur',
          description: (e as Error).message,
          variant: 'destructive',
        });
      } finally {
        setDownloadingSlug(null);
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Guides PDF - Mon Mariage</title>
        <meta name="description" content="Téléchargez nos guides pratiques pour votre mariage." />
      </Helmet>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Nos Guides PDF</h1>
          <p className="text-muted-foreground">
            {GUIDES.length} guides exclusifs — inclus dans votre abonnement Premium
          </p>
          {!isPremium && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg text-sm text-primary">
              <Lock className="h-4 w-4" />
              Fonctionnalité Premium — Passez Premium pour télécharger
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <Card key={guide.slug} className="hover:shadow-lg transition-shadow border border-border">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-muted text-foreground flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-serif">{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button
                  onClick={() => handleDownload(guide.slug)}
                  disabled={downloadingSlug === guide.slug}
                  className="w-full bg-primary hover:bg-primary/90 rounded-none"
                >
                  {!isPremium && <Lock className="h-4 w-4 mr-2" />}
                  <Download className="h-4 w-4 mr-2" />
                  {downloadingSlug === guide.slug ? 'Préparation…' : 'Télécharger'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted border border-border text-center">
          <p className="text-sm text-foreground">
            <strong>Note :</strong> Les guides s'ouvriront dans un nouvel onglet. Le lien est valable 1 heure — vous pouvez le régénérer à tout moment.
          </p>
        </div>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature={feature}
        description={description}
      />
    </>
  );
};

export default GuidesPage;
