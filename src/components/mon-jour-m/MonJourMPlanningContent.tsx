
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles, Calendar, Clock, Users, Trash2, CheckSquare, Square, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PersonalizedScenarioTab from './PersonalizedScenarioTab';
import UnifiedTaskModal from './UnifiedTaskModal';
import EnhancedDragDropTimeline from './MonJourMTimeline';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

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
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [events, setEvents] = useState<PlanningEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [referenceTime, setReferenceTime] = useState(new Date());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const { coordination } = useMonJourMCoordination();

  console.log('🎯 MonJourMPlanningContent: coordination:', coordinationId);

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
            category: 'jour-m' // S'assurer que la catégorie reste 'jour-m'
          })
          .eq('id', event.id)
          .eq('category', 'jour-m'); // Sécurité supplémentaire
      }
      
      console.log('✅ All events saved successfully');
    } catch (error) {
      console.error('❌ Error saving events:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les modifications.",
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

  // Charger les événements existants avec ordre par position
  useEffect(() => {
    const loadExistingPlanning = async () => {
      if (!coordination?.user_id) return;

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
              isHighlight: item.priority === 'high',
              assignedTo: Array.isArray(item.assigned_to) ? item.assigned_to : []
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
          title: "Erreur de chargement",
          description: "Impossible de charger le planning existant.",
          variant: "destructive"
        });
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingPlanning();
  }, [coordination?.user_id, coordinationId, referenceTime, toast]);

  // Gestionnaire pour l'intégration des événements générés par l'IA
  const handlePlanningGenerated = async (newEvents: PlanningEvent[]) => {
    console.log('🤖 Handling AI-generated planning:', newEvents.length, 'events');
    
    try {
      const eventsToSave = newEvents.map((event, index) => ({
        coordination_id: coordinationId,
        title: event.title,
        description: event.notes,
        start_time: event.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        duration: event.duration,
        category: 'jour-m',
        priority: event.isHighlight ? 'high' : 'medium',
        position: events.length + index,
        assigned_to: []
      }));

      const { data, error } = await supabase
        .from('coordination_planning')
        .insert(eventsToSave)
        .select();

      if (error) throw error;

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
          isHighlight: item.priority === 'high',
          assignedTo: []
        };
      });

      setEvents(prev => [...prev, ...convertedNewEvents]);
      
      toast({
        title: "Planning mis à jour",
        description: `${newEvents.length} nouvelle${newEvents.length > 1 ? 's' : ''} étape${newEvents.length > 1 ? 's ont été ajoutées' : ' a été ajoutée'}.`
      });
      
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error('❌ Error handling AI planning:', error);
      toast({
        title: "Erreur d'intégration",
        description: "Impossible d'ajouter les événements générés.",
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
    setEvents(prev => [...prev, newEvent]);
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
      `Êtes-vous sûr de vouloir supprimer ${selectedEvents.length} tâche${selectedEvents.length > 1 ? 's' : ''} ?`
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
        title: "Tâches supprimées",
        description: `${selectedEvents.length} tâche${selectedEvents.length > 1 ? 's ont été supprimées' : ' a été supprimée'}.`
      });
    } catch (error) {
      console.error('❌ Error deleting selected events:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer les tâches sélectionnées.",
        variant: "destructive"
      });
    }
  };

  const getEventStats = () => {
    const total = events.length;
    const highlights = events.filter(e => e.isHighlight).length;
    const assigned = events.filter(e => e.assignedTo && e.assignedTo.length > 0).length;
    
    return { total, highlights, assigned };
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
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total étapes</p>
                <p className="text-2xl font-bold text-wedding-olive">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-wedding-olive/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Moments clés</p>
                <p className="text-2xl font-bold text-amber-600">{stats.highlights}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tâches assignées</p>
                <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-wedding-olive hover:bg-wedding-olive/90 flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une étape
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle étape</DialogTitle>
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
            className={selectionMode ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {selectionMode ? <CheckSquare className="h-4 w-4 mr-2" /> : <Square className="h-4 w-4 mr-2" />}
            {selectionMode ? "Annuler sélection" : "Sélectionner plusieurs"}
          </Button>
        )}

        {/* Indicateur de sauvegarde */}
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Save className="h-4 w-4 animate-pulse" />
            Sauvegarde...
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
            {selectedEvents.length === events.length ? "Tout désélectionner" : "Tout sélectionner"}
          </Button>
          
          {selectedEvents.length > 0 && (
            <>
              <Badge variant="secondary">
                {selectedEvents.length} sélectionnée{selectedEvents.length > 1 ? 's' : ''}
              </Badge>
              
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer la sélection
              </Button>
            </>
          )}
        </div>
      )}

      {/* Planning principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Planning du jour J</span>
            {events.length > 0 && (
              <Badge variant="secondary">
                {events.length} étape{events.length > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun planning pour le moment
              </h3>
              <p className="text-gray-500 mb-4">
                Commencez par créer votre planning avec l'assistant IA ou ajoutez des étapes manuellement.
              </p>
            </div>
          ) : (
            <EnhancedDragDropTimeline
              events={events}
              teamMembers={teamMembers}
              onEventsUpdate={handleEventsUpdate}
              selectionMode={selectionMode}
              selectedEvents={selectedEvents}
              onSelectionChange={handleSelectionChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonJourMPlanningContent;
