import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { supabase } from '@/integrations/supabase/client';
import PremiumModal from '@/components/premium/PremiumModal';
import { GUIDES } from '@/data/guides';

const GuidesPage = () => {
  const { toast } = useToast();
  const { t } = useTranslation('guides');
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  const { executeAction, showPremiumModal, closePremiumModal, isPremium, feature, description } = usePremiumAction({
    feature: t('premium.feature'),
    description: t('premium.description')
  });

  const handleDownload = async (slug: string) => {
    executeAction(async () => {
      setDownloadingSlug(slug);
      try {
        const { data, error } = await supabase.functions.invoke('get-ebook-download-url', {
          body: { slug },
        });
        if (error || !data?.url) throw new Error(error?.message || t('toast.downloadError'));

        const response = await fetch(data.url);
        if (!response.ok) throw new Error(t('toast.pdfUnavailable'));

        const pdfBlob = await response.blob();
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = `${slug}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
        URL.revokeObjectURL(downloadUrl);
      } catch (e) {
        toast({
          title: t('toast.errorTitle'),
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
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">{t('page.title')}</h1>
          <p className="text-muted-foreground">
            {t('page.subtitle', { count: GUIDES.length })}
          </p>
          {!isPremium && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg text-sm text-primary">
              <Lock className="h-4 w-4" />
              {t('page.premiumLock')}
            </div>
          )}
        </div>

        <p className="mb-8 text-sm text-muted-foreground flex items-center justify-center gap-2">
          <span aria-hidden="true">🇫🇷</span>
          {t('language.notice')}
        </p>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <Card key={guide.slug} className="hover:shadow-lg transition-shadow border border-border">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-muted text-foreground flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="mx-auto mb-2 rounded-none gap-1 font-normal">
                  <span aria-hidden="true">🇫🇷</span>
                  {t('language.badge')}
                </Badge>
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
                  {downloadingSlug === guide.slug ? t('actions.preparing') : t('actions.download')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted border border-border text-center">
          <p className="text-sm text-foreground">
            <strong>{t('page.note')}</strong> {t('page.noteText')}
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
