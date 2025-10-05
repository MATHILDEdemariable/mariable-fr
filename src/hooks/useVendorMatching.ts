import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  vendors?: any[];
}

export const useVendorMatching = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [matchedVendors, setMatchedVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [needsRegion, setNeedsRegion] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessage = async (messageText: string, selectedRegion?: string) => {
    setIsLoading(true);

    // Ajouter le message utilisateur
    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);

    try {
      const { data, error } = await supabase.functions.invoke('wedding-vendor-matcher', {
        body: { 
          message: messageText,
          category: detectedCategory,
          region: selectedRegion
        }
      });

      if (error) throw error;

      console.log('📦 Matching response:', data);

      // Ajouter la réponse de l'assistant
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.conversationalResponse,
        vendors: data.vendors || []
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Mettre à jour les prestataires matchés
      if (data.vendors && data.vendors.length > 0) {
        setMatchedVendors(data.vendors);
        toast({
          title: "Prestataires trouvés",
          description: `${data.vendors.length} prestataires correspondent à votre recherche`,
        });
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
      console.error('Error sending message:', error);
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
