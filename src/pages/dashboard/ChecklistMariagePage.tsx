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
        <title>Check-list Mariage | Mariable</title>
        <meta name="description" content="Gérez votre check-list de mariage avec nos outils interactifs" />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Check-list Mariage</h1>
            <p className="text-muted-foreground">
              Organisez votre mariage avec nos outils de check-list
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Tuto vidéo
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="etapes"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white hover:bg-wedding-olive/20 hover:text-wedding-olive text-xs sm:text-sm"
            >
              {isMobile ? '10 Étapes' : 'En 10 étapes'}
            </TabsTrigger>
            <TabsTrigger 
              value="manuelle"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white hover:bg-wedding-olive/20 hover:text-wedding-olive text-xs sm:text-sm"
            >
              {isMobile ? 'Manuelle' : 'Check-list manuelle'}
            </TabsTrigger>
            <TabsTrigger 
              value="intelligente"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white hover:bg-wedding-olive/20 hover:text-wedding-olive text-xs sm:text-sm"
            >
              {isMobile ? 'IA' : 'Check-list intelligente'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="etapes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Checklist en 10 étapes essentielles</CardTitle>
              </CardHeader>
              <CardContent>
                <ChecklistDixEtapes />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manuelle" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Checklist personnalisable</CardTitle>
              </CardHeader>
              <CardContent>
                <ChecklistMariageManuelle />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="intelligente" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Checklist générée par IA</CardTitle>
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