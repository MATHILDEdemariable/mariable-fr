import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, FileText, Clock, CheckCircle2, Circle, User, Building, Mail, Phone, AlertCircle, Filter, Eye, ExternalLink, Download, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { validatePlanningShareToken, getPublicCoordinationData } from '@/utils/tokenUtils';

interface WeddingData {
  coordination: any;
  tasks: any[];
  teamMembers: any[];
  documents: any[];
  pinterestLinks: any[];
}

const JourMVue: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('all');
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    console.log('🚀 JourMVue component mounted with token:', token);
    if (token) {
      loadSharedData(token);
    } else {
      setError('Token de partage manquant');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (weddingData?.tasks) {
      filterTasks();
    }
  }, [selectedTeamMember, weddingData?.tasks]);

  const loadSharedData = async (shareToken: string) => {
    console.log('📊 Loading shared data for token:', shareToken);
    
    try {
      setLoading(true);
      
      // Valider le token avec la nouvelle fonction simplifiée
      const { isValid, coordinationId } = await validatePlanningShareToken(shareToken);
      
      console.log('✅ Planning token validation result:', { isValid, coordinationId });
      
      if (!isValid || !coordinationId) {
        setError('Token de partage invalide ou expiré');
        setLoading(false);
        return;
      }

      // Récupérer les données publiques
      const weddingDataResult = await getPublicCoordinationData(coordinationId);
      
      console.log('📦 Final wedding data:', weddingDataResult);
      setWeddingData(weddingDataResult);
    } catch (error) {
      console.error('❌ Error loading shared data:', error);
      setError(`Erreur lors du chargement des données: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    if (!weddingData?.tasks) return;

    if (selectedTeamMember === 'all') {
      setFilteredTasks(weddingData.tasks);
    } else {
      const filtered = weddingData.tasks.filter(task => {
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

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { exportPublicPlanningToPDF } = await import('@/services/publicPlanningExportService');
      const success = await exportPublicPlanningToPDF({
        coordination,
        tasks: filteredTasks,
        teamMembers,
        documents,
        pinterestLinks
      }, `${coordination.title || 'Planning'}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      if (!success) {
        alert('Erreur lors de l\'export PDF');
      }
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
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
            <p className="text-gray-600">Navigation privée: {navigator.cookieEnabled ? 'Non' : 'Possible'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { coordination, tasks, teamMembers, documents, pinterestLinks } = weddingData;
  
  // Filtrage des équipes avec gestion "Autre prestataire"
  const people = teamMembers.filter(m => m.type === 'person' && m.role !== 'Autre prestataire');
  const vendors = teamMembers.filter(m => m.type === 'vendor' || m.role === 'Autre prestataire');

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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 max-w-md mx-auto">
              <p className="text-sm text-blue-700">
                <strong>Mode consultation :</strong> Ce planning est en lecture seule. 
                Contactez les mariés pour toute modification.
              </p>
            </div>
            
            {/* Bouton Export PDF principal bien visible */}
            <div className="mt-6">
              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter en PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Tabs defaultValue="planning" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
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
            <TabsTrigger value="pinterest" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Pinterest ({pinterestLinks?.length || 0})
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
                                {task.priority === 'low' && (
                                  <Badge className={getPriorityColor(task.priority)}>
                                    Faible
                                  </Badge>
                                )}
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
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Documents partagés</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Les documents sont visibles en consultation uniquement pour des raisons de confidentialité.
                    </p>
                  </div>
                </div>
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
                              {doc.description && (
                                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                              )}
                              <p className="text-sm text-gray-500 capitalize">{doc.category}</p>
                            </div>
                          </div>
                           <div className="flex items-center gap-2">
                             {doc.file_url && (
                               <div className="flex gap-2">
                                 <Button 
                                   variant="outline" 
                                   size="sm"
                                   onClick={() => {
                                     try {
                                       // Construire l'URL publique directe pour Supabase Storage
                                       let publicUrl = doc.file_url;
                                       
                                       // Si c'est une URL signée Supabase, la convertir en URL publique
                                       if (doc.file_url.includes('supabase') && doc.file_url.includes('/storage/v1/object/sign/')) {
                                         publicUrl = doc.file_url.replace('/storage/v1/object/sign/', '/storage/v1/object/public/');
                                       }
                                       
                                       window.open(publicUrl, '_blank');
                                     } catch (error) {
                                       console.error('Erreur lors de l\'ouverture du document:', error);
                                       // Fallback vers l'URL originale
                                       window.open(doc.file_url, '_blank');
                                     }
                                   }}
                                 >
                                   <Eye className="h-4 w-4 mr-1" />
                                   Visualiser
                                 </Button>
                                 <Button 
                                   variant="ghost" 
                                   size="sm"
                                   onClick={() => {
                                     try {
                                       const link = document.createElement('a');
                                       link.href = doc.file_url;
                                       link.download = doc.title;
                                       link.target = '_blank';
                                       document.body.appendChild(link);
                                       link.click();
                                       document.body.removeChild(link);
                                     } catch (error) {
                                       console.error('Erreur lors du téléchargement:', error);
                                       window.open(doc.file_url, '_blank');
                                     }
                                   }}
                                 >
                                   <Download className="h-4 w-4 mr-1" />
                                   Télécharger
                                 </Button>
                               </div>
                             )}
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

          {/* Onglet Pinterest */}
          <TabsContent value="pinterest">
            <Card>
              <CardHeader>
                <CardTitle>Inspirations Pinterest</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Découvrez les inspirations Pinterest sélectionnées pour ce mariage
                </p>
              </CardHeader>
              <CardContent>
                {pinterestLinks && pinterestLinks.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pinterestLinks.map((link: any) => (
                      <Card key={link.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-5 w-5 text-pink-500" />
                            <h3 className="font-medium">{link.title}</h3>
                          </div>
                        </div>

                        {link.description && (
                          <p className="text-sm text-gray-600 mb-3">{link.description}</p>
                        )}

                        <div className="border rounded-lg overflow-hidden mb-3">
                          <div className="aspect-video relative bg-gray-100 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📌</div>
                              <p className="text-sm text-gray-600">Inspiration Pinterest</p>
                            </div>
                          </div>
                        </div>

                        <a 
                          href={link.pinterest_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Voir sur Pinterest
                        </a>

                        <div className="text-xs text-gray-400 mt-2">
                          Ajouté le {new Date(link.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50 text-pink-400" />
                    <p>Aucune inspiration Pinterest partagée</p>
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
