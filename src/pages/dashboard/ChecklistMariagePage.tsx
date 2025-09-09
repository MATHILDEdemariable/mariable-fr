import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChecklistMariageManuelle from '@/components/dashboard/ChecklistMariageManuelle';
import ChecklistDixEtapes from '@/components/dashboard/ChecklistDixEtapes';
import ChecklistIntelligente from '@/components/dashboard/ChecklistIntelligente';

const ChecklistMariagePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('etapes');

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
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Check-list Mariage</h1>
          <p className="text-muted-foreground">
            Organisez votre mariage avec nos outils de check-list
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="etapes"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white hover:bg-wedding-olive/20 hover:text-wedding-olive"
            >
              En 10 étapes
            </TabsTrigger>
            <TabsTrigger 
              value="manuelle"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white hover:bg-wedding-olive/20 hover:text-wedding-olive"
            >
              Check-list manuelle
            </TabsTrigger>
            <TabsTrigger 
              value="intelligente"
              className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white hover:bg-wedding-olive/20 hover:text-wedding-olive"
            >
              Check-list intelligente
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
    </>
  );
};

export default ChecklistMariagePage;