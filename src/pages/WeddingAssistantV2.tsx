
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import WeddingChatbot from '@/components/wedding-assistant/v2/WeddingChatbot';

// CSS to hide the header in the embedded Budget component
const embedStyles = `
  .budget-calculator-wrapper header {
    display: none !important;
  }
`;

const WeddingAssistantV2: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Conseils personnalisés | Mariable</title>
        <meta name="description" content="Conseils personnalisés pour votre mariage - Mariable" />
        <style>{embedStyles}</style>
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8 mb-16">
        <h1 className="text-3xl font-serif text-center mb-8">Conseils personnalisés pour votre mariage</h1>
        
        <Card>
          <CardContent className="pt-6">
            <WeddingChatbot preventScroll={true} />
          </CardContent>
        </Card>
      </main>

      <Footer />
    </>
  );
};

export default WeddingAssistantV2;
