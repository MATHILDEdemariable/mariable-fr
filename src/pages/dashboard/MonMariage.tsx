import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Plus, Calendar, Users, MapPin, Euro, Trash2, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const { toast } = useToast();
  const [projects, setProjects] = useState<WeddingProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setProjects([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('wedding_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects((data || []) as any);
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
      const { error } = await supabase
        .from('wedding_projects')
        .delete()
        .eq('id', projectId);

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

  useEffect(() => {
    loadProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-sage"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-premium-rose" />
          <h1 className="text-3xl font-serif font-bold">Mon Mariage</h1>
        </div>
        <Button asChild className="bg-premium-sage hover:bg-premium-sage-dark">
          <Link to="/vibe-wedding">
            <Plus className="w-4 h-4 mr-2" />
            Créer un nouveau projet
          </Link>
        </Button>
      </div>

      {/* Projets sauvegardés */}
      {projects.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun projet sauvegardé</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Créez votre premier projet de mariage avec l'IA pour générer un plan complet avec budget, planning et prestataires
            </p>
            <Button asChild className="bg-premium-sage hover:bg-premium-sage-dark">
              <Link to="/vibe-wedding">
                <Plus className="w-4 h-4 mr-2" />
                Créer mon projet
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{project.title}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Créé le {format(new Date(project.created_at), 'dd MMM yyyy', { locale: fr })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Informations principales */}
                <div className="space-y-2">
                  {project.wedding_data?.guests && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-premium-sage" />
                      <span>{project.wedding_data.guests} invités</span>
                    </div>
                  )}
                  {project.wedding_data?.budget && (
                    <div className="flex items-center gap-2 text-sm">
                      <Euro className="w-4 h-4 text-premium-sage" />
                      <span>{project.wedding_data.budget.toLocaleString()} €</span>
                    </div>
                  )}
                  {project.wedding_data?.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-premium-sage" />
                      <span className="truncate">{project.wedding_data.location}</span>
                    </div>
                  )}
                  {project.wedding_data?.date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-premium-sage" />
                      <span>{format(new Date(project.wedding_data.date), 'dd MMM yyyy', { locale: fr })}</span>
                    </div>
                  )}
                </div>

                {/* Résumé */}
                {project.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.summary}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/vibewedding?project=${project.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </Button>
                  {project.conversation_id && (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90"
                      onClick={() => navigate(`/vibewedding?conversationId=${project.conversation_id}`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProjectToDelete(project.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Fonctionnalités à venir */}
      <Card className="bg-premium-sage-very-light border-premium-sage/20">
        <CardHeader>
          <CardTitle>Fonctionnalités à venir</CardTitle>
          <CardDescription>
            Prochainement disponibles pour gérer vos projets de mariage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-premium-sage/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-semibold text-premium-sage">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Éditer et personnaliser</h4>
                <p className="text-sm text-muted-foreground">
                  Modifiez chaque détail de votre planning et budget
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-premium-sage/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-semibold text-premium-sage">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Exporter en PDF</h4>
                <p className="text-sm text-muted-foreground">
                  Téléchargez votre projet complet au format PDF
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-premium-sage/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-semibold text-premium-sage">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Partager avec votre moitié</h4>
                <p className="text-sm text-muted-foreground">
                  Collaborez en temps réel sur votre projet de mariage
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le projet sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => projectToDelete && deleteProject(projectToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MonMariage;
