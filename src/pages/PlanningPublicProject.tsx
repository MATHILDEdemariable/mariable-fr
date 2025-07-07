import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, FileText, Clock, CheckCircle2, Circle, User, Building, Mail, Phone, AlertCircle, Filter, Eye, Target } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

interface ProjectCoordinationData {
  coordination: any;
  tasks: any[];
  teamMembers: any[];
  documents: any[];
}

const PlanningPublicProject: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [coordinationData, setCoordinationData] = useState<ProjectCoordinationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('all');
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      loadPublicProjectData(token);
    } else {
      setError('Token de partage manquant');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (coordinationData?.tasks) {
      filterTasks();
    }
  }, [selectedTeamMember, coordinationData?.tasks]);

  const loadPublicProjectData = async (shareToken: string) => {
    try {
      setLoading(true);
      console.log('📋 Loading public project data for token:', shareToken);

      // Valider le token et récupérer l'ID de coordination
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('validate_planning_share_token', { token_value: shareToken })
        .single();

      if (tokenError || !tokenData?.is_valid) {
        throw new Error('Token de partage invalide ou expiré');
      }

      const coordinationId = tokenData.coordination_id;

      // Récupérer les données de coordination
      const { data: coordination, error: coordError } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('id', coordinationId)
        .single();

      if (coordError) throw coordError;

      // Récupérer les tâches
      const { data: tasks, error: tasksError } = await supabase
        .from('coordination_planning')
        .select('*')
        .eq('coordination_id', coordinationId)
        .order('position');

      // Récupérer l'équipe
      const { data: teamMembers, error: teamError } = await supabase
        .from('coordination_team')
        .select('*')
        .eq('coordination_id', coordinationId)
        .order('created_at');

      // Récupérer les documents (titres seulement)
      const { data: documents, error: docsError } = await supabase
        .from('coordination_documents')
        .select('id, title, category, created_at')
        .eq('coordination_id', coordinationId)
        .order('created_at', { ascending: false });

      const result = {
        coordination,
        tasks: tasks || [],
        teamMembers: teamMembers || [],
        documents: documents || []
      };

      console.log('✅ Project coordination data loaded successfully');
      setCoordinationData(result);
    } catch (error: any) {
      console.error('❌ Error loading project coordination data:', error);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return 'Normale';
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Chargement du planning projet | Mariable</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de la Mission Mariage...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !coordinationData) {
    return (
      <>
        <Helmet>
          <title>Mission Mariage non trouvée | Mariable</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Mission Mariage non accessible</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="bg-gray-100 p-4 rounded-lg text-left text-sm">
              <p className="font-medium text-gray-800 mb-2">Vérifiez :</p>
              <p className="text-gray-600">• Que le lien est correct</p>
              <p className="text-gray-600">• Que le partage existe toujours</p>
              <p className="text-gray-600">• Votre connexion internet</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { coordination, tasks, teamMembers, documents } = coordinationData;

  return (
    <>
      <Helmet>
        <title>{coordination.title} - Mission Mariage partagée | Mariable</title>
        <meta name="description" content={`Mission Mariage partagée : ${coordination.title}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* En-tête */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Target className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-serif text-foreground">
                  {coordination.title}
                </h1>
              </div>
              <p className="text-gray-600">
                Mission Mariage partagée - Préparation et organisation
              </p>
              {coordination.wedding_date && (
                <p className="text-sm text-primary font-medium mt-2">
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
                  <strong>Mode consultation :</strong> Cette Mission Mariage est en lecture seule.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                TO DO List ({tasks.length})
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

            {/* Onglet TO DO List */}
            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>TO DO List de préparation</CardTitle>
                    
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
                    <div className="space-y-3">
                      {filteredTasks.map((task) => (
                        <Card key={task.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-grow min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center gap-2 ml-4">
                                    <Badge 
                                      variant="outline" 
                                      className={getPriorityColor(task.priority)}
                                    >
                                      {getPriorityLabel(task.priority)}
                                    </Badge>
                                  </div>
                                </div>

                                {task.description && (
                                  <p className="text-sm text-gray-600 mb-3">
                                    {task.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">Catégorie:</span>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                      {task.category}
                                    </Badge>
                                  </div>

                                  {task.assigned_to && Array.isArray(task.assigned_to) && task.assigned_to.length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap">
                                      <User className="h-3 w-3" />
                                      {task.assigned_to.map((memberId: string) => {
                                        const member = teamMembers.find(m => m.id === memberId);
                                        return member ? (
                                          <Badge key={memberId} variant="outline" className="text-xs">
                                            {member.name}
                                          </Badge>
                                        ) : null;
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Équipe Mission Mariage ({teamMembers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {teamMembers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="border rounded-lg p-4">
                          <h3 className="font-medium">{member.name}</h3>
                          <Badge variant="outline" className="mt-1 mb-2 bg-blue-100 text-blue-700">
                            {member.role}
                          </Badge>
                          {member.notes && (
                            <p className="text-sm text-gray-600 mb-2">{member.notes}</p>
                          )}
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
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun membre dans l'équipe</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Documents */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents ({documents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {documents.length > 0 ? (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{doc.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">{doc.category}</Badge>
                                <span className="text-sm text-gray-500">
                                  {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            </div>
                            <Eye className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
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

export default PlanningPublicProject;