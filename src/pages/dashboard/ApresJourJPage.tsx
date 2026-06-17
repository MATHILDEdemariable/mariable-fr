import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePremiumAction } from "@/hooks/usePremiumAction";
import PremiumModal from "@/components/premium/PremiumModal";
import ApresJourJManuelle from '@/components/dashboard/ApresJourJManuelle';

const ApresJourJPage: React.FC = () => {
  const { t } = useTranslation('weddingDay');
  const [activeTab, setActiveTab] = useState('manuelle');
  const { showPremiumModal, closePremiumModal } = usePremiumAction({
    feature: t('apresJourJ.premiumFeature'),
    description: t('apresJourJ.subtitle')
  });

  return (
    <>
      <Helmet>
        <title>{t('apresJourJ.pageTitle')}</title>
        <meta name="description" content={t('apresJourJ.pageDescription')} />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('apresJourJ.title')}</h1>
          <p className="text-muted-foreground">{t('apresJourJ.subtitle')}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-auto">
            <TabsTrigger value="manuelle">{t('apresJourJ.tabManual')}</TabsTrigger>
          </TabsList>

          <TabsContent value="manuelle" className="space-y-6">
            <ApresJourJManuelle />
          </TabsContent>
        </Tabs>

        <PremiumModal
          isOpen={showPremiumModal}
          onClose={closePremiumModal}
          feature={t('apresJourJ.premiumFeature')}
        />
      </div>
    </>
  );
};

export default ApresJourJPage;
