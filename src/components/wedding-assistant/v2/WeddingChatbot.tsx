import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Calendar } from 'lucide-react';
import WeddingOrganizationChat from './WeddingOrganizationChat';
import WeddingVendorSearchChat from './WeddingVendorSearchChat';

interface WeddingChatbotProps {
  preventScroll?: boolean;
}

const WeddingChatbot: React.FC<WeddingChatbotProps> = ({ preventScroll }) => {
  const [activeMode, setActiveMode] = useState<'none' | 'organization' | 'vendor'>('none');

  if (activeMode === 'organization') {
    return (
      <WeddingOrganizationChat 
        preventScroll={preventScroll}
        onBack={() => setActiveMode('none')}
      />
    );
  }

  if (activeMode === 'vendor') {
    return (
      <WeddingVendorSearchChat 
        preventScroll={preventScroll}
        onBack={() => setActiveMode('none')}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 p-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif">Comment puis-je vous aider ?</h2>
        <p className="text-muted-foreground">
          Choisissez le mode qui correspond à vos besoins
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
  );
};

export default WeddingChatbot;
