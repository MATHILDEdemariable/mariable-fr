
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
      content: "Bonjour ! Je suis Nuptia, ta wedding planner virtuelle 💍 Je suis là pour t'aider à organiser le mariage de tes rêves. Commençons par quelques questions pour mieux comprendre tes besoins. Tu veux te marier où ? (une région, ville ou un lieu spécifique)",
      timestamp: new Date()
    }
  ]);
  const [recommendations, setRecommendations] = useState<Record<string, VendorRecommendation[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState('location');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages change
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
      // Get the next question based on conversation state
      let nextQuestion = "";
      let nextState = conversationState;
      
      if (conversationState === 'location') {
        nextQuestion = "Merci ! 📅 As-tu une date déjà fixée ou une période idéale pour ton mariage ?";
        nextState = 'date';
      } else if (conversationState === 'date') {
        nextQuestion = "Super ! Maintenant, dis-moi quel type de prestataires tu cherches en priorité ? (photographe, traiteur, DJ, lieu de réception...)";
        nextState = 'vendorType';
      } else if (conversationState === 'vendorType') {
        nextQuestion = "Parfait ! Dernière question : as-tu une idée de budget pour ce prestataire, ou préfères-tu qu'on s'adapte aux standards du marché ?";
        nextState = 'budget';
      } else if (conversationState === 'budget') {
        nextQuestion = "Génial ! J'ai toutes les informations dont j'ai besoin. Voici quelques prestataires qui pourraient correspondre à tes critères. Tu peux cliquer sur 'Voir plus d'infos' pour accéder à leurs coordonnées complètes.";
        nextState = 'recommendations';
      }
      
      // Save the next state
      setConversationState(nextState);
      
      // Process with API and get recommendations if needed
      const response = await sendMessage([...messages, userMessage]);
      
      const assistantMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: nextState === 'recommendations' ? response.message : nextQuestion,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.recommendations && (nextState === 'recommendations' || nextState === 'follow-up')) {
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

  return (
    <div className="w-full h-[500px] flex flex-col bg-white">
      <div className="p-4 bg-white border-b flex items-center justify-center">
        <p className="text-center text-lg font-serif text-wedding-black">Nuptia, ta wedding planner personnelle</p>
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
                    <p className="typing-dots">Nuptia réfléchit...</p>
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
            placeholder={conversationState === 'location' ? "Ex: Bordeaux, Provence..." : 
                         conversationState === 'date' ? "Ex: Juin 2026, été prochain..." :
                         conversationState === 'vendorType' ? "Ex: Photographe, lieu..." :
                         conversationState === 'budget' ? "Ex: 2000€, budget standard..." :
                         "Pose-moi d'autres questions..."}
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
