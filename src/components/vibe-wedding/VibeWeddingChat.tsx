import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import AuthRequiredModal from './AuthRequiredModal';
import VendorCardInChat from './VendorCardInChat';
import RegionSelector from './RegionSelector';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Vendor {
  id: string;
  nom: string;
  categorie: string;
  ville?: string;
  region?: string;
  prix_a_partir_de?: number;
  prix_par_personne?: number;
  description?: string;
  email?: string;
  telephone?: string;
  slug?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  vendors?: Vendor[];
  askLocation?: boolean;
  ctaSelection?: boolean;
  vendorCategory?: string;
}

interface VibeWeddingChatProps {
  messages: Message[];
  onSendMessage: (message: string, organizationMode?: boolean) => void;
  isLoading: boolean;
  promptCount: number;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const VibeWeddingChat: React.FC<VibeWeddingChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  promptCount,
  showAuthModal,
  setShowAuthModal
}) => {
  const [input, setInput] = useState('');
  const [user, setUser] = useState<any>(null);
  const [organizationMode, setOrganizationMode] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Vérifier l'authentification
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-scroll vers le bas à chaque nouveau message
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    };
    
    // Scroll immédiatement et avec un léger délai pour garantir le rendu
    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 50);
    
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim(), organizationMode);
      setInput('');
    }
  };

  const handleRegionSelect = (region: string) => {
    onSendMessage(`Je souhaite des prestataires en ${region}`, organizationMode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const quickPrompts = [
    "Je veux un mariage de 100 personnes à Paris avec un budget de 30 000€",
    "Organisez mon mariage champêtre en Provence pour 80 invités",
    "Je cherche un mariage élégant à Lyon, budget 25 000€"
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-full bg-premium-sage-very-light flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-premium-sage" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2">Bienvenue sur Vibe Wedding</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Décrivez-moi votre projet de mariage et je vous aiderai à créer un plan complet avec budget, planning et suggestions de prestataires.
            </p>
            
            <div className="space-y-2 w-full max-w-md">
              <p className="text-sm font-medium mb-3">Exemples de demandes :</p>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(prompt)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:border-premium-sage hover:bg-premium-sage-very-light transition-colors text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-3">
                <div
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[80%] rounded-2xl px-4 py-3
                      ${msg.role === 'user'
                        ? 'bg-premium-sage text-white'
                        : 'bg-card border border-border'
                      }
                    `}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                
                {/* Afficher le RegionSelector si demandé */}
                {msg.role === 'assistant' && msg.askLocation && (
                  <div className="max-w-3xl ml-0">
                    <RegionSelector onSelectRegion={handleRegionSelect} />
                  </div>
                )}
                
                {/* Afficher les prestataires si présents */}
                {msg.role === 'assistant' && msg.vendors && msg.vendors.length > 0 && (
                  <div className="space-y-2 max-w-3xl ml-0">
                    <p className="text-sm font-medium text-muted-foreground px-2">
                      📍 Prestataires recommandés :
                    </p>
                    {msg.vendors.map((vendor) => (
                      <VendorCardInChat key={vendor.id} vendor={vendor} />
                    ))}
                    
                    {/* CTA to view full selection */}
                    {msg.ctaSelection && msg.vendorCategory && (
                      <Button 
                        asChild 
                        variant="outline" 
                        className="w-full mt-3"
                      >
                        <Link to="/selection">
                          🔍 Voir la sélection entière - {msg.vendorCategory}
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Message d'info si conversationnel sans projet */}
                {msg.role === 'assistant' && !msg.vendors && !msg.askLocation && messages.indexOf(msg) === messages.length - 1 && (
                  <div className="mt-3 p-3 bg-premium-sage-very-light border border-premium-sage/20 rounded-lg max-w-3xl ml-0">
                    <p className="text-sm text-muted-foreground">
                      💡 <span className="font-medium">Conseil :</span> Pour créer votre projet de mariage personnalisé avec budget et rétroplanning, décrivez-moi votre projet complet (date, lieu, nombre d'invités, budget approximatif).
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-premium-sage rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-premium-sage rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-premium-sage rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">Mariable génère votre organisation mariage...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={scrollRef} />
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4 bg-card">
        <div className="max-w-3xl mx-auto">
          {/* Toggle Mode Conversation / Organisation */}
          <TooltipProvider>
            <div className="mb-3 flex items-center justify-center gap-3 p-3 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrganizationMode(false)}
                  type="button"
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                    !organizationMode 
                      ? 'bg-premium-sage text-white' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  💬 Conversation
                </button>
                <button
                  onClick={() => setOrganizationMode(true)}
                  type="button"
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                    organizationMode 
                      ? 'bg-premium-sage text-white' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  📝 Organisation
                </button>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-muted-foreground hover:text-foreground">
                    <Info className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    <strong>💬 Conversation :</strong> Posez des questions, recherchez des prestataires sans modifier votre projet.
                    <br/><br/>
                    <strong>📝 Organisation :</strong> Toutes vos demandes enrichissent automatiquement votre projet de mariage.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          
          {!user && promptCount >= 1 ? (
            <div className="bg-gradient-to-r from-premium-sage to-premium-sage-dark text-white p-6 rounded-xl shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-semibold text-lg mb-2">
                    🔒 Limite gratuite atteinte
                  </h3>
                  <p className="text-sm opacity-90">
                    Créez votre compte gratuit pour continuer à utiliser Mariable et sauvegarder vos projets
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => window.location.href = '/auth?mode=signup'}
                    className="bg-white text-premium-sage hover:bg-gray-100 font-medium"
                    size="lg"
                  >
                    Créer mon compte
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/auth?mode=login'}
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    size="lg"
                  >
                    Se connecter
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {!user && promptCount === 0 && (
                <div className="mb-3 text-xs text-center text-muted-foreground bg-premium-sage-very-light border border-premium-sage/20 rounded-lg px-3 py-2">
                  💡 <span className="font-medium">1ère demande gratuite</span>, ensuite créez un compte pour continuer
                </div>
              )}
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Décrivez votre projet de mariage..."
                  className="min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-premium-sage hover:bg-premium-sage-dark text-white self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal d'authentification */}
      <AuthRequiredModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default VibeWeddingChat;
