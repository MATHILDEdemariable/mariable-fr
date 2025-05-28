
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeddingQuiz from '@/components/wedding-assistant/v2/WeddingQuiz';
import PlanningResults from '@/components/dashboard/PlanningResults';
import { usePersistentQuiz } from '@/hooks/usePersistentQuiz';

const PlanningPage: React.FC = () => {
  const { quizData, loading } = usePersistentQuiz();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif mb-2">Questionnaire Planning</h1>
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
        <h1 className="text-3xl font-serif mb-2">Questionnaire Planning</h1>
        <p className="text-muted-foreground">
          Créez votre planning de mariage adapté à votre niveau d'avancement
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Questionnaire personnalisé</CardTitle>
        </CardHeader>
        <CardContent>
          <WeddingQuiz />
        </CardContent>
      </Card>
      
      {/* Show planning results if quiz is completed */}
      {quizData?.completed && (
        <div className="mt-8">
          <h2 className="text-2xl font-serif mb-4">Votre Planning Personnalisé</h2>
          <PlanningResults />
        </div>
      )}
    </div>
  );
};

export default PlanningPage;
