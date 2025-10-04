import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Users, MapPin, Euro, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WeddingProject {
  id: string;
  title: string;
  summary: string;
  wedding_data: any;
  budget_breakdown: any[];
  timeline: any[];
  vendors: any[];
  created_at: string;
  updated_at: string;
}

const MonMariageDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<WeddingProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('wedding_projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setProject(data as any);
    } catch (error: any) {
      console.error('Error loading project:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le projet",
        variant: "destructive"
      });
      navigate('/dashboard/mon-mariage');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-sage"></div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard/mon-mariage')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold">{project.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Créé le {format(new Date(project.created_at), 'dd MMMM yyyy', { locale: fr })}
            </p>
          </div>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {project.wedding_data?.guests && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-premium-sage-very-light rounded-lg">
                  <Users className="w-5 h-5 text-premium-sage" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{project.wedding_data.guests}</p>
                  <p className="text-sm text-muted-foreground">Invités</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {project.wedding_data?.budget && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-premium-sage-very-light rounded-lg">
                  <Euro className="w-5 h-5 text-premium-sage" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{project.wedding_data.budget.toLocaleString()} €</p>
                  <p className="text-sm text-muted-foreground">Budget</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {project.wedding_data?.location && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-premium-sage-very-light rounded-lg">
                  <MapPin className="w-5 h-5 text-premium-sage" />
                </div>
                <div>
                  <p className="text-sm font-semibold truncate">{project.wedding_data.location}</p>
                  <p className="text-sm text-muted-foreground">Localisation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {project.wedding_data?.date && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-premium-sage-very-light rounded-lg">
                  <Calendar className="w-5 h-5 text-premium-sage" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {format(new Date(project.wedding_data.date), 'dd MMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-sm text-muted-foreground">Date</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Résumé */}
      {project.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé du projet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{project.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs Budget / Timeline */}
      <Tabs defaultValue="budget" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="timeline">Rétroplanning</TabsTrigger>
        </TabsList>

        <TabsContent value="budget" className="space-y-4">
          {project.budget_breakdown && project.budget_breakdown.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.budget_breakdown.map((item: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{item.category}</h4>
                        <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      </div>
                      <p className="text-2xl font-bold text-premium-sage">
                        {item.amount.toLocaleString()} €
                      </p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Aucune répartition budgétaire disponible</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          {project.timeline && project.timeline.length > 0 ? (
            <div className="space-y-4">
              {project.timeline.map((item: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.category}</CardTitle>
                        {item.timeframe && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{item.timeframe}</span>
                          </div>
                        )}
                      </div>
                      {item.priority && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.priority === 'high' ? 'bg-red-100 text-red-700' :
                          item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {item.priority === 'high' ? 'Haute' : item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium mb-2">{item.task}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Aucun rétroplanning disponible</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Fonctionnalités à venir */}
      <Card className="bg-premium-sage-very-light border-premium-sage/20">
        <CardHeader>
          <CardTitle>Fonctionnalité à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            La vue détaillée sera bientôt disponible avec toutes les fonctionnalités d'édition, d'export PDF et de partage.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonMariageDetail;
