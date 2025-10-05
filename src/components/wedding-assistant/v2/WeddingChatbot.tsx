import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Calendar, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import WeddingOrganizationChat from './WeddingOrganizationChat';
import WeddingVendorSearchChat from './WeddingVendorSearchChat';
import { useWeddingProject } from '@/contexts/WeddingProjectContext';

interface WeddingChatbotProps {
  preventScroll?: boolean;
}

const WeddingChatbot: React.FC<WeddingChatbotProps> = ({ preventScroll }) => {
  const [activeMode, setActiveMode] = useState<'none' | 'organization' | 'vendor'>('none');
  const { project } = useWeddingProject();

  const handleBack = () => {
    setActiveMode('none');
  };

  return (
    <div className="flex flex-col h-full">
      {activeMode === 'none' ? (
        <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
          {project && (
            <div className="w-full max-w-md mb-4">
              <Badge variant="outline" className="w-full justify-center py-2">
                ✅ Projet en cours
              </Badge>
            </div>
          )}
          
          <div className="text-center mb-4">
            <h2 className="text-2xl font-serif mb-2">Comment puis-je vous aider ?</h2>
            <p className="text-muted-foreground">
              Choisissez le type d'assistance dont vous avez besoin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            <Button
              onClick={() => setActiveMode('organization')}
              className="h-auto flex flex-col items-center gap-3 p-6 bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Calendar className="w-8 h-8" />
              <div className="text-center">
                <div className="font-semibold text-lg">Organisation Mariage</div>
                <div className="text-sm opacity-90 mt-1">
                  Budget, planning, timeline, conseils
                </div>
              </div>
            </Button>

            <Button
              onClick={() => setActiveMode('vendor')}
              className="h-auto flex flex-col items-center gap-3 p-6 bg-secondary hover:bg-secondary/90"
              size="lg"
            >
              <Search className="w-8 h-8" />
              <div className="text-center">
                <div className="font-semibold text-lg">Recherche Prestataires</div>
                <div className="text-sm opacity-90 mt-1">
                  Trouver des pros pour votre mariage
                </div>
              </div>
            </Button>
          </div>
        </div>
      ) : activeMode === 'organization' ? (
        <WeddingOrganizationChat 
          preventScroll={preventScroll}
          onBack={handleBack}
        />
      ) : (
        <WeddingVendorSearchChat 
          preventScroll={preventScroll}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default WeddingChatbot;
