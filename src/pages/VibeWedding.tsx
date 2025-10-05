import React from 'react';
import { Helmet } from 'react-helmet-async';
import VibeWeddingHeader from '@/components/VibeWeddingHeader';
import Footer from '@/components/Footer';
import VendorMatchingPanel from '@/components/vibe-wedding/VendorMatchingPanel';
import VendorMatchingChat from '@/components/vibe-wedding/VendorMatchingChat';
import { useVendorMatching } from '@/hooks/useVendorMatching';

const VibeWedding: React.FC = () => {
  const {
    messages,
    matchedVendors,
    isLoading,
    needsRegion,
    detectedCategory,
    sendMessage,
  } = useVendorMatching();

  return (
    <>
      <Helmet>
        <title>Vibe Wedding - Matching Intelligent de Prestataires | Mariable</title>
        <meta 
          name="description" 
          content="Trouvez les meilleurs prestataires pour votre mariage avec notre IA. Matching personnalisé selon vos critères et votre région." 
        />
      </Helmet>

      <VibeWeddingHeader />

      <div className="flex flex-col min-h-screen">
        <div className="flex h-[calc(100vh-64px)] mt-16 bg-background">
          {/* Gauche : Panneau de matching intelligent */}
          <div className="flex-1 overflow-hidden border-r border-border">
            <VendorMatchingPanel vendors={matchedVendors} />
          </div>

          {/* Droite : Chat conversationnel */}
          <div className="w-[420px] bg-card border-l border-border">
            <VendorMatchingChat
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              needsRegion={needsRegion}
              detectedCategory={detectedCategory}
            />
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default VibeWedding;
