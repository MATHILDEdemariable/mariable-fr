import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';

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
  ville?: string;
  region?: string;
  prix_a_partir_de?: number;
  prix_par_personne?: number;
  description?: string;
  email?: string;
  telephone?: string;
  slug?: string;
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
  vendors?: Vendor[];
  askLocation?: boolean;
  ctaSelection?: boolean;
  vendorCategory?: string;
}

interface ConversationItem {
  id: string;
  title: string;
  timestamp: string;
}

export const useVibeWedding = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
      // Parse messages - le contenu devrait maintenant être déjà propre
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

  // Load a project from database
  const loadProjectFromDatabase = useCallback(async (projectId: string) => {
    const { data, error } = await supabase
      .from('wedding_projects')
      .select('*')
      .eq('id', projectId)
      .single();
      
    if (error) {
      console.error('Error loading project:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger ce projet",
        variant: "destructive"
      });
      return;
    }
    
    if (data) {
      // Reconstituer le projet
      const loadedProject: WeddingProject = {
        summary: data.summary || '',
        weddingData: data.wedding_data as any as WeddingData,
        budgetBreakdown: (data.budget_breakdown || []) as any as BudgetItem[],
        timeline: (data.timeline || []) as any as TimelineItem[],
        vendors: (data.vendors || []) as any as Vendor[]
      };
      
      setProject(loadedProject);
      
      // Si le projet a un conversation_id, charger aussi la conversation
      if (data.conversation_id) {
        await loadConversation(data.conversation_id);
      } else {
        // Pas de conversation, juste afficher le projet
        setMessages([]);
        setConversationId(null);
        setCurrentConversationId(null);
      }
    }
  }, [toast, loadConversation]);

  // Load conversations on mount and handle URL params
  useEffect(() => {
    loadConversations();
    
    // Check if there's a conversationId or project in the URL
    const params = new URLSearchParams(location.search);
    const urlConversationId = params.get('conversationId');
    const urlProjectId = params.get('project');
    
    if (urlConversationId) {
      loadConversation(urlConversationId);
      // Clean up URL after loading
      navigate('/vibewedding', { replace: true });
    } else if (urlProjectId) {
      loadProjectFromDatabase(urlProjectId);
      // Clean up URL after loading
      navigate('/vibewedding', { replace: true });
    }
  }, [loadConversations, location.search, navigate, loadConversation, loadProjectFromDatabase]);

  const sendMessage = useCallback(async (userMessage: string, organizationMode: boolean = true) => {
    // Vérifier l'authentification et le compteur de prompts
    const { data: { user } } = await supabase.auth.getUser();
    
    if (promptCount >= 1 && !user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    
    // Afficher un toast de chargement pour les longs traitements
    const isLongProcess = userMessage.length > 50 || !project;
    if (isLongProcess) {
      toast({
        title: "✨ Mariable organise votre mariage",
        description: "Mariable peut mettre 1 minute à organiser votre mariage - restez ici :-)",
        duration: 60000,
        className: "bg-wedding-olive text-white border-wedding-olive",
      });
    }

    // Ajouter le message utilisateur immédiatement
    const userMsg: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      console.log('🚀 Sending message with project and organizationMode:', { project, organizationMode });
      
      const { data, error } = await supabase.functions.invoke('vibe-wedding-ai', {
        body: {
          message: userMessage,
          conversationId,
          sessionId,
          userId: user?.id || null,
          currentProject: project,
          organizationMode
        }
      });

      if (error) throw error;
      
      console.log('✅ Response received:', data);

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.response.conversational 
          ? data.response.message 
          : data.response.summary,
        timestamp: new Date().toISOString(),
        vendors: data.vendors && data.vendors.length > 0 ? data.vendors : undefined,
        askLocation: data.response.ask_location || false,
        ctaSelection: data.response.cta_selection || false,
        vendorCategory: data.response.category
      };

      setMessages(prev => [...prev, assistantMsg]);
      
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      console.log('🔍 Merge data:', {
        organizationMode: organizationMode,
        conversational: data.response.conversational,
        mode: data.response.mode,
        updatedFields: data.response.updatedFields,
        weddingData: data.response.weddingData
      });

      // Gérer les différents modes de réponse
      if (!organizationMode) {
        // MODE CONVERSATION : Ne jamais modifier le projet, juste afficher les vendors dans le message
        console.log('💬 Mode Conversation - Projet non modifié');
        
        // Toast pour indiquer le mode conversation actif
        if (data.vendors && data.vendors.length > 0) {
          toast({
            title: "💬 Mode Conversation",
            description: `${data.vendors.length} prestataires trouvés (non ajoutés au projet)`,
            duration: 3000,
          });
        }
      } else if (!data.response.conversational) {
        // MODE ORGANISATION : Merger intelligemment avec le projet existant
        console.log('📝 Mode Organisation - Merge avec projet existant');
        
        setProject(prevProject => {
          // CAS 1: Pas de projet existant
          if (!prevProject) {
            console.log('🆕 Création nouveau projet');
            return {
              summary: data.response.summary || data.response.message || '',
              weddingData: data.response.weddingData || {
                guests: null,
                budget: null,
                location: null,
                date: null,
                style: null
              },
              budgetBreakdown: data.response.budgetBreakdown || [],
              timeline: data.response.timeline || [],
              vendors: data.vendors || []
            };
          }
          
          // CAS 2: Projet existant - MERGE INTELLIGENT
          console.log('🔄 Merge avec projet existant');
          
          // Merge weddingData : préserver les anciennes valeurs si nouvelles valeurs sont null/undefined
          const updatedWeddingData = data.response.updatedFields?.weddingData || data.response.weddingData || {};
          const mergedWeddingData = { ...prevProject.weddingData };
          
          // Ne remplacer QUE les champs qui ont une vraie valeur
          Object.keys(updatedWeddingData).forEach(key => {
            const newValue = updatedWeddingData[key];
            if (newValue !== null && newValue !== undefined && newValue !== '') {
              mergedWeddingData[key] = newValue;
              console.log(`✅ Mise à jour ${key}: ${newValue}`);
            }
          });
          
          // Merge vendors : ajouter seulement les nouveaux (pas de doublons)
          const existingVendorIds = new Set(prevProject.vendors?.map(v => v.id) || []);
          const newVendors = (data.vendors || []).filter((v: Vendor) => !existingVendorIds.has(v.id));
          const mergedVendors = [...(prevProject.vendors || []), ...newVendors];
          
          console.log(`📋 Vendors: ${prevProject.vendors?.length || 0} existants + ${newVendors.length} nouveaux = ${mergedVendors.length} total`);
          
          // Merge budget et timeline : utiliser les nouveaux s'ils existent, sinon garder les anciens
          const mergedBudget = data.response.updatedFields?.budgetBreakdown || 
                               data.response.budgetBreakdown || 
                               prevProject.budgetBreakdown;
          
          const mergedTimeline = data.response.updatedFields?.timeline || 
                                 data.response.timeline || 
                                 prevProject.timeline;
          
          return {
            ...prevProject,
            summary: data.response.summary || data.response.message || prevProject.summary,
            weddingData: mergedWeddingData,
            budgetBreakdown: mergedBudget,
            timeline: mergedTimeline,
            vendors: mergedVendors
          };
        });
        
        // Toast de feedback pour les modifications
        if (data.response.mode === 'update' && data.response.updatedFields?.weddingData) {
          const updatedKeys = Object.keys(data.response.updatedFields.weddingData)
            .filter(key => {
              const value = data.response.updatedFields?.weddingData?.[key];
              return value !== null && value !== undefined && value !== '';
            });
          
          const labels: Record<string, string> = {
            'budget': 'budget',
            'date': 'date',
            'location': 'lieu',
            'guests': 'invités',
            'style': 'style'
          };
          
          const updatedFieldNames = updatedKeys.map(key => labels[key] || key);
          
          if (updatedFieldNames.length > 0) {
            toast({
              title: "✅ Projet mis à jour",
              description: `Modifications : ${updatedFieldNames.join(', ')}`,
              duration: 3000,
            });
          }
        }
        
        // Toast pour les nouveaux vendors ajoutés
        if (data.vendors && data.vendors.length > 0) {
          toast({
            title: "📋 Prestataires ajoutés",
            description: `${data.vendors.length} prestataires ajoutés à votre projet`,
            duration: 3000,
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
    
    // ✅ VALIDATION ASSOUPLIE : Accepter la sauvegarde dès qu'il y a du contenu
    const hasWeddingData = [
      project.weddingData?.guests,
      project.weddingData?.location,
      project.weddingData?.date,
      project.weddingData?.budget
    ].some(field => field !== null && field !== undefined && field !== '');
    
    const hasVendors = project.vendors && project.vendors.length > 0;
    const hasBudget = project.budgetBreakdown && project.budgetBreakdown.length > 0;
    const hasTimeline = project.timeline && project.timeline.length > 0;
    
    if (!hasWeddingData && !hasVendors && !hasBudget && !hasTimeline) {
      toast({
        title: "⚠️ Projet vide",
        description: "Votre projet ne contient aucune information à sauvegarder",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Créer un titre intelligent basé sur les données disponibles
      const location = project.weddingData?.location || null;
      const guests = project.weddingData?.guests || null;
      const date = project.weddingData?.date || null;
      
      let title = 'Projet de mariage';
      if (location && guests) {
        title = `Mariage ${location} - ${guests} invités`;
      } else if (location) {
        title = `Mariage à ${location}`;
      } else if (guests) {
        title = `Mariage - ${guests} invités`;
      } else if (date) {
        title = `Mariage du ${new Date(date).toLocaleDateString('fr-FR')}`;
      } else if (hasVendors) {
        title = `Projet avec ${project.vendors.length} prestataires`;
      }
      
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
