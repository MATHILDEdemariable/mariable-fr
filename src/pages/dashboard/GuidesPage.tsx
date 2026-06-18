import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FileText, Download, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';

const GuidesPage = () => {
  const { t } = useTranslation('weddingDay');
  const { toast } = useToast();
  const { executeAction, showPremiumModal, closePremiumModal, isPremium, feature, description } = usePremiumAction({
    feature: t('guides.premiumFeature'),
    description: t('guides.premiumDescription')
  });

  const guides = [
    { id: 'jour-j', titleKey: 'guides.items.jourJ.title', descKey: 'guides.items.jourJ.description', icon: FileText, pdfUrl: '/guide-jour-j', available: true },
    { id: 'debut-organisation', titleKey: 'guides.items.debut.title', descKey: 'guides.items.debut.description', icon: FileText, pdfUrl: '/guide-debutant', available: true },
    { id: 'prestataires', titleKey: 'guides.items.prestataires.title', descKey: 'guides.items.prestataires.description', icon: FileText, pdfUrl: '/guide-prestataires.pdf', available: true },
    { id: 'checklist-mariee', titleKey: 'guides.items.mariee.title', descKey: 'guides.items.mariee.description', icon: FileText, pdfUrl: '/guide-checklist-mariee.pdf', available: true },
    { id: 'checklist-proche', titleKey: 'guides.items.proche.title', descKey: 'guides.items.proche.description', icon: FileText, pdfUrl: '/guide-checklist-proche.pdf', available: true }
  ];

  const handleDownload = (guide: typeof guides[0]) => {
    if (!guide.available) {
      toast({
        title: t('guides.comingSoonTitle'),
        description: t('guides.comingSoonDesc'),
      });
      return;
    }
    executeAction(() => {
      window.open(guide.pdfUrl, '_blank');
    });
  };

  return (
    <>
      <Helmet>
        <title>{t('guides.pageTitle')}</title>
        <meta name="description" content={t('guides.pageDescription')} />
      </Helmet>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">{t('guides.title')}</h1>
          <p className="text-muted-foreground">{t('guides.subtitle')}</p>
          {!isPremium && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg text-sm text-primary">
              <Lock className="h-4 w-4" />
              {t('guides.premiumBadge')}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow border border-border">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-muted text-foreground flex items-center justify-center mx-auto mb-3">
                  <guide.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-serif">{t(guide.titleKey)}</CardTitle>
                <CardDescription>{t(guide.descKey)}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button
                  onClick={() => handleDownload(guide)}
                  className="w-full bg-primary hover:bg-primary/90 rounded-none"
                  disabled={!guide.available}
                >
                  {!isPremium && <Lock className="h-4 w-4 mr-2" />}
                  <Download className="h-4 w-4 mr-2" />
                  {guide.available ? t('guides.download') : t('guides.comingSoon')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted border border-border text-center">
          <p className="text-sm text-foreground">
            <strong>{t('guides.note')}</strong> {t('guides.noteDesc')}
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
