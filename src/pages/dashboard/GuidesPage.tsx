import { Helmet } from 'react-helmet-async';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { supabase } from '@/integrations/supabase/client';
import PremiumModal from '@/components/premium/PremiumModal';
import { GUIDES, GUIDE_THEMES, type GuideTheme } from '@/data/guides';
import { GUIDE_IMAGES } from '@/data/guideImages';

const THEME_EMOJIS: Record<string, string> = {
  all: '📚', organisation: '📋', budget: '💰', prestataires: '🤝', ceremonie: '💒', mariee: '👰', temoins: '🥂',
};

const GuidesPage = () => {
  const { toast } = useToast();
  const { t } = useTranslation('guides');
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<GuideTheme | 'all'>('all');
  const filteredGuides = useMemo(
    () => (activeTheme === 'all' ? GUIDES : GUIDES.filter((guide) => guide.theme === activeTheme)),
    [activeTheme]
  );
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


        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[{ value: 'all', label: 'Tous' }, ...GUIDE_THEMES].map((theme) => (
            <button
              key={theme.value}
              type="button"
              onClick={() => setActiveTheme(theme.value as GuideTheme | 'all')}
              className={`px-4 py-2 min-h-[44px] text-xs uppercase tracking-[0.15em] border transition-colors shrink-0 whitespace-nowrap ${
                activeTheme === theme.value
                  ? 'bg-editorial-noir text-primary-foreground border-editorial-noir'
                  : 'bg-background text-editorial-noir border-editorial-noir/20 hover:border-editorial-noir'
              }`}
            >
              <span aria-hidden="true" className="mr-1">{THEME_EMOJIS[theme.value]}</span>{theme.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filteredGuides.map((guide) => (
            <article key={guide.slug} className="bg-background border border-editorial-noir/10 flex flex-col hover:shadow-md transition-shadow">
              <div className="aspect-square bg-editorial-beige border-b border-editorial-noir/10 flex flex-col items-center justify-between p-3 md:p-4 text-center overflow-hidden">
                <img
                  src={GUIDE_IMAGES[guide.slug]}
                  alt={`Illustration du guide ${guide.title}`}
                  loading="lazy"
                  width="520"
                  height="520"
                  className="w-full min-h-0 flex-1 object-contain"
                />
                <p className="uppercase tracking-[0.2em] text-[9px] text-editorial-olive mt-1 mb-1">
                  Mariable · PDF · <span aria-hidden="true">🇫🇷</span>
                </p>
                <h3 className="font-serif text-sm md:text-base text-editorial-noir leading-snug line-clamp-3">{guide.title}</h3>
              </div>
              <div className="p-3 md:p-4">
                <Button
                  onClick={() => handleDownload(guide.slug)}
                  disabled={downloadingSlug === guide.slug}
                  className="w-full bg-editorial-olive hover:bg-editorial-olive/90 rounded-none text-xs"
                >
                  {!isPremium ? <Lock className="h-3 w-3 mr-1" /> : <Download className="h-3 w-3 mr-1" />}
                  {downloadingSlug === guide.slug ? t('actions.preparing') : t('actions.download')}
                </Button>
              </div>
            </article>
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
