
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, FileText, Clock, CheckCircle2, Circle, User, Building, Mail, Phone, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { validateShareToken } from '@/utils/tokenUtils';

interface WeddingData {
  coordination: any;
  tasks: any[];
  teamMembers: any[];
  documents: any[];
}

const JourMVue: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('JourMVue component mounted with token:', token);
    if (token) {
      loadSharedData(token);
      setupRealtimeSubscription(token);
    } else {
      setError('Token de partage manquant');
      setLoading(false);
    }
  }, [token]);

  const loadSharedData = async (shareToken: string) => {
    console.log('Loading shared data for token:', shareToken);
    
    try {
      // Utiliser la fonction utilitaire pour valider le token
      const { isValid, userId } = await validateShareToken(shareToken);
      
      console.log('Token validation result:', { isValid, userId });
      
      if (!isValid || !userId) {
        setError('Token de partage invalide ou expiré');
        setLoading(false);
        return;
      }

      // Récupérer les données de coordination
      const { data: coordination, error: coordError } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('user_id', userId)
        .single();

      console.log('Coordination data:', coordination, 'Error:', coordError);

      if (coordError || !coordination) {
        setError('Données de mariage non trouvées');
        setLoading(false);
        return;
      }

      // Récupérer les tâches
      const { data: tasks, error: tasksError } = await supabase
        .from('coordination_planning')
        .select('*')
        .eq('coordination_id', coordination.id)
        .order('position');

      if (tasksError) {
        console.error('Error loading tasks:', tasksError);
      }

      // Récupérer l'équipe
      const { data: teamMembers, error: teamError } = await supabase
        .from('coordination_team')
        .select('*')
        .eq('coordination_id', coordination.id)
        .order('created_at');

      if (teamError) {
        console.error('Error loading team:', teamError);
      }

      // Récupérer les documents (titres seulement pour la vue publique)
      const { data: documents, error: docsError } = await supabase
        .from('coordination_documents')
        .select('id, title, category, created_at')
        .eq('coordination_id', coordination.id)
        .order('created_at', { ascending: false });

      if (docsError) {
        console.error('Error loading documents:', docsError);
      }

      const weddingDataResult = {
        coordination,
        tasks: tasks || [],
        teamMembers: teamMembers || [],
        documents: documents || []
      };

      console.log('Final wedding data:', weddingDataResult);
      setWeddingData(weddingDataResult);
    } catch (error) {
      console.error('Error loading shared data:', error);
      setError(`Erreur lors du chargement des données: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = (shareToken: string) => {
    const channel = supabase
      .channel(`jour-m-public-${shareToken}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coordination_planning'
        },
        () => {
          console.log('Real-time update received for planning');
          if (token) loadSharedData(token);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coordination_team'
        },
        () => {
          console.log('Real-time update received for team');
          if (token) loadSharedData(token);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du planning...</p>
        </div>
      </div>
    );
  }

  if (error || !weddingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Accès impossible</h1>
          <p className="text-gray-600 mb-4">{error || 'Données non trouvées'}</p>
          <div className="bg-gray-100 p-4 rounded-lg text-left text-sm">
            <p className="font-medium text-gray-800 mb-2">Informations de débogage :</p>
            <p className="text-gray-600">Token: {token || 'Non fourni'}</p>
            <p className="text-gray-600">URL: {window.location.href}</p>
          </div>
        </div>
      </div>
    );
  }

  const { coordination, tasks, teamMembers, documents } = weddingData;
  const people = teamMembers.filter(m => m.type === 'person');
  const vendors = teamMembers.filter(m => m.type === 'vendor');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-wedding-black mb-2">
              {coordination.title}
            </h1>
            <p className="text-gray-600">
              Planning partagé du mariage
            </p>
            {coordination.wedding_date && (
              <p className="text-sm text-wedding-olive font-medium mt-2">
                {new Date(coordination.wedding_date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Tabs defaultValue="planning" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Planning ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="equipe" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Équipe ({teamMembers.length})
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents ({documents.length})
            </TabsTrigger>
          </TabsList>

          {/* Onglet Planning */}
          <TabsContent value="planning">
            <Card>
              <CardHeader>
                <CardTitle>Timeline du jour J</CardTitle>
              </CardHeader>
              <CardContent>
                {tasks.length > 0 ? (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {getStatusIcon(task.status)}
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <Badge variant="outline">{task.duration} min</Badge>
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority === 'high' ? 'Élevée' : task.priority === 'medium' ? 'Moyenne' : 'Faible'}
                                </Badge>
                                <span className="capitalize">{task.category}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {task.start_time && (
                              <div className="text-sm font-medium mb-2">
                                {formatTime(task.start_time)}
                                {task.end_time && (
                                  <span className="text-gray-500 ml-1">
                                    - {formatTime(task.end_time)}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {task.assigned_to && Array.isArray(task.assigned_to) && task.assigned_to.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {task.assigned_to.map((memberId: string) => {
                                  const member = teamMembers.find(m => m.id === memberId);
                                  return member ? (
                                    <Badge key={memberId} variant="secondary">
                                      <User className="h-3 w-3 mr-1" />
                                      {member.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune tâche planifiée</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Équipe */}
          <TabsContent value="equipe">
            <div className="space-y-6">
              {/* Personnes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personnes ({people.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {people.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {people.map((member) => (
                        <div key={member.id} className="border rounded-lg p-4">
                          <h3 className="font-medium">{member.name}</h3>
                          <Badge variant="outline" className="mt-1 mb-2">
                            {member.role}
                          </Badge>
                          <div className="space-y-1 text-sm text-gray-600">
                            {member.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span className="truncate">{member.email}</span>
                              </div>
                            )}
                            {member.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune personne dans l'équipe</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Prestataires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Prestataires ({vendors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {vendors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vendors.map((member) => (
                        <div key={member.id} className="border rounded-lg p-4">
                          <h3 className="font-medium">{member.name}</h3>
                          <Badge variant="outline" className="mt-1 mb-2 bg-blue-50 text-blue-700">
                            {member.role}
                          </Badge>
                          <div className="space-y-1 text-sm text-gray-600">
                            {member.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span className="truncate">{member.email}</span>
                              </div>
                            )}
                            {member.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun prestataire dans l'équipe</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Documents */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents partagés</CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <h3 className="font-medium">{doc.title}</h3>
                            <p className="text-sm text-gray-500 capitalize">{doc.category}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun document partagé</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JourMVue;
