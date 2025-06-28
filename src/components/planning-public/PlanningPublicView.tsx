
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users, AlertCircle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { calculateEndTime } from '@/utils/timeCalculations';
import { PublicPlanningView } from '@/types/planningShare';

const PlanningPublicView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [planningData, setPlanningData] = useState<PublicPlanningView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadPlanningData(token);
    }
  }, [token]);

  const loadPlanningData = async (shareToken: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Valider le token et récupérer les données
      const { data: shareData, error: shareError } = await supabase
        .from('planning_share_tokens')
        .select(`
          *,
          wedding_coordination!inner(
            id,
            title,
            description
          )
        `)
        .eq('token', shareToken)
        .eq('is_active', true)
        .single();

      if (shareError || !shareData) {
        throw new Error('Token de partage invalide ou expiré');
      }

      // Vérifier l'expiration
      if (shareData.expires_at && new Date(shareData.expires_at) < new Date()) {
        throw new Error('Ce lien de partage a expiré');
      }

      // Récupérer les tâches
      const { data: tasks, error: tasksError } = await supabase
        .from('coordination_planning')
        .select('*')
        .eq('coordination_id', shareData.coordination_id)
        .order('position');

      if (tasksError) {
        throw tasksError;
      }

      // Filtrer par rôles si nécessaire
      let filteredTasks = tasks || [];
      if (shareData.roles_filter && shareData.roles_filter.length > 0) {
        filteredTasks = filteredTasks.filter(task => {
          if (!task.assigned_to || !Array.isArray(task.assigned_to)) return false;
          return task.assigned_to.some((role: string) => 
            shareData.roles_filter!.includes(role)
          );
        });
      }

      const normalizedTasks = filteredTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        start_time: task.start_time || '09:00',
        duration: task.duration || 30,
        category: task.category || 'Général',
        priority: (task.priority as "low" | "medium" | "high") || 'medium',
        assigned_role: Array.isArray(task.assigned_to) && task.assigned_to.length > 0 
          ? task.assigned_to[0] : undefined,
        position: task.position || 0
      }));

      setPlanningData({
        coordination: shareData.wedding_coordination,
        tasks: normalizedTasks,
        share_info: {
          name: shareData.name,
          roles_filter: shareData.roles_filter,
          expires_at: shareData.expires_at
        }
      });

    } catch (error) {
      console.error('❌ Erreur chargement planning public:', error);
      setError(error instanceof Error ? error.message : 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return 'Moyenne';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du planning...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Accès impossible</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!planningData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="h-6 w-6 text-wedding-olive" />
            <h1 className="text-2xl font-serif text-gray-900">
              {planningData.coordination.title}
            </h1>
          </div>
          {planningData.coordination.description && (
            <p className="text-gray-600 mb-3">{planningData.coordination.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Planning partagé: {planningData.share_info.name}</span>
            </div>
            {planningData.share_info.roles_filter && planningData.share_info.roles_filter.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Filtré pour: {planningData.share_info.roles_filter.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {planningData.tasks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-gray-600">Aucune tâche disponible</h3>
              <p className="text-gray-500">
                {planningData.share_info.roles_filter && planningData.share_info.roles_filter.length > 0
                  ? `Aucune tâche assignée aux rôles sélectionnés`
                  : `Le planning ne contient aucune tâche pour le moment`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {planningData.tasks
              .sort((a, b) => a.position - b.position)
              .map((task) => {
                const endTime = calculateEndTime(task.start_time, task.duration);
                
                return (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Horaires */}
                        <div className="flex-shrink-0">
                          <div className="text-3xl font-bold text-wedding-olive leading-tight">
                            {task.start_time}
                          </div>
                          <div className="text-lg text-gray-600 leading-tight">
                            {endTime}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{task.duration}min</span>
                          </div>
                        </div>
                        
                        {/* Contenu */}
                        <div className="flex-grow min-w-0">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {task.title}
                          </h3>
                          
                          {task.description && (
                            <p className="text-gray-600 mb-3">{task.description}</p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">
                              {task.category}
                            </Badge>
                            
                            <Badge className={getPriorityColor(task.priority)}>
                              {getPriorityLabel(task.priority)}
                            </Badge>
                            
                            {task.assigned_role && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {task.assigned_role}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>Planning généré par Mariable</p>
          {planningData.share_info.expires_at && (
            <p className="mt-1">
              Ce lien expire le {new Date(planningData.share_info.expires_at).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanningPublicView;
