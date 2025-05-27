
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeddingQuiz from '@/components/wedding-assistant/v2/WeddingQuiz';
import PlanningResults from '@/components/dashboard/PlanningResults';
import { usePersistentQuiz } from '@/hooks/usePersistentQuiz';

const PlanningPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const { quizData, loading } = usePersistentQuiz();

  // Auto-switch to results tab if quiz is completed
  useEffect(() => {
    if (quizData?.completed && activeTab === "tasks") {
      setActiveTab("planning");
    }
  }, [quizData?.completed, activeTab]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif mb-2">Planning personnalisé</h1>
          <p className="text-muted-foreground">
            Chargement de vos données...
          </p>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-olive"></div>
        </div>
      </div>
    );
  }

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
