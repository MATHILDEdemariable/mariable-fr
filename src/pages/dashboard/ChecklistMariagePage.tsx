import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChecklistMariageManuelle from '@/components/dashboard/ChecklistMariageManuelle';
import ChecklistWidget from '@/components/dashboard/ChecklistWidget';

const ChecklistMariagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('etapes');

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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="etapes">En 10 étapes</TabsTrigger>
            <TabsTrigger value="manuelle">Check-list manuelle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="etapes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Checklist en 10 étapes essentielles</CardTitle>
              </CardHeader>
              <CardContent>
                <ChecklistWidget />
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
        </Tabs>
      </div>
    </>
  );
};

export default ChecklistMariagePage;