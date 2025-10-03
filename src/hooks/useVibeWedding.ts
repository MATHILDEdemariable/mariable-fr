import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WeddingData {
  guests: number | null;
  budget: number | null;
  location: string | null;
  date: string | null;
  style: string | null;
}

interface BudgetItem {
  category: string;
  percentage: number;
  amount: number;
}

interface TimelineItem {
  task: string;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface Vendor {
  id: string;
  nom: string;
  categorie: string;
  ville: string;
  prix_min: number;
  prix_max: number;
  description: string;
  note_moyenne: number;
}

interface WeddingProject {
  summary: string;
  weddingData: WeddingData;
  budgetBreakdown: BudgetItem[];
  timeline: TimelineItem[];
  vendors: Vendor[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const useVibeWedding = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [project, setProject] = useState<WeddingProject | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (userMessage: string) => {
    setIsLoading(true);

    // Ajouter le message utilisateur immédiatement
    const userMsg: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('vibe-wedding-ai', {
        body: {
          message: userMessage,
          conversationId,
          sessionId,
          userId: user?.id || null
        }
      });

      if (error) throw error;

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.response.conversational 
          ? data.response.message 
          : data.response.summary,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);
      
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Si ce n'est pas une réponse conversationnelle, c'est un projet complet
      if (!data.response.conversational) {
        setProject({
          summary: data.response.summary,
          weddingData: data.response.weddingData,
          budgetBreakdown: data.response.budgetBreakdown,
          timeline: data.response.timeline,
          vendors: data.vendors || []
        });
      }

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, sessionId, toast]);

  const startNewProject = useCallback(() => {
    setMessages([]);
    setProject(null);
    setConversationId(null);
  }, []);

  return {
    messages,
    project,
    isLoading,
    sendMessage,
    startNewProject
  };
};
