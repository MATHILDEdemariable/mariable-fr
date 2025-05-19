
import React from 'react';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BriefContextProvider } from '@/components/wedding-assistant/BriefContext';
import WeddingAssistantDashboard from '@/components/wedding-assistant/WeddingAssistantDashboard';

const TestAssistantVirtuel: React.FC = () => {
  return (
    <>
      <SEO 
        title="Test Assistant Virtuel | Mariable"
        description="Assistant virtuel de planification de mariage - Mariable" 
      />

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif text-center mb-8">Assistant Virtuel de Planification</h1>
        
        <BriefContextProvider>
          <WeddingAssistantDashboard />
        </BriefContextProvider>
      </main>

      <Footer />
    </>
  );
};

export default TestAssistantVirtuel;
