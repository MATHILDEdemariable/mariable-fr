import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Plus, Calendar, Users, MapPin, Euro, Trash2, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
interface WeddingProject {
  id: string;
  title: string;
  summary: string;
  wedding_data: any;
  budget_breakdown: any[];
  timeline: any[];
  vendors: any[];
  conversation_id: string | null;
  created_at: string;
  updated_at: string;
}
const MonMariage = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [projects, setProjects] = useState<WeddingProject[]>([]);
  const [vibeConversations, setVibeConversations] = useState<any[]>([]);
  const [retroplannings, setRetroplannings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const loadProjects = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        setProjects([]);
        setVibeConversations([]);
        setRetroplannings([]);
        setIsLoading(false);
        return;
      }
      const {
        data,
        error
      } = await supabase.from('wedding_projects').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      });
      if (error) throw error;

      // Charger les conversations VibeWedding
      const {
        data: conversationsData,
        error: conversationsError
      } = await supabase.from('ai_wedding_conversations').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      });
      if (conversationsError) throw conversationsError;

      // Charger les rétroplannings
      const {
        data: retroplanningsData,
        error: retroplanningsError
      } = await supabase.from('wedding_retroplanning').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      });
      if (retroplanningsError) throw retroplanningsError;
      setProjects((data || []) as any);
      setVibeConversations(conversationsData || []);
      setRetroplannings(retroplanningsData || []);
    } catch (error: any) {
      console.error('Error loading projects:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos projets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const deleteProject = async (projectId: string) => {
    try {
      const {
        error
      } = await supabase.from('wedding_projects').delete().eq('id', projectId);
      if (error) throw error;
      toast({
        title: "✅ Projet supprimé",
        description: "Le projet a été supprimé avec succès"
      });
      loadProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le projet",
        variant: "destructive"
      });
    }
    setProjectToDelete(null);
  };
  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette recherche ?")) {
      return;
    }
    try {
      const {
        error
      } = await supabase.from('ai_wedding_conversations').delete().eq('id', conversationId);
      if (error) throw error;
      toast({
        title: "✅ Recherche supprimée",
        description: "La recherche a été supprimée avec succès"
      });
      loadProjects();
    } catch (error: any) {
      console.error('Erreur suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la recherche",
        variant: "destructive"
      });
    }
  };
  const handleDeleteRetroplanning = async (retroplanningId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce rétroplanning ?")) {
      return;
    }
    try {
      const {
        error
      } = await supabase.from('wedding_retroplanning').delete().eq('id', retroplanningId);
      if (error) throw error;
      toast({
        title: "✅ Rétroplanning supprimé",
        description: "Le rétroplanning a été supprimé avec succès"
      });
      loadProjects();
    } catch (error: any) {
      console.error('Erreur suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rétroplanning",
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    loadProjects();
  }, []);
  if (isLoading) {
    return <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-sage"></div>
      </div>;
  }
  return;
};
export default MonMariage;