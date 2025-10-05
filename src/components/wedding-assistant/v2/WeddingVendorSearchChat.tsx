import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWeddingProject } from '@/contexts/WeddingProjectContext';
import RegionSelector from '@/components/vibe-wedding/RegionSelector';
import VendorSearchCard from './VendorSearchCard';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  vendors?: any[];
  askLocation?: boolean;
  detectedCategory?: string;
}

interface WeddingVendorSearchChatProps {
  preventScroll?: boolean;
  onBack: () => void;
}

const WeddingVendorSearchChat: React.FC<WeddingVendorSearchChatProps> = ({ preventScroll, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "👋 Je suis là pour vous aider à trouver les meilleurs prestataires pour votre mariage. Quel type de prestataire recherchez-vous ?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { addVendors } = useWeddingProject();

  const scrollToBottom = () => {
    if (!preventScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRegionSelect = async (region: string) => {
    setShowRegionSelector(false);
    setIsLoading(true);

    try {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
      
      const { data, error } = await supabase.functions.invoke('wedding-vendor-search-ai', {
        body: {
          message: lastUserMessage,
          region,
          sessionId: `session_${Date.now()}`
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message,
        vendors: data.vendors || []
      }]);

      if (data.vendors && data.vendors.length > 0) {
        toast({
          title: "Résultats trouvés",
          description: `${data.vendors.length} prestataire(s) trouvé(s) en ${region}`,
        });
      }

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la recherche.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setPendingCategory(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    // Message de loading
    const loadingMessage = { role: 'assistant' as const, content: '🔍 Mariable recherche des prestataires pour vous...' };
    setMessages([...newMessages, loadingMessage]);

    try {
      const { data, error } = await supabase.functions.invoke('wedding-vendor-search-ai', {
        body: {
          message: userMessage,
          sessionId: `session_${Date.now()}`
        }
      });

      if (error) throw error;

      // Remplacer le message de loading par la vraie réponse
      if (data.askLocation) {
        setPendingCategory(data.detectedCategory);
        setShowRegionSelector(true);
        setMessages([...newMessages, { role: 'assistant', content: data.message, askLocation: true }]);
      } else {
        if (data.vendors && data.vendors.length > 0) {
          addVendors(data.vendors);
          
          setMessages([...newMessages, { 
            role: 'assistant', 
            content: data.message,
            vendors: data.vendors 
          }]);
          
          toast({
            title: "✅ Prestataires ajoutés",
            description: `${data.vendors.length} prestataire(s) ajouté(s) à votre projet`,
          });
        } else {
          setMessages([...newMessages, { role: 'assistant', content: data.message }]);
        }
      }

    } catch (error: any) {
      console.error('Error:', error);
      
      // Remplacer le message de loading par un message d'erreur
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: "Désolé, une erreur s'est produite. Veuillez réessayer." 
      }]);
      
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h3 className="font-semibold">Recherche Prestataires</h3>
          <p className="text-sm text-muted-foreground">Trouvez des professionnels pour votre mariage</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>Je peux vous aider à trouver des prestataires pour votre mariage.</p>
            <p className="mt-2">Dites-moi ce que vous cherchez : photographe, lieu de réception, traiteur...</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx}>
            <div
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>

            {msg.vendors && msg.vendors.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {msg.vendors.map((vendor, vIdx) => (
                  <VendorSearchCard
                    key={vIdx}
                    vendor={vendor}
                  />
                ))}
              </div>
            )}

            {msg.askLocation && showRegionSelector && idx === messages.length - 1 && (
              <div className="mt-4">
                <RegionSelector onSelectRegion={handleRegionSelect} />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ex: Je cherche un photographe..."
          className="min-h-[60px] resize-none"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          size="icon"
          className="self-end"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeddingVendorSearchChat;
