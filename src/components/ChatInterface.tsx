
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizontal, MapPin, Calendar, Briefcase, Building, HelpCircle, Users, Search, ExternalLink, RefreshCw, BookOpen } from 'lucide-react';
import { Message as MessageType, VendorRecommendation } from '@/types';
import Message from './Message';
import { sendMessage, getInitialOptions, getLocationOptions, handleOptionSelected } from '@/services/chatService';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatInterfaceProps {
  isSimpleInput?: boolean;
  onFirstMessage?: () => void;
  initialMessage?: string;
  guidedModeOnly?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isSimpleInput = false, 
  onFirstMessage,
  initialMessage,
  guidedModeOnly = false
}) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [recommendations, setRecommendations] = useState<Record<string, VendorRecommendation[]>>({});
  const [inputValue, setInputValue] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [optionButtons, setOptionButtons] = useState<{text: string, value: string, icon?: React.ReactNode, action?: string}[]>([]);
  const [actionButtons, setActionButtons] = useState<{text: string, value: string, icon?: React.ReactNode, link?: string, newTab?: boolean}[]>([]);
  const [showResetButton, setShowResetButton] = useState(false);
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
  const isMobile = useIsMobile();

  // Initialize with welcome message only for the simple input
  useEffect(() => {
    if (isSimpleInput) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Bonjour et félicitations pour votre mariage ! Je suis Mathilde de Mariable, votre wedding planner digital. Dites-moi tout, je vais vous aider à trouver les meilleurs prestataires selon vos envies.",
          timestamp: new Date()
        }
      ]);
    }
  }, [isSimpleInput]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, recommendations, optionButtons, actionButtons, showResetButton]);

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
      setActionButtons([]);
      setShowResetButton(false);
    }
    // Une fois que le type de besoin est défini, demander la localisation
    else if (currentStep === 2 && conversationContext.needType) {
      if (conversationContext.needType === "aide") {
        // Proposer les trois boutons d'aide
        setOptionButtons([]);
        setActionButtons([
          { 
            text: "Accéder au Guide Mariable", 
            value: "guide", 
            icon: React.createElement(BookOpen, { className: "h-4 w-4" }),
            link: "https://leguidemariable.softr.app/",
            newTab: true
          },
          { 
            text: "Lancer une planification personnalisée", 
            value: "planification", 
            icon: React.createElement(Calendar, { className: "h-4 w-4" }),
            link: "/services/planification"
          },
          { 
            text: "Obtenir des conseils personnalisés", 
            value: "conseils", 
            icon: React.createElement(HelpCircle, { className: "h-4 w-4" }),
            link: "/services/conseils"
          }
        ]);
        setShowResetButton(true);
      } else {
        const locationOptions = getLocationOptions();
        // Ajouter l'option "Autre" aux options de localisation
        locationOptions.push({ 
          text: "Autre", 
          value: "autre", 
          icon: React.createElement(Search, { className: "h-4 w-4" }) 
        });
        setOptionButtons(locationOptions);
        setActionButtons([]);
        setShowResetButton(true);
      }
    }
    // Une fois que la localisation est définie, afficher le bouton de réinitialisation
    else if (currentStep > 2) {
      setOptionButtons([]);
      setShowResetButton(true);
    }
  }, [currentStep, conversationContext]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  };

  const handleReset = () => {
    // Réinitialiser la conversation
    setMessages([]);
    setRecommendations({});
    setCurrentStep(1);
    setConversationContext({});
    setInputValue('');
    
    // Afficher les options initiales
    const initialOptions = getInitialOptions();
    setOptionButtons(initialOptions);
    setActionButtons([]);
    setShowResetButton(false);
    
    // Ajouter un message pour indiquer que la conversation recommence
    const resetMessage: MessageType = {
      id: uuidv4(),
      role: 'assistant',
      content: "Je vous écoute, quel est votre besoin ?",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, resetMessage]);
  };

  const handleNoRecommendationsFound = () => {
    // Afficher les boutons d'action en cas d'absence de recommandations
    setActionButtons([
      { 
        text: "Nous contacter directement", 
        value: "contact", 
        icon: React.createElement(Users, { className: "h-4 w-4" }),
        link: "/contact/nous-contacter"
      },
      { 
        text: "Consulter le guide Mariable", 
        value: "guide", 
        icon: React.createElement(ExternalLink, { className: "h-4 w-4" }),
        link: "https://leguidemariable.softr.app/",
        newTab: true
      }
    ]);
    setShowResetButton(true);
    
    // Ajouter un message pour informer l'utilisateur
    const noRecommendationsMessage: MessageType = {
      id: uuidv4(),
      role: 'assistant',
      content: "Oups, je n'ai pas encore de prestataire enregistré dans cette catégorie pour cette région. Mais vous pouvez :",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, noRecommendationsMessage]);
  };

  const handleOptionClick = async (option: {text: string, value: string, action?: string}) => {
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
      // Si c'est une action spéciale
      if (option.action === "redirect") {
        navigate(option.value);
        return;
      }
      
      // Traiter l'option sélectionnée et obtenir une réponse
      const { response, updatedContext, nextStep, noRecommendationsFound } = await handleOptionSelected(
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
        setShowResetButton(true);
      } else if (noRecommendationsFound) {
        handleNoRecommendationsFound();
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

  const handleActionButtonClick = (button: {text: string, value: string, link?: string, newTab?: boolean}) => {
    if (button.link) {
      if (button.newTab) {
        window.open(button.link, '_blank');
      } else {
        navigate(button.link);
      }
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
    
    if (isSimpleInput && onFirstMessage) {
      onFirstMessage();
    }
    
    try {
      // Après la première requête, afficher le message de bienvenue en premier
      if (!isSimpleInput && messages.length === 0) {
        const welcomeMessage: MessageType = {
          id: 'welcome',
          role: 'assistant',
          content: "Bonjour et félicitations pour votre mariage ! Je suis Mathilde de Mariable, votre wedding planner digital ✨ Dites-moi tout, je vais vous aider à trouver les meilleurs prestataires selon vos envies.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, welcomeMessage]);
      }
      
      const response = await sendMessage([...messages, userMessage]);
      
      // Si c'est le premier message utilisateur, passer à l'étape 1
      if (messages.length === 0 || (isSimpleInput && messages.length === 1)) {
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
        setShowResetButton(true);
      } else if (response.noRecommendationsFound) {
        handleNoRecommendationsFound();
      } else {
        setShowResetButton(true);
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
            placeholder={isMobile ? "Décrivez votre mariage idéal..." : "Décrivez votre mariage idéal ou ce que vous recherchez..."}
            disabled={isLoading}
            className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full py-3 md:py-4 pl-4 md:pl-6 text-sm"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()} 
            className="bg-wedding-olive hover:bg-wedding-olive/90 text-white h-auto rounded-full p-2 mx-2"
            aria-label="Envoyer"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] sm:h-[500px] flex flex-col bg-white rounded-xl overflow-hidden">
      <div className="p-2 md:p-4 bg-white border-b flex items-center justify-center">
        <p className="text-center text-base font-serif text-wedding-black">Mathilde de Mariable, votre wedding planner</p>
      </div>
      
      <div className="flex-grow p-0 relative overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full p-2 md:p-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <Message 
                key={message.id} 
                message={message}
                recommendations={recommendations[message.id] ? 
                  recommendations[message.id].slice(0, 3) 
                  : undefined} 
              />
            ))}
            
            {isLoading && (
              <div className="flex w-full justify-start mb-3">
                <Card className="chat-bubble-assistant p-2 md:p-3">
                  <CardContent className="p-0">
                    <p className="typing-dots text-sm">Mathilde réfléchit</p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {optionButtons.length > 0 && (
              <div className="flex flex-col items-center justify-center gap-2 mb-3">
                <Card className="chat-bubble-assistant p-2 w-full">
                  <CardContent className="p-0">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {optionButtons.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="bg-wedding-cream text-wedding-black hover:bg-wedding-cream/80 border border-wedding-olive/20 flex items-center gap-2 text-xs sm:text-sm py-1 h-auto"
                          size="sm"
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
            
            {actionButtons.length > 0 && (
              <div className="flex flex-col items-center justify-center gap-2 mb-3">
                <Card className="chat-bubble-assistant p-2 w-full">
                  <CardContent className="p-0">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {actionButtons.map((button, index) => (
                        <Button
                          key={index}
                          onClick={() => handleActionButtonClick(button)}
                          className="bg-wedding-olive text-white hover:bg-wedding-olive/90 flex items-center gap-2 text-xs sm:text-sm py-1 h-auto"
                          size="sm"
                        >
                          {button.icon}
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {showResetButton && (
              <div className="flex flex-col items-center justify-center gap-2 mb-3">
                <Card className="chat-bubble-assistant p-2 w-full">
                  <CardContent className="p-0">
                    <div className="flex justify-center">
                      <Button
                        onClick={handleReset}
                        className="bg-wedding-cream text-wedding-black hover:bg-wedding-cream/80 border border-wedding-olive/20 flex items-center gap-2 text-xs sm:text-sm py-1 h-auto"
                        size="sm"
                      >
                        <RefreshCw className="h-4 w-4" />
                        🔁 Recommencer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      
      {!guidedModeOnly && (
        <div className="p-2 md:p-3 border-t bg-white">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Continuez la conversation..."
              disabled={isLoading}
              className="flex-grow text-sm"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !inputValue.trim()} 
              className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
              size="sm"
              aria-label="Envoyer"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
