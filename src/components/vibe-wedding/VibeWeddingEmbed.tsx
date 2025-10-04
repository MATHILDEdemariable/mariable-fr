import React from 'react';
import VibeWeddingHero from './VibeWeddingHero';
import VibeWeddingChat from './VibeWeddingChat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  vendors?: any[];
  askLocation?: boolean;
  ctaSelection?: boolean;
  vendorCategory?: string;
}

interface VibeWeddingEmbedProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  promptCount: number;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const VibeWeddingEmbed: React.FC<VibeWeddingEmbedProps> = ({
  messages,
  onSendMessage,
  isLoading,
  promptCount,
  showAuthModal,
  setShowAuthModal
}) => {
  // Si aucun message, afficher le hero
  if (messages.length === 0) {
    return <VibeWeddingHero onStartConversation={onSendMessage} />;
  }

  // Sinon, afficher le chat complet
  return (
    <div className="h-full">
      <VibeWeddingChat
        messages={messages}
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        promptCount={promptCount}
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
      />
    </div>
  );
};

export default VibeWeddingEmbed;
