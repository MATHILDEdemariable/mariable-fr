import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAIChat } from '@/hooks/useAIChat';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import WelcomePrompts from './WelcomePrompts';
import UsageLimitBanner from './UsageLimitBanner';
import UpgradeModal from './UpgradeModal';
import AIWeddingOnePager from './AIWeddingOnePager';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  onePager?: any;
  vendors?: any[];
}

const ConversationInterface: React.FC = () => {
  const { user } = useAuth();
  const { sendMessage, isLoading } = useAIChat();
  const { usageInfo, refreshUsage } = useUsageLimits();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [canGeneratePlan, setCanGeneratePlan] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Activer le bouton après 2 messages
    setCanGeneratePlan(messages.length >= 2);
  }, [messages]);

  const handleSendMessage = async (shouldGeneratePlan = false) => {
    if (!input.trim() || isLoading) return;

    if (usageInfo?.limitReached) {
      setShowUpgradeModal(true);
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await sendMessage(input.trim(), messages, shouldGeneratePlan);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        onePager: response.onePager,
        vendors: response.vendors
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      await refreshUsage();

      if (response.usageInfo?.limitReached) {
        setShowUpgradeModal(true);
      }

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      if (error.message?.includes('LIMIT_REACHED')) {
        setShowUpgradeModal(true);
      } else {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Je rencontre une difficulté technique. Pouvez-vous réessayer ?',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  const handleGeneratePlan = () => {
    if (!input.trim()) {
      setInput("Génère-moi un plan complet pour mon mariage");
    }
    handleSendMessage(true);
  };

  const handleWelcomePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {usageInfo && (
        <UsageLimitBanner 
          remaining={usageInfo.remaining}
          maxPrompts={usageInfo.maxPrompts}
          isAuthenticated={!!user}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-serif text-wedding-olive mb-4">
                Votre mariage commence ici
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Décrivez votre projet et recevez instantanément des conseils personnalisés,
                un planning détaillé et des suggestions de prestataires adaptés.
              </p>
              <WelcomePrompts onPromptClick={handleWelcomePromptClick} />
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map(message => (
                <div key={message.id}>
                  <MessageBubble message={message} />
                  {message.onePager && (
                    <AIWeddingOnePager 
                      data={message.onePager} 
                      vendors={message.vendors || []} 
                    />
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">L'assistant réfléchit...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="border-t bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {canGeneratePlan && !messages.some(m => m.onePager) && (
            <div className="mb-3 text-center">
              <Button 
                onClick={handleGeneratePlan}
                className="bg-wedding-olive hover:bg-wedding-olive/90"
                disabled={isLoading || usageInfo?.limitReached}
              >
                ✨ Générer mon plan de mariage
              </Button>
            </div>
          )}
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => handleSendMessage(false)}
            disabled={isLoading || usageInfo?.limitReached}
            placeholder={
              usageInfo?.limitReached
                ? "Limite atteinte - Créez un compte pour continuer"
                : "Décrivez votre projet de mariage..."
            }
          />
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        requiresAuth={usageInfo?.requiresAuth}
        requiresPremium={usageInfo?.requiresPremium}
      />
    </div>
  );
};

export default ConversationInterface;