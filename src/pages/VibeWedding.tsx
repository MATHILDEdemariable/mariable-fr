import React from 'react';
import { Helmet } from 'react-helmet-async';
import VibeWeddingChat from '@/components/vibe-wedding/VibeWeddingChat';
import VibeWeddingResultsImproved from '@/components/vibe-wedding/VibeWeddingResultsImproved';
import { useVibeWedding } from '@/hooks/useVibeWedding';

const VibeWedding: React.FC = () => {
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

      <div className="flex flex-col h-screen bg-background">
        {/* Chat zone - toujours visible en haut */}
        <div className={project ? "h-1/2 border-b border-border" : "h-full"}>
          <VibeWeddingChat 
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            promptCount={promptCount}
            showAuthModal={showAuthModal}
            setShowAuthModal={setShowAuthModal}
          />
        </div>

        {/* Results panel - apparaît en dessous une fois généré */}
        {project && (
          <div className="h-1/2 overflow-hidden">
            <VibeWeddingResultsImproved 
              project={project} 
              onSave={saveProjectToDashboard}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default VibeWedding;
