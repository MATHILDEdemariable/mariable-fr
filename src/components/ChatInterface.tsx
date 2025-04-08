
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizontal } from 'lucide-react';
import { Message as MessageType, VendorRecommendation } from '@/types';
import Message from './Message';
import { sendMessage } from '@/services/chatService';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  isSimpleInput?: boolean;
  onFirstMessage?: () => void;
  initialMessage?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isSimpleInput = false, 
  onFirstMessage,
  initialMessage
}) => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Bonjour ! Je suis Mathilde de Mariable, votre wedding planner. Dites oui à la simplicité et dites-nous ce dont vous avez besoin ou quel est le mariage parfait pour vous ! 💍",
      timestamp: new Date()
    }
  ]);
  const [recommendations, setRecommendations] = useState<Record<string, VendorRecommendation[]>>({});
  const [inputValue, setInputValue] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, recommendations]);

  // Process initial message if provided
  useEffect(() => {
    if (initialMessage && !isSimpleInput && !hasProcessedInitialMessage) {
      setHasProcessedInitialMessage(true);
      handleSubmitWithMessage(initialMessage);
    }
  }, [initialMessage, isSimpleInput]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  };

  const handleSubmitWithMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;
    
    const userMessage: MessageType = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    scrollToBottom();
    
    // If this is the first message and we're in simple input mode, call the onFirstMessage callback
    if (isSimpleInput && messages.length === 1 && onFirstMessage) {
      onFirstMessage();
    }
    
    try {
      const response = await sendMessage([...messages, userMessage]);
      
      const assistantMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.recommendations && response.recommendations.length > 0) {
        setRecommendations(prev => ({
          ...prev,
          [assistantMessage.id]: response.recommendations || []
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de communiquer avec le service de chat. Veuillez réessayer.",
        variant: "destructive"
      });
      
      const errorMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: "Désolée, j'ai rencontré un problème. Pourriez-vous réessayer ?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitWithMessage(inputValue);
  };

  // Return different UI based on isSimpleInput prop
  if (isSimpleInput) {
    return (
      <div className="w-full rounded-full overflow-hidden shadow-md bg-white">
        <form onSubmit={handleSubmit} className="flex w-full items-center">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Décrivez votre mariage idéal ou ce que vous recherchez..."
            disabled={isLoading}
            className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full py-6 pl-6"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()} 
            className="bg-wedding-olive hover:bg-wedding-olive/90 text-white h-auto rounded-full py-2 px-4 mx-2"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    );
  }

  // Full chatbot interface
  return (
    <div className="w-full h-[500px] flex flex-col bg-white rounded-xl overflow-hidden">
      <div className="p-4 bg-white border-b flex items-center justify-center">
        <p className="text-center text-lg font-serif text-wedding-black">Mathilde de Mariable, votre wedding planner</p>
      </div>
      
      <div className="flex-grow p-0 relative overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <Message 
                key={message.id} 
                message={message}
                recommendations={recommendations[message.id]} 
              />
            ))}
            
            {isLoading && (
              <div className="flex w-full justify-start mb-4">
                <Card className="chat-bubble-assistant p-3">
                  <CardContent className="p-0">
                    <p className="typing-dots">Mathilde réfléchit</p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      <div className="p-3 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Continuez la conversation..."
            disabled={isLoading}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()} className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
