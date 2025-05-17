
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import WeddingQuiz from '@/components/wedding-assistant/v2/WeddingQuiz';
import BudgetCalculator from '@/components/wedding-assistant/v2/BudgetCalculator';
import WeddingChatbot from '@/components/wedding-assistant/v2/WeddingChatbot';

const WeddingAssistantV2: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('planning');

  return (
    <>
      <Helmet>
        <title>Assistant Virtuel | Mariable</title>
        <meta name="description" content="Assistant virtuel de planification de mariage - Mariable" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8 mb-16">
        <h1 className="text-3xl font-serif text-center mb-8">Assistant Virtuel de Planification</h1>
        
        <Tabs defaultValue="planning" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 w-full max-w-2xl mx-auto">
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="budget">Budget personnalisé</TabsTrigger>
            <TabsTrigger value="conseils">Conseils personnalisés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="planning">
            <Card>
              <CardContent className="pt-6">
                <WeddingQuiz />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="budget">
            <Card>
              <CardContent className="pt-6">
                <BudgetCalculator />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="conseils">
            <Card>
              <CardContent className="pt-6">
                <WeddingChatbot />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </>
  );
};

export default WeddingAssistantV2;
