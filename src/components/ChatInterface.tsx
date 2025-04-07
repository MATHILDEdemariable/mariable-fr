
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

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Bonjour ! Je suis Mathilde de Mariable, votre wedding planner. Dites oui à la simplicité et dites-nous ce dont vous avez besoin ou quel est le mariage parfait pour vous ! 💍",
      timestamp: new Date()
    }
  ]);
  const [recommendations, setRecommendations] = useState<Record<string, VendorRecommendation[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: MessageType = {
      id: uuidv4(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Directly get recommendations based on the user's first message
      const response = await sendMessage([...messages, userMessage]);
      
      const assistantMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Add recommendations if they exist
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

  // Insert global styles directly in the component
  useEffect(() => {
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      .chat-bubble-user {
        background-color: #E1F5FE;
        border-radius: 18px 18px 0 18px;
        border: none;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      
      .chat-bubble-assistant {
        background-color: #F9F9F9;
        border-radius: 18px 18px 18px 0;
        border: none;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      
      .typing-dots:after {
        content: '.';
        animation: dots 1.5s steps(5, end) infinite;
      }
      
      @keyframes dots {
        0%, 20% { content: '.'; }
        40% { content: '..'; }
        60% { content: '...'; }
        80%, 100% { content: ''; }
      }
      
      .animate-fade-in {
        animation: fadeIn 0.3s ease-in;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .vendor-card {
        transition: transform 0.2s ease-in-out;
      }
      
      .vendor-card:hover {
        transform: translateY(-2px);
      }
    `;
    
    // Append to head
    document.head.appendChild(styleEl);
    
    // Cleanup
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="w-full h-[500px] flex flex-col bg-white">
      <div className="p-4 bg-white border-b flex items-center justify-center">
        <p className="text-center text-lg font-serif text-wedding-black">Mathilde de Mariable, votre wedding planner personnelle</p>
      </div>
      
      <div className="flex-grow p-0 relative overflow-hidden">
        <ScrollArea className="h-[400px] p-4">
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
            placeholder="Décrivez votre mariage idéal ou ce que vous recherchez..."
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
