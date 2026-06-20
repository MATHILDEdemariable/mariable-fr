import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles, Calendar, Clock, Users, Trash2, CheckSquare, Square, Save, HelpCircle, X, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PersonalizedScenarioTab from './PersonalizedScenarioTab';
import UnifiedTaskModal from './UnifiedTaskModal';
import EnhancedDragDropTimeline from './MonJourMTimeline';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';
import MonJourMOnboardingModal from './MonJourMOnboardingModal';
import MathildeExampleModal from './MathildeExampleModal';

interface MonJourMPlanningContentProps {
  coordinationId: string;
}

// Interface pour typer les paramètres JSON de façon sécurisée
interface ReferenceTimeParams {
  reference_time?: string;
}

const MonJourMPlanningContent: React.FC<MonJourMPlanningContentProps> = ({ 
  coordinationId 
}) => {
  const { t } = useTranslation('monJourM');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [events, setEvents] = useState<PlanningEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [referenceTime, setReferenceTime] = useState(new Date());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMathildeModal, setShowMathildeModal] = useState(false);
  const [activeDay, setActiveDay] = useState<string>('Jour J');
  const [customDays, setCustomDays] = useState<string[]>([]);
  const { toast } = useToast();
  
  const { coordination } = useMonJourMCoordination();

  console.log('🎯 MonJourMPlanningContent: coordination:', coordinationId);

  // Vérifier si l'onboarding doit être affiché
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('mon-jour-m-onboarding-seen');
    if (!hasSeenOnboarding) {
      // Petit délai pour permettre le chargement de l'interface
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleShowOnboarding = () => {
    setShowOnboarding(true);
  };

  // Fonction de sauvegarde avec debounce
  const saveEventsToDatabase = useCallback(async (eventsToSave: PlanningEvent[]) => {
    if (!coordinationId) return;
    
    setIsSaving(true);
    try {
      console.log('💾 Saving events to database:', eventsToSave.length);
      
      for (const [index, event] of eventsToSave.entries()) {
        await supabase
          .from('coordination_planning')
          .update({
            title: event.title,
            description: event.notes,
            start_time: event.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            duration: event.duration,
            assigned_to: event.assignedTo || [],
            position: index,
            event_day: event.eventDay || 'Jour J',
            category: 'jour-m' // S'assurer que la catégorie reste 'jour-m'
          })
          .eq('id', event.id)
          .eq('category', 'jour-m'); // Sécurité supplémentaire
      }
      
      console.log('✅ All events saved successfully');
    } catch (error) {
      console.error('❌ Error saving events:', error);
      toast({
        title: t('planning.toasts.saveError'),
        description: t('planning.toasts.saveErrorDesc'),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [coordinationId, toast]);

  // Debounced save (500ms delay)
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (events: PlanningEvent[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          saveEventsToDatabase(events);
        }, 500);
      };
    })(),
    [saveEventsToDatabase]
  );

  // Initialiser l'heure de référence
  useEffect(() => {
    const initReferenceTime = async () => {
      try {
        const { data, error } = await supabase
          .from('coordination_parameters')
          .select('parameters')
          .eq('user_id', coordination?.user_id || '')
          .eq('name', 'reference_time')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;

        if (data?.parameters && typeof data.parameters === 'object' && data.parameters !== null && !Array.isArray(data.parameters)) {
          const params = data.parameters as unknown as ReferenceTimeParams;
          if (params.reference_time) {
            const [hours, minutes] = params.reference_time.split(':').map(Number);
            const refTime = new Date();
            refTime.setHours(hours, minutes, 0, 0);
            setReferenceTime(refTime);
          } else {
            const defaultTime = new Date();
            defaultTime.setHours(15, 0, 0, 0);
            setReferenceTime(defaultTime);
          }
        } else {
          const defaultTime = new Date();
          defaultTime.setHours(15, 0, 0, 0);
          setReferenceTime(defaultTime);
        }
      } catch (error) {
        console.error('❌ Error loading reference time:', error);
        const defaultTime = new Date();
        defaultTime.setHours(15, 0, 0, 0);
        setReferenceTime(defaultTime);
      }
    };

    if (coordinationId && coordination?.user_id) {
      initReferenceTime();
    }
  }, [coordinationId, coordination?.user_id]);

  // Charger les membres d'équipe
  useEffect(() => {
    const loadTeamMembers = async () => {
      if (!coordinationId) return;

      try {
        const { data, error } = await supabase
          .from('coordination_team')
          .select('*')
          .eq('coordination_id', coordinationId);

        if (error) throw error;

        console.log('👥 Loaded team members:', data?.length);
        setTeamMembers(data || []);
      } catch (error) {
        console.error('❌ Error loading team members:', error);
      }
    };

    loadTeamMembers();
  }, [coordinationId]);

  // Charger les événements existants avec ordre par position - UNIQUEMENT au premier chargement
  useEffect(() => {
    const loadExistingPlanning = async () => {
      if (!coordination?.user_id) return;
      
      // Ne recharger que si aucun événement n'est déjà présent (évite les rechargements intempestifs)
      if (events.length > 0) {
        console.log('📋 Events already loaded, skipping reload to prevent overwrite');
        return;
      }

      try {
        setIsLoading(true);
        console.log('📋 Loading existing planning for user:', coordination.user_id);

        const { data, error } = await supabase
          .from('coordination_planning')
          .select('*')
          .eq('coordination_id', coordinationId)
          .eq('category', 'jour-m')
          .order('position', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const convertedEvents: PlanningEvent[] = data.map((item: any) => {
            let startTime: Date;
            
            if (item.start_time) {
              const [hours, minutes] = item.start_time.split(':').map(Number);
              startTime = new Date(referenceTime);
              startTime.setHours(hours, minutes, 0, 0);
            } else {
              startTime = new Date(referenceTime);
            }
            
            return {
              id: item.id,
              title: item.title,
              notes: item.description,
              startTime,
              endTime: new Date(startTime.getTime() + (item.duration || 30) * 60000),
              duration: item.duration || 30,
              category: item.category || 'general',
              type: item.category || 'general',
              assignedTo: Array.isArray(item.assigned_to) ? item.assigned_to : [],
              eventDay: item.event_day || "Jour J"
            };
          });
          
          console.log('✅ Loaded', convertedEvents.length, 'existing events');
          setEvents(convertedEvents);
        } else {
          console.log('📋 No existing planning found');
          setEvents([]);
        }
      } catch (error) {
        console.error('❌ Error loading existing planning:', error);
        toast({
          title: t('planning.toasts.loadError'),
          description: t('planning.toasts.loadErrorDesc'),
          variant: "destructive"
        });
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingPlanning();
  }, [coordination?.user_id, coordinationId, referenceTime]);

  // Gestionnaire pour l'intégration des événements générés par l'IA
  const handlePlanningGenerated = async (newEvents: PlanningEvent[]) => {
    console.log('🤖 Handling AI-generated planning:', newEvents.length, 'events');
    
    // Si aucun nouvel événement (cas des suggestions), recharger les données depuis la base
    if (newEvents.length === 0) {
      console.log('🔄 Reloading planning data from database');
      try {
        const { data, error } = await supabase
          .from('coordination_planning')
          .select('*')
          .eq('coordination_id', coordinationId)
          .eq('category', 'jour-m')
          .order('position', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const convertedEvents: PlanningEvent[] = data.map((item: any) => {
            let startTime: Date;
            
            if (item.start_time) {
              const [hours, minutes] = item.start_time.split(':').map(Number);
              startTime = new Date(referenceTime);
              startTime.setHours(hours, minutes, 0, 0);
            } else {
              startTime = new Date(referenceTime);
            }
            
            return {
              id: item.id,
              title: item.title,
              notes: item.description,
              startTime,
              endTime: new Date(startTime.getTime() + (item.duration || 30) * 60000),
              duration: item.duration || 30,
              category: item.category || 'general',
              type: item.category || 'general',
              assignedTo: Array.isArray(item.assigned_to) ? item.assigned_to : [],
              eventDay: item.event_day || "Jour J"
            };
          });
          
          console.log('✅ Reloaded', convertedEvents.length, 'events from database');
          setEvents(convertedEvents);
        }
        
        setIsTaskModalOpen(false);
        return;
      } catch (error) {
        console.error('❌ Error reloading planning data:', error);
        toast({
          title: t('planning.toasts.reloadError'),
          description: t('planning.toasts.reloadErrorDesc'),
          variant: "destructive"
        });
        return;
      }
    }
    
    // Cas des événements AI personnalisés - insertion directe en base de données
    console.log('💾 Saving AI-generated events to database');
    try {
      const eventsToSave = newEvents.map((event, index) => ({
        coordination_id: coordinationId,
        title: event.title,
        description: event.notes || event.title,
        start_time: event.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        duration: event.duration,
        category: 'jour-m',
        priority: 'medium',
        position: events.length + index,
        event_day: event.eventDay || activeDay || 'Jour J',
        assigned_to: event.assignedTo || []
      }));

      console.log('📝 Events to save:', eventsToSave);

      const { data, error } = await supabase
        .from('coordination_planning')
        .insert(eventsToSave)
        .select();

      if (error) {
        console.error('❌ Database insert error:', error);
        throw error;
      }

      console.log('✅ Events saved to database:', data);

      // Convertir les données sauvegardées en événements de planning
      const convertedNewEvents: PlanningEvent[] = data.map((item: any) => {
        const [hours, minutes] = item.start_time.split(':').map(Number);
        const startTime = new Date(referenceTime);
        startTime.setHours(hours, minutes, 0, 0);
        
        return {
          id: item.id,
          title: item.title,
          notes: item.description,
          startTime,
          endTime: new Date(startTime.getTime() + item.duration * 60000),
          duration: item.duration,
          category: item.category,
          type: item.category,
          
          assignedTo: Array.isArray(item.assigned_to) ? item.assigned_to : [],
              eventDay: item.event_day || "Jour J"
        };
      });

      // Mettre à jour l'état local avec les nouveaux événements
      setEvents(prev => {
        const updatedEvents = [...prev, ...convertedNewEvents];
        console.log('🔄 Updated events state with', updatedEvents.length, 'total events');
        return updatedEvents;
      });
      
      toast({
        title: t('planning.toasts.updated'),
        description: newEvents.length > 1
          ? t('planning.toasts.addedPlural', { count: newEvents.length })
          : t('planning.toasts.addedSingular', { count: newEvents.length })
      });
      
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error('❌ Error handling AI planning:', error);
      toast({
        title: t('planning.toasts.integrationError'),
        description: t('planning.toasts.integrationErrorDesc', { message: error instanceof Error ? error.message : t('planning.toasts.unknownError') }),
        variant: "destructive"
      });
    }
  };

  // Gestionnaire pour la mise à jour des événements avec sauvegarde auto
  const handleEventsUpdate = async (updatedEvents: PlanningEvent[]) => {
    console.log('🔄 Updating events from timeline:', updatedEvents.length);
    setEvents(updatedEvents);
    
    // Sauvegarde automatique avec debounce
    debouncedSave(updatedEvents);
  };

  // Gestionnaire pour l'ajout d'événement manuel
  const handleManualEventAdded = (newEvent: PlanningEvent) => {
    const withDay = { ...newEvent, eventDay: newEvent.eventDay || activeDay };
    setEvents(prev => [...prev, withDay]);
    // Persister le event_day si l'événement vient d'être créé en base
    if (withDay.id) {
      supabase.from('coordination_planning').update({ event_day: withDay.eventDay })
        .eq('id', withDay.id).then(({ error }) => {
          if (error) console.error('❌ update event_day:', error);
        });
    }
  };

  // Gestion de la sélection multiple
  const handleSelectionChange = (eventId: string, selected: boolean) => {
    setSelectedEvents(prev => 
      selected 
        ? [...prev, eventId]
        : prev.filter(id => id !== eventId)
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map(e => e.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedEvents.length === 0) return;

    const confirmed = window.confirm(
      selectedEvents.length > 1
        ? t('planning.deleteConfirm_other', { count: selectedEvents.length })
        : t('planning.deleteConfirm_one', { count: selectedEvents.length })
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('coordination_planning')
        .delete()
        .in('id', selectedEvents);

      if (error) throw error;

      const updatedEvents = events.filter(event => !selectedEvents.includes(event.id));
      setEvents(updatedEvents);
      setSelectedEvents([]);
      setSelectionMode(false);

      toast({
        title: t('planning.toasts.tasksDeleted'),
        description: selectedEvents.length > 1
          ? t('planning.toasts.deletedPlural', { count: selectedEvents.length })
          : t('planning.toasts.deletedSingular', { count: selectedEvents.length })
      });
    } catch (error) {
      console.error('❌ Error deleting selected events:', error);
      toast({
        title: t('planning.toasts.deleteError'),
        description: t('planning.toasts.deleteErrorDesc'),
        variant: "destructive"
      });
    }
  };

  const getEventStats = () => {
    const total = events.length;
    const assigned = events.filter(e => e.assignedTo && e.assignedTo.length > 0).length;
    
    return { total, assigned };
  };

  const stats = getEventStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques compactes */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-wedding-olive" />
          <span>{t('planning.stats.steps', { count: stats.total })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          <span>{t('planning.stats.assigned', { count: stats.assigned })}</span>
        </div>
      </div>

      {/* Actions principales */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Bouton exemple Mathilde */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMathildeModal(true)}
          className="shrink-0 text-muted-foreground hover:text-primary"
        >
          <Heart className="h-4 w-4 mr-2" />
          {t('planning.mathildeExample')}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowOnboarding}
          className="sm:ml-auto shrink-0 text-muted-foreground hover:text-primary"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          {t('planning.userGuide')}
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-wedding-olive hover:bg-wedding-olive/90 flex-1">
              <Plus className="h-4 w-4 mr-2" />
              {t('planning.addStep')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('planning.addStepTitle')}</DialogTitle>
            </DialogHeader>
            <UnifiedTaskModal
              coordinationId={coordinationId}
              referenceTime={referenceTime}
              onEventAdded={handleManualEventAdded}
              onPlanningGenerated={handlePlanningGenerated}
              onClose={() => setIsTaskModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {events.length > 0 && (
          <Button
            variant={selectionMode ? "default" : "outline"}
            onClick={() => {
              setSelectionMode(!selectionMode);
              setSelectedEvents([]);
            }}
            className={selectionMode ? "bg-red-600 hover:bg-red-700" : "text-red-600 border-red-300 hover:bg-red-50"}
          >
            {selectionMode ? <X className="h-4 w-4 mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
            {selectionMode ? t('planning.cancelSelection') : t('planning.deleteSteps')}
          </Button>
        )}

        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Save className="h-4 w-4 animate-pulse" />
            {t('planning.saving')}
          </div>
        )}
      </div>

      {/* Actions de sélection multiple */}
      {selectionMode && events.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="text-blue-700 hover:bg-blue-100"
          >
            {selectedEvents.length === events.length ? t('planning.deselectAll') : t('planning.selectAll')}
          </Button>
          
          {selectedEvents.length > 0 && (
            <>
              <Badge variant="secondary">
                {selectedEvents.length > 1
                  ? t('planning.selectedCount_other', { count: selectedEvents.length })
                  : t('planning.selectedCount_one', { count: selectedEvents.length })}
              </Badge>
              
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('planning.deleteSelection')}
              </Button>
            </>
          )}
        </div>
      )}

      {/* Sélecteur de jours */}
      {(() => {
        const baseDays = ['J-1', 'Jour J', 'J+1'];
        const dynamic = Array.from(new Set([...baseDays, ...customDays, ...events.map(e => e.eventDay || 'Jour J')]));
        const filtered = events.filter(e => (e.eventDay || 'Jour J') === activeDay);
        return (
          <>
            <div className="flex items-center gap-2 flex-wrap border-b pb-2">
              {dynamic.map(d => {
                const count = events.filter(e => (e.eventDay || 'Jour J') === d).length;
                return (
                  <Button
                    key={d}
                    variant={activeDay === d ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveDay(d)}
                    className={activeDay === d ? 'bg-wedding-olive hover:bg-wedding-olive/90' : ''}
                  >
                    {d} {count > 0 && <Badge variant="secondary" className="ml-2">{count}</Badge>}
                  </Button>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const label = window.prompt(t('planning.addDayPrompt'));
                  if (label && label.trim()) {
                    setCustomDays(prev => [...prev, label.trim()]);
                    setActiveDay(label.trim());
                  }
                }}
              >
                <Plus className="h-3 w-3 mr-1" /> {t('planning.addDay')}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('planning.planningDay', { day: activeDay })}</span>
                  {filtered.length > 0 && (
                    <Badge variant="secondary">
                      {filtered.length > 1
                        ? t('planning.stepCount_other', { count: filtered.length })
                        : t('planning.stepCount_one', { count: filtered.length })}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t('planning.emptyDay', { day: activeDay })}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {t('planning.emptyDayHint')}
                    </p>
                  </div>
                ) : (
                  <EnhancedDragDropTimeline
                    events={filtered}
                    teamMembers={teamMembers}
                    onEventsUpdate={(updated) => {
                      // Réinjecter les événements des autres jours pour ne pas les perdre
                      const others = events.filter(e => (e.eventDay || 'Jour J') !== activeDay);
                      const mergedUpdated = updated.map(e => ({ ...e, eventDay: e.eventDay || activeDay }));
                      handleEventsUpdate([...others, ...mergedUpdated]);
                    }}
                    selectionMode={selectionMode}
                    selectedEvents={selectedEvents}
                    onSelectionChange={handleSelectionChange}
                  />
                )}
              </CardContent>
            </Card>
          </>
        );
      })()}


      {/* Modal d'onboarding */}
      <MonJourMOnboardingModal
        isOpen={showOnboarding}
        onOpenChange={setShowOnboarding}
        hasExistingEvents={events.length > 0}
      />

      {/* Modal exemple Mathilde */}
      <MathildeExampleModal
        isOpen={showMathildeModal}
        onClose={() => setShowMathildeModal(false)}
      />
    </div>
  );
};

export default MonJourMPlanningContent;
