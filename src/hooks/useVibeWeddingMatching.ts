import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Vendor {
  id: string;
  nom: string;
  categorie: string;
  ville?: string;
  region?: string;
  description?: string;
  prix_a_partir_de?: number;
  matchScore?: number;
  photo_url?: string;
  site_web?: string;
  email?: string;
  telephone?: string;
  partner?: boolean;
  featured?: boolean;
}

export const useVibeWeddingMatching = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [matchedVendors, setMatchedVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [needsRegion, setNeedsRegion] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessage = async (messageText: string) => {
    setIsLoading(true);

    // Ajouter le message utilisateur
    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);

    try {
      console.log('🚀 Envoi du message à vibe-wedding-ai:', messageText);

      const { data, error } = await supabase.functions.invoke('vibe-wedding-ai', {
        body: { message: messageText }
      });

      if (error) {
        console.error('❌ Erreur edge function:', error);
        throw error;
      }

      console.log('📦 Réponse reçue:', data);

      // Ajouter la réponse de l'assistant
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.conversationalResponse || "Je vais vous aider à trouver le prestataire idéal !"
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Mettre à jour les prestataires matchés
      if (data.vendors && data.vendors.length > 0) {
        console.log(`✅ ${data.vendors.length} prestataires reçus`);
        setMatchedVendors(data.vendors);
        
        toast({
          title: "Prestataires trouvés",
          description: `${data.vendors.length} prestataires correspondent à votre recherche`,
        });
      } else {
        setMatchedVendors([]);
      }

      // Gérer la demande de région
      if (data.needsRegion) {
        setNeedsRegion(true);
        setDetectedCategory(data.detectedCategory);
      } else {
        setNeedsRegion(false);
        setDetectedCategory(null);
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de contacter le service de matching",
        variant: "destructive",
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Désolé, une erreur s'est produite. Pouvez-vous réessayer ?"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMatching = () => {
    setMessages([]);
    setMatchedVendors([]);
    setNeedsRegion(false);
    setDetectedCategory(null);
  };

  return {
    messages,
    matchedVendors,
    isLoading,
    needsRegion,
    detectedCategory,
    sendMessage,
    clearMatching
  };
};
