import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VibeWeddingHeader from '@/components/VibeWeddingHeader';
import Footer from '@/components/Footer';
import WeddingChatbot from '@/components/wedding-assistant/v2/WeddingChatbot';
import WeddingProjectPanel from '@/components/vibe-wedding/WeddingProjectPanel';
import { WeddingProjectProvider, useWeddingProject } from '@/contexts/WeddingProjectContext';

const VibeWeddingContent: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const { project } = useWeddingProject();

  return (
    <>
      <Helmet>
        <title>Vibe Wedding - Créez votre projet de mariage avec l'IA | Mariable</title>
        <meta 
          name="description" 
          content="Créez votre projet de mariage personnalisé avec l'intelligence artificielle. Budget détaillé, rétroplanning et suggestions de prestataires en quelques minutes." 
        />
      </Helmet>

      <VibeWeddingHeader />

      <div className="flex flex-col min-h-screen">
        <div className="flex h-[calc(100vh-64px)] mt-16 bg-background overflow-hidden">
          {!project ? (
            /* Mode initial - Chatbot centré */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-4xl">
                <WeddingChatbot preventScroll={false} />
              </div>
            </div>
          ) : (
            /* Mode projet actif - Split view */
            <>
              {/* Gauche : Projet */}
              <div className="flex-1 overflow-hidden border-r border-border">
                <WeddingProjectPanel />
              </div>

              {/* Droite : Chatbot en sidebar */}
              <div
                className={`fixed right-0 top-16 h-[calc(100vh-64px)] bg-card border-l border-border shadow-2xl transition-all duration-300 z-40 ${
                  isChatOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{ width: '480px' }}
              >
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                  <h3 className="font-semibold text-base">💬 Assistant Mariage</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsChatOpen(false)}
                    className="hover:bg-muted"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="h-[calc(100%-4rem)]">
                  <WeddingChatbot preventScroll={true} />
                </div>
              </div>

              {!isChatOpen && (
                <Button
                  onClick={() => setIsChatOpen(true)}
                  className="fixed right-6 bottom-6 h-14 w-14 rounded-full shadow-lg bg-wedding-olive hover:bg-wedding-olive/90 z-50"
                  size="icon"
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </Button>
              )}
            </>
          )}
        </div>
        
        <Footer />
      </div>
    </>
  );
};

const VibeWedding: React.FC = () => {
  return (
    <WeddingProjectProvider>
      <VibeWeddingContent />
    </WeddingProjectProvider>
  );
};

export default VibeWedding;
