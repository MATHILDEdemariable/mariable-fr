
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
      content: "Bonjour et félicitations pour votre mariage ! Je suis Mathilde de Mariable, votre wedding planner digital. Pour vous recommander les meilleurs prestataires, dites-moi simplement dans quelle région se déroulera votre mariage et quel type de prestataire vous recherchez (lieu, photographe, traiteur...) 💍",
      timestamp: new Date()
    }
  ]);
  const [recommendations, setRecommendations] = useState<Record<string, VendorRecommendation[]>>({});
  const [inputValue, setInputValue] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
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
  }, [messages, recommendations, typingText]);

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

  const simulateTyping = (text: string, callback: (finalText: string) => void) => {
    setIsTyping(true);
    setTypingText('');
    
    let index = 0;
    const typingId = uuidv4();
    setTypingMessageId(typingId);
    
    const typeNextChar = () => {
      if (index < text.length && typingId === typingMessageId) {
        setTypingText(prev => prev + text.charAt(index));
        index++;
        
        // Random delay between 20ms and 50ms for more natural typing
        const randomDelay = Math.floor(Math.random() * 30) + 20;
        setTimeout(typeNextChar, randomDelay);
      } else if (typingId === typingMessageId) {
        setIsTyping(false);
        setTypingMessageId(null);
        callback(text);
      }
    };
    
    setTimeout(typeNextChar, 500); // Initial delay before typing starts
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
    
    if (isSimpleInput && messages.length === 1 && onFirstMessage) {
      onFirstMessage();
    }
    
    try {
      const response = await sendMessage([...messages, userMessage]);
      
      // Start typing animation
      simulateTyping(response.message, (finalText) => {
        const assistantMessage: MessageType = {
          id: uuidv4(),
          role: 'assistant',
          content: finalText,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        if (response.recommendations && response.recommendations.length > 0) {
          setRecommendations(prev => ({
            ...prev,
            [assistantMessage.id]: response.recommendations || []
          }));
        }
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de communiquer avec le service de chat. Veuillez réessayer.",
        variant: "destructive"
      });
      
      simulateTyping("Désolée, j'ai rencontré un problème technique. Pourriez-vous réessayer ?", (finalText) => {
        const errorMessage: MessageType = {
          id: uuidv4(),
          role: 'assistant',
          content: finalText,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitWithMessage(inputValue);
  };

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
            className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full py-4 md:py-6 pl-4 md:pl-6 text-sm md:text-base"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()} 
            className="bg-wedding-olive hover:bg-wedding-olive/90 text-white h-auto rounded-full p-2 md:py-2 md:px-4 mx-2"
            aria-label="Envoyer"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-12rem)] sm:h-[500px] flex flex-col bg-white rounded-xl overflow-hidden">
      <div className="p-3 md:p-4 bg-white border-b flex items-center justify-center">
        <p className="text-center text-base md:text-lg font-serif text-wedding-black">Mathilde de Mariable, votre wedding planner</p>
      </div>
      
      <div className="flex-grow p-0 relative overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full md:h-[400px] p-2 md:p-4">
          <div className="space-y-3 md:space-y-4">
            {messages.map((message) => (
              <Message 
                key={message.id} 
                message={message}
                recommendations={recommendations[message.id]} 
              />
            ))}
            
            {(isLoading || isTyping) && (
              <div className="flex w-full justify-start mb-3 md:mb-4">
                <Card className="chat-bubble-assistant p-2 md:p-3">
                  <CardContent className="p-0">
                    {isTyping ? (
                      <p className="text-sm md:text-base">{typingText}<span className="typing-dots"></span></p>
                    ) : (
                      <p className="typing-dots text-sm md:text-base">Mathilde réfléchit</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      <div className="p-2 md:p-3 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Continuez la conversation..."
            disabled={isLoading || isTyping}
            className="flex-grow text-sm md:text-base"
          />
          <Button 
            type="submit" 
            disabled={isLoading || isTyping || !inputValue.trim()} 
            className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
            aria-label="Envoyer"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
