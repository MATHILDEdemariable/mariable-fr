import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Plus, Calendar, Users, MapPin, Euro, Trash2, Eye, Edit, Clock } from 'lucide-react';
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
  return <div className="space-y-8">
      {/* Header avec CTA Rétroplanning */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Mon Mariage</h1>
          <p className="text-muted-foreground">
            Gérez vos projets de mariage et retroplannings
          </p>
        </div>
        <Button onClick={() => navigate('/retroplanning')} className="bg-wedding-olive hover:bg-wedding-olive/90">
          <Clock className="h-4 w-4 mr-2" />
          Créer mon rétroplanning personnalisé
        </Button>
      </div>

      {/* Section Rétroplannings */}
      {retroplannings.length > 0 && <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold">Mes Rétroplannings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {retroplannings.map(retro => <Card key={retro.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="truncate">Rétroplanning {retro.wedding_date ? format(new Date(retro.wedding_date), 'dd MMMM yyyy', {
                  locale: fr
                }) : ''}</span>
                  </CardTitle>
                  <CardDescription>
                    Créé le {format(new Date(retro.created_at), 'dd MMM yyyy', {
                locale: fr
              })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {retro.wedding_date && <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(retro.wedding_date), 'dd MMMM yyyy', {
                    locale: fr
                  })}</span>
                      </div>}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/retroplanning?id=${retro.id}`)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteRetroplanning(retro.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>}

      {/* Section Recherches VibeWedding */}
      {vibeConversations.length > 0 && <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold">Mes Recherches VibeWedding</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vibeConversations.map(convo => <Card key={convo.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Recherche VibeWedding</CardTitle>
                  <CardDescription>
                    {format(new Date(convo.created_at), 'dd MMM yyyy', {
                locale: fr
              })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/vibe-wedding?session=${convo.session_id}`)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Reprendre
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteConversation(convo.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>}

      {/* Section Projets IA */}
      {projects.length > 0 && <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold">Mes Projets IA</h2>
            <Button onClick={() => navigate('/vibe-wedding')}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau projet
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="truncate">{project.title}</span>
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(project.created_at), 'dd MMM yyyy', {
                locale: fr
              })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.summary}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/dashboard/mon-mariage/${project.id}`)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setProjectToDelete(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>}

      {/* État vide */}
      {projects.length === 0 && vibeConversations.length === 0 && retroplannings.length === 0 && <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Aucun projet pour le moment</h3>
              <p className="text-muted-foreground mb-6">
                Créez votre premier rétroplanning personnalisé ou démarrez un projet avec VibeWedding
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/retroplanning')}>
                  <Clock className="h-4 w-4 mr-2" />
                  Créer mon rétroplanning
                </Button>
                
              </div>
            </div>
          </CardContent>
        </Card>}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => projectToDelete && deleteProject(projectToDelete)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default MonMariage;