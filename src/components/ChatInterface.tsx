
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizontal, MapPin, Calendar, Briefcase, Building, HelpCircle } from 'lucide-react';
import { Message as MessageType, VendorRecommendation } from '@/types';
import Message from './Message';
import { sendMessage, getInitialOptions, getLocationOptions, handleOptionSelected } from '@/services/chatService';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

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
      content: "Bonjour et félicitations pour votre mariage ! Je suis Mathilde de Mariable, votre wedding planner digital ✨ Dites-moi tout, je vais vous aider à trouver les meilleurs prestataires selon vos envies.",
      timestamp: new Date()
    }
  ]);
  const [recommendations, setRecommendations] = useState<Record<string, VendorRecommendation[]>>({});
  const [inputValue, setInputValue] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [optionButtons, setOptionButtons] = useState<{text: string, value: string, icon?: React.ReactNode}[]>([]);
  const [conversationContext, setConversationContext] = useState<{
    needType?: string;
    location?: string;
    vendorType?: string;
  }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, recommendations, optionButtons]);

  useEffect(() => {
    if (initialMessage && !isSimpleInput && !hasProcessedInitialMessage) {
      setHasProcessedInitialMessage(true);
      handleSubmitWithMessage(initialMessage);
    }
  }, [initialMessage, isSimpleInput]);

  useEffect(() => {
    // Afficher les boutons d'options initiales après le premier message utilisateur
    if (currentStep === 1) {
      const initialOptions = getInitialOptions();
      setOptionButtons(initialOptions);
    }
    // Une fois que le type de besoin est défini, demander la localisation
    else if (currentStep === 2 && conversationContext.needType) {
      if (conversationContext.needType === "orientation") {
        // Rediriger vers le rétroplanning si l'utilisateur a besoin d'orientation globale
        navigate('/services/planification');
      } else {
        const locationOptions = getLocationOptions();
        setOptionButtons(locationOptions);
      }
    }
    // Une fois que la localisation est définie, ne plus afficher de boutons
    else if (currentStep > 2) {
      setOptionButtons([]);
    }
  }, [currentStep, conversationContext]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  };

  const handleOptionClick = async (option: {text: string, value: string}) => {
    // Ajouter l'option sélectionnée comme message utilisateur
    const userMessage: MessageType = {
      id: uuidv4(),
      role: 'user',
      content: option.text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    
    try {
      // Traiter l'option sélectionnée et obtenir une réponse
      const { response, updatedContext, nextStep } = await handleOptionSelected(
        option.value, 
        currentStep, 
        conversationContext
      );
      
      // Mettre à jour le contexte de la conversation
      setConversationContext(updatedContext);
      
      // Passer à l'étape suivante
      setCurrentStep(nextStep);
      
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
      console.error('Error processing option:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre sélection. Veuillez réessayer.",
        variant: "destructive"
      });
      
      const errorMessage: MessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: "Désolée, j'ai rencontré un problème technique. Pourriez-vous réessayer ?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
      
      // Si c'est le premier message utilisateur, passer à l'étape 1
      if (messages.length === 1) {
        setCurrentStep(1);
      }
      
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
        content: "Désolée, j'ai rencontré un problème technique. Pourriez-vous réessayer ?",
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
            
            {isLoading && (
              <div className="flex w-full justify-start mb-3 md:mb-4">
                <Card className="chat-bubble-assistant p-2 md:p-3">
                  <CardContent className="p-0">
                    <p className="typing-dots text-sm md:text-base">Mathilde réfléchit</p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {optionButtons.length > 0 && (
              <div className="flex flex-col items-center justify-center gap-2 mb-4">
                <Card className="chat-bubble-assistant p-3 w-full">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center">
                      {optionButtons.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="bg-wedding-cream text-wedding-black hover:bg-wedding-cream/80 border border-wedding-olive/20 flex items-center gap-2 whitespace-nowrap"
                        >
                          {option.icon}
                          {option.text}
                        </Button>
                      ))}
                    </div>
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
            disabled={isLoading}
            className="flex-grow text-sm md:text-base"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()} 
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
