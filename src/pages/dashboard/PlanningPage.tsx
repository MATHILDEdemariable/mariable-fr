
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeddingQuiz from '@/components/wedding-assistant/v2/WeddingQuiz';
import PlanningResults from '@/components/dashboard/PlanningResults';

const PlanningPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif mb-2">Planning personnalisé</h1>
        <p className="text-muted-foreground">
          Créez votre planning de mariage adapté à votre niveau d'avancement
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
          <TabsTrigger value="planning">Mon Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Questionnaire personnalisé</CardTitle>
            </CardHeader>
            <CardContent>
              <WeddingQuiz />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="planning">
          <PlanningResults />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanningPage;
