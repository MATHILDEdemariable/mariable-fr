
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Download, Eye, ExternalLink, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PlanningTask, addMinutesToTime } from '@/types/monjourm-mvp';
import MonJourMSharedTimeline from '@/components/mon-jour-m/MonJourMSharedTimeline';
import MonJourMSharedPDFExport from '@/components/mon-jour-m/MonJourMSharedPDFExport';

interface ShareTokenData {
  user_id: string;
  filter_role?: string;
  description?: string;
}

const MonJourMSharedPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [shareData, setShareData] = useState<ShareTokenData | null>(null);
  const [weddingInfo, setWeddingInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedPlanning = async () => {
      if (!token) {
        setError('Token manquant');
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 Validation du token de partage:', token);
        
        // Valider le token
        const { data: tokenValidation, error: tokenError } = await supabase
          .rpc('validate_share_token', { token_value: token });

        if (tokenError) {
          console.error('❌ Erreur validation token:', tokenError);
          throw new Error('Token invalide');
        }

        if (!tokenValidation || tokenValidation.length === 0 || !tokenValidation[0].is_valid) {
          throw new Error('Lien invalide ou expiré');
        }

        const userId = tokenValidation[0].user_id;

        // Récupérer les détails du token (y compris filter_role)
        const { data: tokenDetails, error: tokenDetailsError } = await supabase
          .from('dashboard_share_tokens')
          .select('user_id, filter_role, description')
          .eq('token', token)
          .eq('active', true)
          .single();

        if (tokenDetailsError) {
          console.error('❌ Erreur détails token:', tokenDetailsError);
          throw new Error('Impossible de récupérer les détails du partage');
        }

        setShareData(tokenDetails);

        // Récupérer les informations du mariage
        const { data: coordination, error: coordError } = await supabase
          .from('wedding_coordination')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (coordError) {
          console.error('❌ Erreur coordination:', coordError);
          throw new Error('Impossible de charger les informations du mariage');
        }

        if (coordination && coordination.length > 0) {
          setWeddingInfo(coordination[0]);

          // Récupérer les tâches du planning
          let tasksQuery = supabase
            .from('coordination_planning')
            .select('*')
            .eq('coordination_id', coordination[0].id)
            .order('position');

          const { data: tasksData, error: tasksError } = await tasksQuery;

          if (tasksError) {
            console.error('❌ Erreur tâches:', tasksError);
            throw new Error('Impossible de charger le planning');
          }

          // Normaliser et filtrer les tâches
          let normalizedTasks: PlanningTask[] = (tasksData || []).map((task, index) => {
            let assignedRole: string | undefined;
            if (task.assigned_to) {
              if (Array.isArray(task.assigned_to) && task.assigned_to.length > 0) {
                assignedRole = String(task.assigned_to[0]);
              } else if (typeof task.assigned_to === 'string') {
                assignedRole = task.assigned_to;
              }
            }

            return {
              id: task.id,
              title: task.title,
              description: task.description,
              start_time: task.start_time || "09:00",
              duration: task.duration || 30,
              category: task.category || 'Autre',
              priority: (task.priority as "low" | "medium" | "high") || 'medium',
              assigned_role: assignedRole,
              position: typeof task.position === 'number' ? task.position : index,
              is_ai_generated: task.is_ai_generated || false
            };
          });

          // Filtrer par rôle si spécifié
          if (tokenDetails.filter_role) {
            normalizedTasks = normalizedTasks.filter(task => 
              task.assigned_role === tokenDetails.filter_role
            );
          }

          setTasks(normalizedTasks.sort((a, b) => a.position - b.position));
        }
      } catch (error) {
        console.error('❌ Erreur chargement planning partagé:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    loadSharedPlanning();
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wedding-cream/20 to-wedding-olive/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Lien invalide | Mon Jour-M</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-wedding-cream/20 to-wedding-olive/10 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-serif mb-2 text-wedding-olive">Lien non disponible</h2>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const weddingDate = weddingInfo?.wedding_date ? new Date(weddingInfo.wedding_date) : null;

  return (
    <>
      <Helmet>
        <title>Planning Jour-M Partagé | {weddingInfo?.title || 'Mon Mariage'}</title>
        <meta name="description" content="Planning de mariage partagé en lecture seule" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-wedding-cream/20 to-wedding-olive/10">
        {/* Bannière publique */}
        <div className="bg-wedding-olive/10 border-b border-wedding-olive/20 px-4 py-3 print:hidden">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-wedding-olive" />
              <span className="text-sm font-medium text-wedding-olive">
                Vue publique {shareData?.filter_role && `- Rôle: ${shareData.filter_role}`}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-3.5 w-3.5" />
                Imprimer
              </Button>
              <MonJourMSharedPDFExport 
                tasks={tasks} 
                weddingInfo={weddingInfo}
                filterRole={shareData?.filter_role}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => window.open('https://mariable.fr', '_blank')}
              >
                Mariable <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* En-tête */}
        <div className="bg-white/80 backdrop-blur-sm border-b print:bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-serif text-wedding-olive mb-2">
                {weddingInfo?.title || 'Planning Jour-M'}
              </h1>
              {shareData?.filter_role && (
                <Badge className="mb-2 bg-wedding-olive text-white">
                  Vue filtrée : {shareData.filter_role}
                </Badge>
              )}
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                {weddingDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(weddingDate, 'EEEE d MMMM yyyy', { locale: fr })}</span>
                  </div>
                )}
                {weddingInfo?.wedding_location && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{weddingInfo.wedding_location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune tâche planifiée</h3>
                <p className="text-muted-foreground">
                  {shareData?.filter_role 
                    ? `Aucune tâche assignée au rôle "${shareData.filter_role}"`
                    : "Le planning n'a pas encore été configuré"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <MonJourMSharedTimeline tasks={tasks} />
          )}
        </div>

        {/* Pied de page */}
        <div className="text-center py-6 text-sm text-gray-500 print:hidden">
          <p>
            Planning partagé en lecture seule • Powered by{' '}
            <span className="font-medium text-wedding-olive">Mariable</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default MonJourMSharedPage;
