
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import WeddingQuiz from '@/components/wedding-assistant/v2/WeddingQuiz';
import BudgetCalculator from '@/components/wedding-assistant/v2/BudgetCalculator';
import WeddingChatbot from '@/components/wedding-assistant/v2/WeddingChatbot';
import { useIsMobile } from '@/hooks/use-mobile';

// CSS to hide the header in the embedded Budget component
const embedStyles = `
  .budget-calculator-wrapper header {
    display: none !important;
  }
`;

const WeddingAssistantV2: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('planning');
  const isMobile = useIsMobile();

  return (
    <>
      <Helmet>
        <title>Assistant Virtuel | Mariable</title>
        <meta name="description" content="Assistant virtuel de planification de mariage - Mariable" />
        <style>{embedStyles}</style>
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8 mb-16">
        <h1 className="text-3xl font-serif text-center mb-8">Assistant Virtuel de Planification</h1>
        
        <Tabs defaultValue="planning" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center w-full mb-8">
            <TabsList className={`${isMobile ? 'w-full' : 'max-w-2xl w-full mx-auto'}`}>
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-3'} w-full`}>
                <TabsTrigger value="planning" className="w-full">Planning</TabsTrigger>
                <TabsTrigger value="budget" className="w-full">Budget personnalisé</TabsTrigger>
                <TabsTrigger value="conseils" className="w-full">Conseils personnalisés</TabsTrigger>
              </div>
            </TabsList>
          </div>
          
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
                <BudgetCalculator showFullCalculator={true} />
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
