import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const sendMessage = async (messageText: string) => {
    setIsLoading(true);

    // Ajouter le message utilisateur
    const userMessage: Message = { role: 'user', content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      console.log('🚀 Envoi de l\'historique complet à vibe-wedding-ai:', updatedMessages.length, 'messages');

      const { data, error } = await supabase.functions.invoke('vibe-wedding-ai', {
        body: { messages: updatedMessages }
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

  const saveProject = async () => {
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Connectez-vous pour sauvegarder votre projet",
          variant: "destructive",
        });
        return;
      }

      // Extraire les critères du contexte
      const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
      const weddingContext = {
        vendors: matchedVendors.map(v => ({
          id: v.id,
          nom: v.nom,
          categorie: v.categorie,
          region: v.region,
          matchScore: v.matchScore
        })),
        criteria: {
          category: detectedCategory,
          vendorCount: matchedVendors.length
        }
      };

      // Créer ou mettre à jour la conversation
      const conversationData = {
        user_id: user.id,
        session_id: conversationId || crypto.randomUUID(),
        messages: messages as any,
        wedding_context: weddingContext as any,
        updated_at: new Date().toISOString()
      };

      const { data, error } = conversationId
        ? await supabase
            .from('ai_wedding_conversations')
            .update(conversationData)
            .eq('id', conversationId)
            .select()
            .single()
        : await supabase
            .from('ai_wedding_conversations')
            .insert(conversationData)
            .select()
            .single();

      if (error) throw error;

      setConversationId(data.id);

      toast({
        title: "✅ Projet sauvegardé",
        description: `${matchedVendors.length} prestataires sauvegardés dans votre projet`,
      });

      return data.id;
    } catch (error) {
      console.error('❌ Erreur sauvegarde projet:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le projet",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const clearMatching = () => {
    setMessages([]);
    setMatchedVendors([]);
    setNeedsRegion(false);
    setDetectedCategory(null);
    setConversationId(null);
  };

  return {
    messages,
    matchedVendors,
    isLoading,
    needsRegion,
    detectedCategory,
    conversationId,
    isSaving,
    sendMessage,
    saveProject,
    clearMatching
  };
};
