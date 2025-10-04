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

      <div className="flex h-[calc(100vh-64px)] mt-16 bg-background overflow-hidden">
        {/* Layout conditionnel basé sur l'existence du projet */}
        {!project ? (
          /* Mode Chat uniquement - Full page */
          <div className="flex-1 overflow-hidden">
            <VibeWeddingChat
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              promptCount={promptCount}
              showAuthModal={showAuthModal}
              setShowAuthModal={setShowAuthModal}
            />
          </div>
        ) : (
          /* Mode Projet + Chat - Split view uniforme */
          <>
            {/* Gauche : Projet (always visible when exists) */}
            <div className="flex-1 overflow-hidden border-r border-border">
              <VibeWeddingResultsImproved 
                project={project} 
                onSave={saveProjectToDashboard}
              />
            </div>

            {/* Droite : Conversation en sidebar fixe */}
            <div
              className={`fixed right-0 top-16 h-[calc(100vh-64px)] bg-card border-l border-border shadow-2xl transition-all duration-300 z-40 ${
                isChatOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{ width: '420px' }}
            >
              {/* Header du chat */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <h3 className="font-semibold text-base">💬 Conversation</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsChatOpen(false)}
                  className="hover:bg-muted"
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

            {/* Bouton flottant pour ouvrir le chat si fermé */}
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
    </>
  );
};

export default VibeWedding;
