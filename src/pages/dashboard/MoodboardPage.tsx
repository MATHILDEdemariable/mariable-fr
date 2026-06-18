import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Palette, Download, RotateCcw, Sparkles, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMoodboard } from '@/hooks/useMoodboard';
import MoodboardUploader from '@/components/moodboard/MoodboardUploader';
import MoodboardCanvas from '@/components/moodboard/MoodboardCanvas';
import { generateMoodboardPdf } from '@/services/moodboardPdfService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { useAiUsageLimit } from '@/hooks/useAiUsageLimit';
import PremiumModal from '@/components/premium/PremiumModal';

const MoodboardPage: React.FC = () => {
  const { t } = useTranslation('weddingDay');
  const { toast } = useToast();
  const [coupleName, setCoupleName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const { executeAction, showPremiumModal, closePremiumModal, isPremium, feature, description } = usePremiumAction({
    feature: t('moodboard.premiumFeature'),
    description: t('moodboard.premiumDescription')
  });

  const { canUseFeature, recordUsage } = useAiUsageLimit();

  const {
    images,
    colors,
    ambiance,
    isAnalyzing,
    isGenerated,
    addImages,
    removeImage,
    analyzeColors,
    reset,
  } = useMoodboard();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, wedding_date')
          .eq('id', user.id)
          .single();

        if (profile) {
          if (profile.first_name || profile.last_name) {
            const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
            if (!coupleName) setCoupleName(name);
          }
          if (profile.wedding_date && !weddingDate) {
            setWeddingDate(profile.wedding_date);
          }
        }
      }
    };
    loadProfile();
  }, []);

  const [showPremiumLimitModal, setShowPremiumLimitModal] = useState(false);

  const handleGenerate = async () => {
    if (!canUseFeature('moodboard')) {
      setShowPremiumLimitModal(true);
      return;
    }
    const success = await analyzeColors();
    if (success) {
      if (!isPremium) {
        await recordUsage('moodboard');
      }
      setTimeout(() => {
        document.getElementById('moodboard-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleExportPdf = async () => {
    executeAction(async () => {
      setIsExporting(true);
      try {
        await generateMoodboardPdf({
          coupleName,
          weddingDate,
          images,
          colors,
          ambiance,
        });
        toast({
          title: t('moodboard.pdfSuccess'),
          description: t('moodboard.pdfSuccessDesc'),
        });
      } catch (error) {
        console.error('PDF export error:', error);
        toast({
          title: t('moodboard.pdfError'),
          description: t('moodboard.pdfErrorDesc'),
          variant: "destructive",
        });
      } finally {
        setIsExporting(false);
      }
    });
  };

  const handleReset = () => {
    reset();
    setCoupleName('');
    setWeddingDate('');
  };

  return (
    <>
      <Helmet>
        <title>{t('moodboard.pageTitle')}</title>
        <meta name="description" content={t('moodboard.pageDescription')} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-wedding-olive/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-wedding-olive" />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl">{t('moodboard.title')}</h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">{t('moodboard.subtitle')}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-none p-6 mb-6">
          <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-wedding-olive text-white text-sm flex items-center justify-center">1</span>
            {t('moodboard.step1')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="couple-name">{t('moodboard.coupleName')}</Label>
              <Input
                id="couple-name"
                placeholder={t('moodboard.coupleNamePlaceholder')}
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
                className="rounded-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wedding-date">{t('moodboard.weddingDate')}</Label>
              <Input
                id="wedding-date"
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="rounded-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-none p-6 mb-6">
          <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-wedding-olive text-white text-sm flex items-center justify-center">2</span>
            {t('moodboard.step2')}
          </h2>
          <MoodboardUploader
            images={images}
            onAddImages={addImages}
            onRemoveImage={removeImage}
            disabled={isAnalyzing}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-none p-6 mb-6">
          <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-wedding-olive text-white text-sm flex items-center justify-center">3</span>
            {t('moodboard.step3')}
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGenerate}
              disabled={images.length < 5 || isAnalyzing}
              className="flex-1 rounded-none bg-wedding-olive hover:bg-wedding-olive/90"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('moodboard.analyzing')}
                </>
              ) : (
                <>
                  {!canUseFeature('moodboard') && <Lock className="w-4 h-4 mr-2" />}
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('moodboard.generate')}
                  {!canUseFeature('moodboard') && <span className="ml-1 text-xs">{t('moodboard.premiumSuffix')}</span>}
                </>
              )}
            </Button>

            {(images.length > 0 || isGenerated) && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="rounded-none"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('moodboard.reset')}
              </Button>
            )}
          </div>

          {images.length < 5 && images.length > 0 && (
            <p className="text-sm text-amber-600 mt-3">
              {t('moodboard.addMore', { count: 5 - images.length })}
            </p>
          )}
        </div>

        {isGenerated && (
          <div id="moodboard-result" className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-none p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-medium text-lg">{t('moodboard.resultTitle')}</h2>
                <Button
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="rounded-none bg-primary hover:bg-primary/90"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('moodboard.exporting')}
                    </>
                  ) : (
                    <>
                      {!isPremium && <Lock className="w-4 h-4 mr-2" />}
                      <Download className="w-4 h-4 mr-2" />
                      {t('moodboard.downloadPdf')}
                    </>
                  )}
                </Button>
              </div>

              <MoodboardCanvas
                coupleName={coupleName}
                weddingDate={weddingDate}
                images={images}
                colors={colors}
                ambiance={ambiance}
              />
            </div>
          </div>
        )}
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature={feature}
        description={description}
      />

      <PremiumModal
        isOpen={showPremiumLimitModal}
        onClose={() => setShowPremiumLimitModal(false)}
        feature={t('moodboard.limitFeature')}
        description={t('moodboard.limitDescription')}
      />
    </>
  );
};

export default MoodboardPage;
