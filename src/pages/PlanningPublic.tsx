
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, FileText, Clock, CheckCircle2, Circle, User, Building, Mail, Phone, AlertCircle, Filter, Eye } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

interface CoordinationData {
  coordination: any;
  tasks: any[];
  teamMembers: any[];
  documents: any[];
}

const PlanningPublic: React.FC = () => {
  const { coordinationId } = useParams<{ coordinationId: string }>();
  const [coordinationData, setCoordinationData] = useState<CoordinationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('all');
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);

  useEffect(() => {
    if (coordinationId) {
      loadPublicCoordinationData(coordinationId);
    } else {
      setError('ID de coordination manquant');
      setLoading(false);
    }
  }, [coordinationId]);

  useEffect(() => {
    if (coordinationData?.tasks) {
      filterTasks();
    }
  }, [selectedTeamMember, coordinationData?.tasks]);

  const loadPublicCoordinationData = async (id: string) => {
    try {
      setLoading(true);
      console.log('📋 Loading public coordination data for:', id);

      // Récupérer les données de coordination
      const { data: coordination, error: coordError } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (coordError) {
        console.error('❌ Error loading coordination:', coordError);
        throw new Error(`Erreur lors du chargement: ${coordError.message}`);
      }

      if (!coordination) {
        throw new Error('Planning non trouvé. Vérifiez le lien de partage.');
      }

      // Récupérer les tâches
      const { data: tasks, error: tasksError } = await supabase
        .from('coordination_planning')
        .select('*')
        .eq('coordination_id', id)
        .order('position');

      // Récupérer l'équipe
      const { data: teamMembers, error: teamError } = await supabase
        .from('coordination_team')
        .select('*')
        .eq('coordination_id', id)
        .order('created_at');

      // Récupérer les documents (titres seulement)
      const { data: documents, error: docsError } = await supabase
        .from('coordination_documents')
        .select('id, title, category, created_at')
        .eq('coordination_id', id)
        .order('created_at', { ascending: false });

      const result = {
        coordination,
        tasks: tasks || [],
        teamMembers: teamMembers || [],
        documents: documents || []
      };

      console.log('✅ Coordination data loaded successfully');
      setCoordinationData(result);
    } catch (error: any) {
      console.error('❌ Error loading coordination data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    if (!coordinationData?.tasks) return;

    if (selectedTeamMember === 'all') {
      setFilteredTasks(coordinationData.tasks);
    } else {
      const filtered = coordinationData.tasks.filter(task => {
        if (!task.assigned_to || !Array.isArray(task.assigned_to)) return false;
        return task.assigned_to.includes(selectedTeamMember);
      });
      setFilteredTasks(filtered);
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Heure non définie';
    
    try {
      // Si c'est déjà au format HH:MM, on le retourne tel quel
      if (/^\d{2}:\d{2}$/.test(timeString)) {
        return timeString;
      }
      
      // Sinon, on essaie de parser comme une date
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        console.warn('formatTime: Invalid date string:', timeString);
        return 'Heure non définie';
      }
      
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris'
      });
    } catch (error) {
      console.warn('formatTime error:', error, 'for timeString:', timeString);
      return 'Heure non définie';
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
      <>
        <Helmet>
          <title>Chargement du planning | Mariable</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du planning...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !coordinationData) {
    return (
      <>
        <Helmet>
          <title>Planning non trouvé | Mariable</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Planning non accessible</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="bg-gray-100 p-4 rounded-lg text-left text-sm">
              <p className="font-medium text-gray-800 mb-2">Vérifiez :</p>
              <p className="text-gray-600">• Que le lien est correct</p>
              <p className="text-gray-600">• Que le planning existe toujours</p>
              <p className="text-gray-600">• Votre connexion internet</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { coordination, tasks, teamMembers, documents } = coordinationData;
  const people = teamMembers.filter(m => m.type === 'person');
  const vendors = teamMembers.filter(m => m.type === 'vendor');

  return (
    <>
      <Helmet>
        <title>{coordination.title} - Planning partagé | Mariable</title>
        <meta name="description" content={`Planning de mariage partagé : ${coordination.title}`} />
      </Helmet>

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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 max-w-md mx-auto">
                <p className="text-sm text-blue-700">
                  <strong>Mode consultation :</strong> Ce planning est en lecture seule.
                </p>
              </div>
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
                  <div className="flex justify-between items-center">
                    <CardTitle>Timeline du jour J</CardTitle>
                    
                    {/* Filtre par équipe */}
                    {teamMembers.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filtrer par membre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Voir toutes les tâches</SelectItem>
                            {teamMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name} ({member.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredTasks.length > 0 ? (
                    <div className="space-y-4">
                      {filteredTasks.map((task) => (
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
                      <p>
                        {selectedTeamMember === 'all' 
                          ? 'Aucune tâche planifiée' 
                          : 'Aucune tâche assignée à ce membre'
                        }
                      </p>
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
                                  <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                                    {member.phone}
                                  </a>
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
                                  <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                                    {member.phone}
                                  </a>
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
                  <p className="text-sm text-muted-foreground">
                    Les documents sont visibles en consultation uniquement pour des raisons de confidentialité.
                  </p>
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                alert('Aperçu non disponible en mode consultation. Contactez les mariés pour accéder au document.');
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              Visualiser
                            </button>
                            <p className="text-xs text-gray-400">
                              {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
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
    </>
  );
};

export default PlanningPublic;
