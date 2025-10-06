import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Sparkles } from 'lucide-react';
import RegionSelector from './RegionSelector';
import CategorySelector from './CategorySelector';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  vendors?: any[];
}

interface VendorMatchingChatProps {
  messages: Message[];
  onSendMessage: (message: string, region?: string) => void;
  isLoading: boolean;
  needsRegion: boolean;
  needsCategory?: boolean;
  detectedCategory: string | null;
}

const VendorMatchingChat: React.FC<VendorMatchingChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  needsRegion,
  needsCategory = false,
  detectedCategory,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleRegionSelect = (region: string) => {
    onSendMessage(`Je cherche en ${region}`, region);
  };

  const handleCategorySelect = (category: string) => {
    onSendMessage(`Je cherche un ${category}`);
  };

  const quickPrompts = [
    "Je cherche un photographe",
    "Je veux un lieu champêtre",
    "Je cherche un traiteur",
    "Je veux un DJ",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 mb-4 rounded-full bg-wedding-olive/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-wedding-olive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Bienvenue sur Vibe Wedding
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Décrivez votre mariage et je vous proposerai les meilleurs prestataires !
            </p>
            
            <div className="space-y-2 w-full max-w-xs">
              <p className="text-xs text-muted-foreground mb-2">Essayez par exemple :</p>
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start"
                  onClick={() => {
                    setInput(prompt);
                    onSendMessage(prompt);
                  }}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-wedding-olive text-white'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Recherche en cours...</span>
                </div>
              </div>
            )}

            {needsCategory && !isLoading && (
              <div className="flex justify-center w-full">
                <CategorySelector onSelect={handleCategorySelect} />
              </div>
            )}

            {needsRegion && !isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4 max-w-full">
                  <p className="text-sm mb-3">Dans quelle région cherchez-vous ?</p>
                  <RegionSelector onSelectRegion={handleRegionSelect} />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Décrivez ce que vous cherchez..."
            className="min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="bg-wedding-olive hover:bg-wedding-olive/90 h-[80px] w-[80px]"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VendorMatchingChat;
