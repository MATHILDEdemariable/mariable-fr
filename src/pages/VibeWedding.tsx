import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import VibeWeddingSidebar from '@/components/vibe-wedding/VibeWeddingSidebar';
import VibeWeddingChat from '@/components/vibe-wedding/VibeWeddingChat';
import VibeWeddingResultsImproved from '@/components/vibe-wedding/VibeWeddingResultsImproved';
import { useVibeWedding } from '@/hooks/useVibeWedding';

const VibeWedding: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    messages,
    project,
    isLoading,
    sendMessage,
    startNewProject,
    saveProjectToDashboard,
    promptCount,
    showAuthModal,
    setShowAuthModal,
    conversations,
    currentConversationId,
    loadConversation
  } = useVibeWedding();
  
  const [user, setUser] = React.useState<any>(null);
  
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleNewProject = () => {
    startNewProject();
    setIsSidebarOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Vibe Wedding - Créez votre projet de mariage avec l'IA | Mariable</title>
        <meta 
          name="description" 
          content="Créez votre projet de mariage personnalisé avec l'intelligence artificielle. Budget détaillé, rétroplanning et suggestions de prestataires en quelques minutes." 
        />
      </Helmet>

      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <VibeWeddingSidebar 
          onNewProject={handleNewProject}
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={loadConversation}
          isMobileOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          isNewProjectDisabled={!user && promptCount >= 1}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="font-serif font-bold text-lg">Vibe Wedding</h1>
            <div className="w-10" /> {/* Spacer pour centrer le titre */}
          </header>

          {/* Content area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Chat */}
            <div className={`flex-1 ${project ? 'hidden md:flex' : 'flex'}`}>
              <VibeWeddingChat 
                messages={messages}
                onSendMessage={sendMessage}
                isLoading={isLoading}
                promptCount={promptCount}
                showAuthModal={showAuthModal}
                setShowAuthModal={setShowAuthModal}
              />
            </div>

            {/* Results panel - apparaît après génération */}
            {project && (
              <div className="flex-1 md:flex-none">
                <VibeWeddingResultsImproved project={project} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VibeWedding;
