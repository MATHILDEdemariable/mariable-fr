import { useState, useCallback, useEffect } from 'react';
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

interface ConversationItem {
  id: string;
  title: string;
  timestamp: string;
}

export const useVibeWedding = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [project, setProject] = useState<WeddingProject | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isLoading, setIsLoading] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  // Helper function to extract title from first message
  const extractTitle = (content: string): string => {
    if (!content) return "Nouvelle conversation";
    const words = content.split(' ').slice(0, 6).join(' ');
    return words.length < content.length ? `${words}...` : words;
  };

  // Helper function to format timestamp
  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return "Hier";
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  // Load conversations from database
  const loadConversations = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setConversations([]);
      return;
    }
    
    const { data, error } = await supabase
      .from('ai_wedding_conversations')
      .select('id, messages, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (error) {
      console.error('Error loading conversations:', error);
      return;
    }
    
    if (data) {
      const formatted = data.map(conv => {
        const messages = Array.isArray(conv.messages) 
          ? (conv.messages as unknown as Message[])
          : [];
        return {
          id: conv.id,
          title: extractTitle(messages[0]?.content || ""),
          timestamp: formatTimestamp(conv.created_at)
        };
      });
      setConversations(formatted);
    }
  }, []);

  // Load a specific conversation
  const loadConversation = useCallback(async (convId: string) => {
    const { data, error } = await supabase
      .from('ai_wedding_conversations')
      .select('*')
      .eq('id', convId)
      .single();
      
    if (error) {
      console.error('Error loading conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger cette conversation",
        variant: "destructive"
      });
      return;
    }
    
    if (data) {
      // Parse messages with proper typing
      const parsedMessages = Array.isArray(data.messages) 
        ? (data.messages as unknown as Message[])
        : [];
      
      setMessages(parsedMessages);
      setConversationId(convId);
      setCurrentConversationId(convId);
      
      // Reconstruct project if wedding_context exists
      if (data.wedding_context && typeof data.wedding_context === 'object') {
        const context = data.wedding_context as any;
        if (context.summary && context.weddingData) {
          setProject(context as WeddingProject);
        }
      }
    }
  }, [toast]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const sendMessage = useCallback(async (userMessage: string) => {
    // Vérifier l'authentification et le compteur de prompts
    const { data: { user } } = await supabase.auth.getUser();
    
    if (promptCount >= 1 && !user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);

    // Ajouter le message utilisateur immédiatement
    const userMsg: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      
      const { data, error } = await supabase.functions.invoke('vibe-wedding-ai', {
        body: {
          message: userMessage,
          conversationId,
          sessionId,
          userId: user?.id || null,
          currentProject: project // Passer le projet actuel pour les mises à jour
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

      // Gérer les différents modes de réponse
      if (!data.response.conversational) {
        if (data.response.mode === 'update') {
          // MODE UPDATE : Merge intelligent avec le projet existant
          setProject(prevProject => {
            if (!prevProject) return null;
            
            const updatedFields = data.response.updatedFields || {};
            
            return {
              ...prevProject,
              summary: data.response.message || prevProject.summary,
              weddingData: {
                ...prevProject.weddingData,
                ...(updatedFields.weddingData || {})
              },
              budgetBreakdown: updatedFields.budgetBreakdown || prevProject.budgetBreakdown,
              timeline: updatedFields.timeline || prevProject.timeline,
              vendors: data.vendors || prevProject.vendors
            };
          });
        } else {
          // MODE INITIAL : Remplacement complet
          setProject({
            summary: data.response.summary,
            weddingData: data.response.weddingData,
            budgetBreakdown: data.response.budgetBreakdown,
            timeline: data.response.timeline,
            vendors: data.vendors || []
          });
        }
      }

      // Incrémenter le compteur de prompts après succès
      setPromptCount(prev => prev + 1);

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
  }, [conversationId, sessionId, toast, promptCount]);

  const startNewProject = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Bloquer si non connecté et déjà utilisé le prompt gratuit
    if (!user && promptCount >= 1) {
      setShowAuthModal(true);
      return;
    }
    
    setMessages([]);
    setProject(null);
    setConversationId(null);
    setCurrentConversationId(null);
    setPromptCount(0);
  }, [promptCount]);

  const saveProjectToDashboard = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (!project) {
      toast({
        title: "Aucun projet à sauvegarder",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Créer un titre basé sur les données du mariage
      const location = project.weddingData?.location || 'Non défini';
      const guests = project.weddingData?.guests || 0;
      const title = `Mariage ${location} - ${guests} invités`;
      
      // Sauvegarder dans wedding_projects avec cast pour les types JSON
      const { error } = await supabase
        .from('wedding_projects')
        .insert([{
          user_id: user.id,
          title,
          summary: project.summary || '',
          wedding_data: project.weddingData as any,
          budget_breakdown: project.budgetBreakdown as any,
          timeline: project.timeline as any,
          vendors: project.vendors as any,
          conversation_id: conversationId || null
        }]);
      
      if (error) throw error;
      
      toast({ 
        title: "✅ Projet sauvegardé dans Mon Mariage", 
        description: "Accédez-y depuis votre dashboard" 
      });
      
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({ 
        title: "Erreur lors de la sauvegarde",
        description: error.message,
        variant: "destructive" 
      });
    }
  }, [project, conversationId, toast]);

  return {
    messages,
    project,
    isLoading,
    sendMessage,
    startNewProject,
    saveProjectToDashboard,
    promptCount,
    showAuthModal,
    setShowAuthModal,
    conversations,
    currentConversationId,
    loadConversation
  };
};
