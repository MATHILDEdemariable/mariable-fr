
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, FileText, Clock, CheckCircle2, Circle, User, Building, Mail, Phone, AlertCircle, Filter, Eye, ExternalLink, Download, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { exportPublicPlanningBrandedToPDF } from '@/services/publicPlanningBrandedExportService';
import PhotoListReadOnly from '@/components/mon-jour-m/PhotoListReadOnly';
import { useToast } from '@/components/ui/use-toast';

interface CoordinationData {
  coordination: any;
  tasks: any[];
  teamMembers: any[];
  documents: any[];
  planningType?: string;
}

const PlanningPublic: React.FC = () => {
  const { t, i18n } = useTranslation('monJourM');
  const { coordinationId } = useParams<{ coordinationId: string }>();
  const [coordinationData, setCoordinationData] = useState<CoordinationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('Jour J');
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [pinterestLinks, setPinterestLinks] = useState<any[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Tri des jours : J-1, Jour J, J+1, puis autres alphabétique
  const sortDays = (days: string[]): string[] => {
    const priority: Record<string, number> = { 'J-1': 0, 'Jour J': 1, 'J+1': 2 };
    return [...days].sort((a, b) => {
      const pa = priority[a] ?? 99;
      const pb = priority[b] ?? 99;
      if (pa !== pb) return pa - pb;
      return a.localeCompare(b);
    });
  };

  const availableDays = React.useMemo(() => {
    if (!coordinationData?.tasks) return [];
    const set = new Set<string>();
    coordinationData.tasks.forEach((t: any) => set.add(t.event_day || 'Jour J'));
    return sortDays(Array.from(set));
  }, [coordinationData?.tasks]);

  useEffect(() => {
    if (coordinationId) {
      loadPublicCoordinationData(coordinationId);
    } else {
      setError(t('public.missingId'));
      setLoading(false);
    }
  }, [coordinationId]);

  // S'assurer que selectedDay est valide selon les jours disponibles
  useEffect(() => {
    if (availableDays.length > 0 && !availableDays.includes(selectedDay)) {
      setSelectedDay(availableDays.includes('Jour J') ? 'Jour J' : availableDays[0]);
    }
  }, [availableDays, selectedDay]);

  useEffect(() => {
    if (coordinationData?.tasks) {
      filterTasks();
    }
  }, [selectedTeamMember, selectedDay, coordinationData?.tasks]);

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
        throw new Error(t('public.loadError', { message: coordError.message }));
      }

      if (!coordination) {
        throw new Error(t('public.planningNotFound'));
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

    let filtered = coordinationData.tasks.filter(
      (task: any) => (task.event_day || 'Jour J') === selectedDay
    );

    if (selectedTeamMember !== 'all') {
      filtered = filtered.filter((task: any) => {
        if (!task.assigned_to || !Array.isArray(task.assigned_to)) return false;
        return task.assigned_to.includes(selectedTeamMember);
      });
    }

    setFilteredTasks(filtered);
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return t('public.timeUndefined');
    
    try {
      if (/^\d{2}:\d{2}$/.test(timeString)) {
        return timeString;
      }
      
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        console.warn('formatTime: Invalid date string:', timeString);
        return t('public.timeUndefined');
      }
      
      const locale = i18n.language.startsWith('en') ? 'en-US' : 'fr-FR';
      return date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris'
      });
    } catch (error) {
      console.warn('formatTime error:', error, 'for timeString:', timeString);
      return t('public.timeUndefined');
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
      alert(t('public.noFile'));
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
                      <p class="text-sm">${t('public.pinterestUnavailable')}</p>
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
            {t('public.seeOnPinterest')}
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
      const tasksToExport = filteredTasks.length > 0 ? filteredTasks : coordinationData.tasks;

      const exportData = {
        coordination: coordinationData.coordination,
        tasks: tasksToExport.map((task: any) => ({
          title: task.title,
          start_time: task.start_time,
          end_time: task.end_time,
          duration: task.duration,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assigned_to: task.assigned_to
        })),
        teamMembers: coordinationData.teamMembers.map((member: any) => ({
          name: member.name,
          role: member.role,
          type: member.type,
          phone: member.phone,
          email: member.email
        })),
        documents: coordinationData.documents,
        pinterestLinks: pinterestLinks
      };


      const success = await exportPublicPlanningBrandedToPDF(exportData);
      
      if (success) {
        toast({
          title: t('public.exportSuccess'),
          description: t('public.exportSuccessDesc'),
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: t('public.exportError'),
        description: t('public.exportErrorDesc'),
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
          <title>{t('public.loadingTitle')}</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive mx-auto mb-4"></div>
            <p className="text-gray-600">{t('public.loading')}</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !coordinationData) {
    return (
      <>
        <Helmet>
          <title>{t('public.notFoundTitle')}</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('public.notAccessible')}</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="bg-gray-100 p-4 rounded-lg text-left text-sm">
              <p className="font-medium text-gray-800 mb-2">{t('public.checkList')}</p>
              <p className="text-gray-600">{t('public.checkLink')}</p>
              <p className="text-gray-600">{t('public.checkExists')}</p>
              <p className="text-gray-600">{t('public.checkInternet')}</p>
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
        <title>{t('public.metaTitle', { title: coordination.title })}</title>
        <meta name="description" content={t('public.metaDescription', { title: coordination.title })} />
        <meta name="robots" content="noindex, nofollow" />
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
                {t('public.jourMByMariable')}
              </p>
              {coordination.wedding_date && (
                <p className="text-xs md:text-sm text-wedding-olive font-medium mt-2">
                  {new Date(coordination.wedding_date).toLocaleDateString(i18n.language.startsWith('en') ? 'en-US' : 'fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-3 mt-4 max-w-md mx-auto">
                <p className="text-xs md:text-sm text-blue-700">
                  <strong>{t('public.consultationMode')}</strong> {t('public.consultationModeDesc')}
                </p>
              </div>
              
              <div className="mt-4 text-center">
                <Button 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
                >
                  {isExporting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {t('public.exporting')}
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      {t('public.exportPdf')}
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
            <TabsList className="hidden md:grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="planning" className="flex items-center gap-2 data-[state=active]:bg-wedding-olive data-[state=active]:text-white">
                <Calendar className="h-4 w-4" />
                Planning ({filteredTasks.length})
              </TabsTrigger>
              <TabsTrigger value="photos" className="flex items-center gap-2 data-[state=active]:bg-wedding-olive data-[state=active]:text-white">
                <Camera className="h-4 w-4" />
                {t('public.tabs.photos')}
              </TabsTrigger>
              <TabsTrigger value="equipe" className="flex items-center gap-2 data-[state=active]:bg-wedding-olive data-[state=active]:text-white">
                <Users className="h-4 w-4" />
                {t('public.tabs.team')} ({teamMembers.length})
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2 data-[state=active]:bg-wedding-olive data-[state=active]:text-white">
                <FileText className="h-4 w-4" />
                {t('public.tabs.documents')} ({documents.length + pinterestLinks.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Navigation mobile fixe en bas */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
              <TabsList className="grid w-full grid-cols-4 rounded-none h-16">
                <TabsTrigger 
                  value="planning" 
                  className="flex flex-col items-center gap-1 text-xs h-full data-[state=active]:bg-wedding-olive data-[state=active]:text-white"
                >
                  <Calendar className="h-4 w-4" />
                  <span>{t('public.tabs.planning')}</span>
                  <span className="text-[10px] opacity-70">({filteredTasks.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="photos" 
                  className="flex flex-col items-center gap-1 text-xs h-full data-[state=active]:bg-wedding-olive data-[state=active]:text-white"
                >
                  <Camera className="h-4 w-4" />
                  <span>{t('public.tabs.photos')}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="equipe" 
                  className="flex flex-col items-center gap-1 text-xs h-full data-[state=active]:bg-wedding-olive data-[state=active]:text-white"
                >
                  <Users className="h-4 w-4" />
                  <span>{t('public.tabs.team')}</span>
                  <span className="text-[10px] opacity-70">({teamMembers.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  className="flex flex-col items-center gap-1 text-xs h-full data-[state=active]:bg-wedding-olive data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4" />
                  <span>{t('public.tabs.docs')}</span>
                  <span className="text-[10px] opacity-70">({documents.length + pinterestLinks.length})</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Onglet Photos */}
            <TabsContent value="photos">
              <PhotoListReadOnly coordinationId={coordination.id} />
            </TabsContent>

            {/* Onglet Planning */}
            <TabsContent value="planning">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    <CardTitle>{t("public.planningTitle")}</CardTitle>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      {/* Filtre par jour */}
                      {availableDays.length > 1 && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <Select value={selectedDay} onValueChange={setSelectedDay}>
                            <SelectTrigger className="w-40 bg-wedding-olive/10 border-wedding-olive/30 hover:bg-wedding-olive/20">
                              <SelectValue placeholder={t("public.chooseDay")} />
                            </SelectTrigger>
                            <SelectContent>
                              {availableDays.map((day) => (
                                <SelectItem key={day} value={day}>
                                  {day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Filtre par équipe */}
                      {teamMembers.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-gray-500" />
                          <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
                            <SelectTrigger className="w-48 bg-wedding-olive/10 border-wedding-olive/30 hover:bg-wedding-olive/20">
                              <SelectValue placeholder={t("public.filterMember")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all" className="font-medium text-wedding-olive">{t("public.allTasks")}</SelectItem>
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
                                     <div className="flex items-center gap-1 mt-1 md:hidden">
                                       <Clock className="h-3 w-3 text-wedding-olive" />
                                       <div className="text-sm font-semibold text-wedding-olive bg-wedding-olive/10 px-2 py-1 rounded">
                                         {formatTime(task.start_time)}
                                         {task.end_time && (
                                           <span className="text-wedding-olive/70 ml-1">
                                             - {formatTime(task.end_time)}
                                           </span>
                                         )}
                                       </div>
                                       {task.duration > 0 && (
                                         <span className="text-xs text-wedding-olive/70">
                                           {task.duration} min
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
                                     {task.priority !== 'medium' && (
                                       <Badge className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority)}`}>
                                         {task.priority === 'high' ? t('public.priority.high') : t('public.priority.low')}
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
                                   <div className="hidden md:flex md:items-center md:justify-end md:gap-1">
                                     <Clock className="h-4 w-4 text-wedding-olive" />
                                     <div className="text-base font-semibold text-wedding-olive bg-wedding-olive/10 px-2 py-1 rounded">
                                       {formatTime(task.start_time)}
                                       {task.end_time && (
                                         <span className="text-wedding-olive/70 ml-1">
                                           - {formatTime(task.end_time)}
                                         </span>
                                       )}
                                     </div>
                                     {task.duration > 0 && (
                                       <span className="text-xs text-wedding-olive/70">
                                         {task.duration} min
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
                            
                            {/* Bouton "{t("public.seeMore")}" sur mobile uniquement si description existe */}
                            {hasDescription && (
                              <div className="mt-3 md:hidden">
                                <button
                                  onClick={() => toggleTaskExpansion(task.id)}
                                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                                >
                                  {isExpanded ? (
                                    <>
                                      {t("public.seeLess")}
                                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                      </svg>
                                    </>
                                  ) : (
                                    <>
                                      {t("public.seeMore")}
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
                      {t("public.people")} ({people.length})
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
                        <p>{t('public.noPerson')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Prestataires */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {t("public.vendors")} ({vendors.length})
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
                        <p>{t('public.noVendor')}</p>
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
                    <CardTitle>{t("public.sharedDocs")}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t("public.sharedDocsHint")}
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
                                  {t("public.view")}
                                </button>
                              ) : (
                                <span className="text-sm text-gray-400 flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  {t("public.textDoc")}
                                </span>
                              )}
                              <p className="text-xs text-gray-400">
                                {new Date(doc.created_at).toLocaleDateString(i18n.language.startsWith('en') ? 'en-US' : 'fr-FR')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>{t('public.noDoc')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Section Pinterest */}
                {pinterestLinks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("public.pinterestTitle")}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {t("public.pinterestHint")}
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
