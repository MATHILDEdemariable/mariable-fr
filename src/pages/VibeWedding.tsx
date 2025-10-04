import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleHeader from '@/components/SimpleHeader';
import VibeWeddingChat from '@/components/vibe-wedding/VibeWeddingChat';
import VibeWeddingResultsImproved from '@/components/vibe-wedding/VibeWeddingResultsImproved';
import { useVibeWedding } from '@/hooks/useVibeWedding';

const VibeWedding: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const {
    messages,
    project,
    isLoading,
    sendMessage,
    saveProjectToDashboard,
    promptCount,
    showAuthModal,
    setShowAuthModal,
  } = useVibeWedding();

  return (
    <>
      <Helmet>
        <title>Vibe Wedding - Créez votre projet de mariage avec l'IA | Mariable</title>
        <meta 
          name="description" 
          content="Créez votre projet de mariage personnalisé avec l'intelligence artificielle. Budget détaillé, rétroplanning et suggestions de prestataires en quelques minutes." 
        />
      </Helmet>

      <SimpleHeader />

      <div className="flex h-screen pt-16 bg-background overflow-hidden">
        {/* Zone principale - One Pager en full page */}
        <div className="flex-1 overflow-hidden">
          {!project ? (
            <VibeWeddingChat
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              promptCount={promptCount}
              showAuthModal={showAuthModal}
              setShowAuthModal={setShowAuthModal}
            />
          ) : (
            <VibeWeddingResultsImproved 
              project={project} 
              onSave={saveProjectToDashboard}
            />
          )}
        </div>

        {/* Chat latéral déroulant à droite - visible uniquement si projet généré */}
        {project && (
          <>
            {/* Bouton pour ouvrir le chat */}
            {!isChatOpen && (
              <Button
                onClick={() => setIsChatOpen(true)}
                className="fixed right-4 bottom-4 h-14 w-14 rounded-full shadow-lg bg-premium-sage hover:bg-premium-sage-dark z-50"
                size="icon"
              >
                <MessageSquare className="w-6 h-6" />
              </Button>
            )}

            {/* Panel chat latéral */}
            <div
              className={`fixed right-0 top-0 h-full bg-card border-l border-border shadow-2xl transition-transform duration-300 z-50 ${
                isChatOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{ width: '400px' }}
            >
              {/* Header du chat */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-premium-sage-very-light">
                <h3 className="font-semibold text-lg">Conversation</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsChatOpen(false)}
                  className="hover:bg-premium-sage/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Zone de chat */}
              <div className="h-[calc(100%-4rem)]">
                <VibeWeddingChat
                  messages={messages}
                  onSendMessage={sendMessage}
                  isLoading={isLoading}
                  promptCount={promptCount}
                  showAuthModal={showAuthModal}
                  setShowAuthModal={setShowAuthModal}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VibeWedding;
