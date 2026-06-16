import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import ChecklistMariageManuelle from '@/components/dashboard/ChecklistMariageManuelle';
import ChecklistDixEtapes from '@/components/dashboard/ChecklistDixEtapes';
import ChecklistIntelligente from '@/components/dashboard/ChecklistIntelligente';
import { useIsMobile } from '@/hooks/use-mobile';
import { TutorialVideoModal } from '@/components/tutorials/TutorialVideoModal';

const ChecklistMariagePage: React.FC = () => {
  const { t } = useTranslation('checklist');
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('etapes');
  const [showTutorial, setShowTutorial] = useState(false);

  // Synchroniser avec les paramètres URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['etapes', 'manuelle', 'intelligente'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('page.title')}</h1>
            <p className="text-muted-foreground">
              {t('page.subtitle')}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {t('page.tutorial')}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="etapes"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white hover:bg-wedding-olive/20 hover:text-wedding-olive text-xs sm:text-sm"
            >
              {isMobile ? t('tabs.stepsShort') : t('tabs.stepsLong')}
            </TabsTrigger>
            <TabsTrigger 
              value="manuelle"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white hover:bg-wedding-olive/20 hover:text-wedding-olive text-xs sm:text-sm"
            >
              {isMobile ? t('tabs.manualShort') : t('tabs.manualLong')}
            </TabsTrigger>
            <TabsTrigger 
              value="intelligente"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white hover:bg-wedding-olive/20 hover:text-wedding-olive text-xs sm:text-sm"
            >
              {isMobile ? t('tabs.smartShort') : t('tabs.smartLong')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="etapes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('cards.stepsTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChecklistDixEtapes />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manuelle" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('cards.manualTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChecklistMariageManuelle />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="intelligente" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('cards.smartTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChecklistIntelligente />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TutorialVideoModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        videoId="checklist"
      />
    </>
  );
};

export default ChecklistMariagePage;