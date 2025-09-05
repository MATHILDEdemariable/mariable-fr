
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, FileText, Clock, CheckCircle2, Circle, User, Building, Mail, Phone, AlertCircle, Filter, Eye, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { exportPublicPlanningBrandedToPDF } from '@/services/publicPlanningBrandedExportService';
import { useToast } from '@/components/ui/use-toast';

interface CoordinationData {
  coordination: any;
  tasks: any[];
  teamMembers: any[];
  documents: any[];
  planningType?: string;
}

const PlanningPublic: React.FC = () => {
  const { coordinationId } = useParams<{ coordinationId: string }>();
  const [coordinationData, setCoordinationData] = useState<CoordinationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('all');
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [pinterestLinks, setPinterestLinks] = useState<any[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

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

      // Détecter le type de planning basé sur l'URL ou les paramètres
      const planningType = window.location.pathname.includes('/planning-public-project/') ? 'project' : 'jour-m';
      
      // Récupérer les tâches selon le type
      const { data: tasks, error: tasksError } = await supabase
        .from('coordination_planning')
        .select('*')
        .eq('coordination_id', id)
        .eq('category', planningType)
        .order('position');

      // Récupérer l'équipe
      const { data: teamMembers, error: teamError } = await supabase
        .from('coordination_team')
        .select('*')
        .eq('coordination_id', id)
        .order('created_at');

      // Récupérer les documents selon le type (avec file_url pour vraie visualisation)
      const { data: documents, error: docsError } = await supabase
        .from('coordination_documents')
        .select('*')
        .eq('coordination_id', id)
        .eq('category', planningType)
        .order('created_at', { ascending: false });

      // Récupérer les liens Pinterest
      const { data: pinterest, error: pinterestError } = await supabase
        .from('coordination_pinterest')
        .select('*')
        .eq('coordination_id', id)
        .order('created_at', { ascending: false });

      const result = {
        coordination,
        tasks: tasks || [],
        teamMembers: teamMembers || [],
        documents: documents || [],
        planningType
      };

      setPinterestLinks(pinterest || []);

      console.log(`✅ Coordination data loaded successfully (${planningType}):`, tasks?.length, 'tasks');
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

  const handleDocumentView = (document: any) => {
    if (document.file_url) {
      window.open(document.file_url, '_blank');
    } else {
      alert('Ce document n\'a pas de fichier associé.');
    }
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const renderPinterestPreview = (link: any) => {
    return (
      <div key={link.id} className="border rounded-lg overflow-hidden mb-4">
        <div className="aspect-video relative bg-gray-100">
          <iframe
            src={`https://assets.pinterest.com/ext/embed.html?id=${link.pinterest_url.match(/pin\/(\d+)/)?.[1] || ''}`}
            className="w-full h-full border-0"
            scrolling="no"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                    <div class="text-center">
                      <div class="text-2xl mb-2">📌</div>
                      <p class="text-sm">Aperçu Pinterest non disponible</p>
                    </div>
                  </div>
                `;
              }
            }}
          />
        </div>
        <div className="p-3">
          <h4 className="font-medium text-sm">{link.title}</h4>
          {link.description && (
            <p className="text-xs text-gray-600 mt-1">{link.description}</p>
          )}
          <a 
            href={link.pinterest_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-xs mt-2 inline-flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Voir sur Pinterest
          </a>
        </div>
      </div>
    );
  };

  // Export to PDF function
  const handleExportPDF = async () => {
    if (!coordinationData) return;
    
    setIsExporting(true);
    try {
      const exportData = {
        coordination: coordinationData.coordination,
        tasks: filteredTasks.length > 0 ? filteredTasks : coordinationData.tasks,
        teamMembers: coordinationData.teamMembers,
        documents: coordinationData.documents,
        pinterestLinks: pinterestLinks
      };

      const success = await exportPublicPlanningBrandedToPDF(exportData);
      
      if (success) {
        toast({
          title: "Export réussi",
          description: "Votre planning a été exporté en PDF",
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le PDF. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
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

  const { coordination, tasks, teamMembers, documents, planningType } = coordinationData;
  const people = teamMembers.filter(m => m.type === 'person' && m.role !== 'Autre prestataire');
  const vendors = teamMembers.filter(m => m.type === 'vendor' || m.role === 'Autre prestataire');

  return (
    <>
      <Helmet>
        <title>{coordination.title} - Planning partagé | Mariable</title>
        <meta name="description" content={`Planning de mariage partagé : ${coordination.title}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* En-tête */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
            <div className="text-center">
              <h1 className="text-xl md:text-3xl font-serif text-wedding-black mb-2">
                {coordination.title}
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                planning & rôle jour-j
              </p>
              {coordination.wedding_date && (
                <p className="text-xs md:text-sm text-wedding-olive font-medium mt-2">
                  {new Date(coordination.wedding_date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-3 mt-4 max-w-md mx-auto">
                <p className="text-xs md:text-sm text-blue-700">
                  <strong>Mode consultation :</strong> Ce planning est en lecture seule.
                </p>
              </div>
              
              {/* Bouton Export PDF */}
              <div className="mt-4 text-center">
                <Button 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
                >
                  {isExporting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter en PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 max-w-6xl pb-20 md:pb-6">
          <Tabs defaultValue="planning" className="w-full">
            {/* Navigation desktop */}
            <TabsList className="hidden md:grid w-full grid-cols-3 mb-6">
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
                Documents ({documents.length + pinterestLinks.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Navigation mobile fixe en bas */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
              <TabsList className="grid w-full grid-cols-3 rounded-none h-16">
                <TabsTrigger 
                  value="planning" 
                  className="flex flex-col items-center gap-1 text-xs h-full data-[state=active]:bg-primary/10"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Planning</span>
                  <span className="text-[10px] opacity-70">({tasks.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="equipe" 
                  className="flex flex-col items-center gap-1 text-xs h-full data-[state=active]:bg-primary/10"
                >
                  <Users className="h-4 w-4" />
                  <span>Équipe</span>
                  <span className="text-[10px] opacity-70">({teamMembers.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  className="flex flex-col items-center gap-1 text-xs h-full data-[state=active]:bg-primary/10"
                >
                  <FileText className="h-4 w-4" />
                  <span>Docs</span>
                  <span className="text-[10px] opacity-70">({documents.length + pinterestLinks.length})</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Onglet Planning */}
            <TabsContent value="planning">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Planning</CardTitle>
                    
                    {/* Filtre par équipe */}
                    {teamMembers.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
                          <SelectTrigger className="w-48 bg-wedding-olive/10 border-wedding-olive/30 hover:bg-wedding-olive/20">
                            <SelectValue placeholder="Filtrer par membre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all" className="font-medium text-wedding-olive">Voir toutes les tâches</SelectItem>
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
                    <div className="space-y-3 md:space-y-4">
                      {filteredTasks.map((task) => {
                        const isExpanded = expandedTasks.has(task.id);
                        const hasDescription = task.description && task.description.trim().length > 0;
                        
                        return (
                          <div key={task.id} className="p-3 md:p-4 border rounded-lg bg-white shadow-sm">
                            {/* Layout mobile : colonne - Layout desktop : ligne */}
                            <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                              {/* Partie gauche : titre, status et heure */}
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {getStatusIcon(task.status)}
                                <div className="flex-1 min-w-0">
                                  {/* Titre principal */}
                                  <h3 className={`text-sm md:text-base font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                    {task.title}
                                  </h3>
                                  
                                  {/* Heure sur mobile directement sous le titre */}
                                  {task.start_time && (
                                    <div className="text-xs md:text-sm font-medium text-primary mt-1 md:hidden">
                                      {formatTime(task.start_time)}
                                      {task.end_time && (
                                        <span className="text-gray-500 ml-1">
                                          - {formatTime(task.end_time)}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Description - cachée par défaut sur mobile */}
                                  {hasDescription && (
                                    <div className={`mt-2 ${isExpanded ? 'block' : 'hidden md:block'}`}>
                                      <p className="text-xs md:text-sm text-gray-600">{task.description}</p>
                                    </div>
                                  )}
                                  
                                  {/* Badges et infos secondaires */}
                                  <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-2 text-xs">
                                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                                      {task.duration} min
                                    </Badge>
                                    {task.priority !== 'medium' && (
                                      <Badge className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority)}`}>
                                        {task.priority === 'high' ? 'Élevée' : 'Faible'}
                                      </Badge>
                                    )}
                                    <span className="text-gray-500 capitalize text-xs">{task.category}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Partie droite : heure (desktop) et assignations */}
                              <div className="flex flex-col md:text-right gap-2">
                                {/* Heure sur desktop */}
                                {task.start_time && (
                                  <div className="hidden md:block text-sm font-medium">
                                    {formatTime(task.start_time)}
                                    {task.end_time && (
                                      <span className="text-gray-500 ml-1">
                                        - {formatTime(task.end_time)}
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                {/* Membres assignés */}
                                {task.assigned_to && Array.isArray(task.assigned_to) && task.assigned_to.length > 0 && (
                                  <div className="flex flex-wrap gap-1 md:justify-end">
                                    {task.assigned_to.map((memberId: string) => {
                                      const member = teamMembers.find(m => m.id === memberId);
                                      return member ? (
                                        <Badge key={memberId} variant="secondary" className="text-xs px-2 py-0.5">
                                          <User className="h-3 w-3 mr-1" />
                                          {member.name}
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Bouton "Voir plus" sur mobile uniquement si description existe */}
                            {hasDescription && (
                              <div className="mt-3 md:hidden">
                                <button
                                  onClick={() => toggleTaskExpansion(task.id)}
                                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                                >
                                  {isExpanded ? (
                                    <>
                                      Voir moins
                                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                      </svg>
                                    </>
                                  ) : (
                                    <>
                                      Voir plus
                                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
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
              <div className="space-y-6">
                {/* Section Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle>Documents partagés</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Cliquez sur un document pour le visualiser ou le télécharger.
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
                                {doc.description && (
                                  <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {doc.file_url ? (
                                <button
                                  onClick={() => handleDocumentView(doc)}
                                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  Visualiser
                                </button>
                              ) : (
                                <span className="text-sm text-gray-400 flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  Document texte
                                </span>
                              )}
                              <p className="text-xs text-gray-400">
                                {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Aucun document partagé</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Section Pinterest */}
                {pinterestLinks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Inspirations Pinterest</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Idées et inspirations partagées par les mariés.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pinterestLinks.map((link) => renderPinterestPreview(link))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default PlanningPublic;
