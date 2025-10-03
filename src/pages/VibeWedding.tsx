import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VibeWeddingSidebar from '@/components/vibe-wedding/VibeWeddingSidebar';
import VibeWeddingChat from '@/components/vibe-wedding/VibeWeddingChat';
import VibeWeddingResults from '@/components/vibe-wedding/VibeWeddingResults';
import { useVibeWedding } from '@/hooks/useVibeWedding';

const VibeWedding: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { messages, project, isLoading, sendMessage, startNewProject } = useVibeWedding();

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
          isMobileOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
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
              />
            </div>

            {/* Results panel - apparaît après génération */}
            {project && (
              <div className="flex-1 md:flex-none">
                <VibeWeddingResults project={project} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VibeWedding;
