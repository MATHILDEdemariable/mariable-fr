import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Calendar, Clock, Users, Trash2, CheckSquare, Square, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import { useProjectCoordination } from '@/hooks/useProjectCoordination';
import ProjectTaskModal from './ProjectTaskModal';
import ProjectTimeline from './ProjectTimeline';

interface ProjectPlanningContentProps {
  coordinationId: string;
}

const ProjectPlanningContent: React.FC<ProjectPlanningContentProps> = ({ 
  coordinationId 
}) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [events, setEvents] = useState<PlanningEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const { coordination } = useProjectCoordination();

  console.log('🎯 ProjectPlanningContent: coordination:', coordinationId);

  // Fonction de sauvegarde avec debounce
  const saveEventsToDatabase = useCallback(async (eventsToSave: PlanningEvent[]) => {
    if (!coordinationId) return;
    
    setIsSaving(true);
    try {
      console.log('💾 Saving project events to database:', eventsToSave.length);
      
      for (const [index, event] of eventsToSave.entries()) {
        await supabase
          .from('coordination_planning')
          .update({
            title: event.title,
            description: event.notes,
            start_time: event.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            duration: event.duration,
            assigned_to: event.assignedTo || [],
            position: index
          })
          .eq('id', event.id);
      }
      
      console.log('✅ All project events saved successfully');
    } catch (error) {
      console.error('❌ Error saving project events:', error);
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

  // Charger les événements existants avec ordre par position
  useEffect(() => {
    const loadExistingPlanning = async () => {
      if (!coordination?.user_id) return;

      try {
        setIsLoading(true);
        console.log('📋 Loading existing project planning for user:', coordination.user_id);

        const { data, error } = await supabase
          .from('coordination_planning')
          .select('*')
          .eq('coordination_id', coordinationId)
          .order('position', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const convertedEvents: PlanningEvent[] = data.map((item: any) => {
            // Pour les tâches de projet, utiliser une date de référence fixe
            const baseDate = new Date();
            baseDate.setHours(9, 0, 0, 0);
            
            let startTime: Date;
            
            if (item.start_time) {
              const [hours, minutes] = item.start_time.split(':').map(Number);
              startTime = new Date(baseDate);
              startTime.setHours(hours, minutes, 0, 0);
            } else {
              startTime = new Date(baseDate);
            }
            
            return {
              id: item.id,
              title: item.title,
              notes: item.description,
              startTime,
              endTime: new Date(startTime.getTime() + (item.duration || 30) * 60000),
              duration: item.duration || 30,
              category: item.category || 'préparation',
              type: item.category || 'préparation',
              isHighlight: item.priority === 'high',
              assignedTo: Array.isArray(item.assigned_to) ? item.assigned_to : []
            };
          });
          
          console.log('✅ Loaded', convertedEvents.length, 'existing project events');
          setEvents(convertedEvents);
        } else {
          console.log('📋 No existing project planning found');
          setEvents([]);
        }
      } catch (error) {
        console.error('❌ Error loading existing project planning:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger le planning de projet existant.",
          variant: "destructive"
        });
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingPlanning();
  }, [coordination?.user_id, coordinationId, toast]);

  // Gestionnaire pour l'ajout d'événement manuel
  const handleManualEventAdded = (newEvent: PlanningEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  // Gestionnaire pour la mise à jour des événements avec sauvegarde auto
  const handleEventsUpdate = async (updatedEvents: PlanningEvent[]) => {
    console.log('🔄 Updating project events from timeline:', updatedEvents.length);
    setEvents(updatedEvents);
    
    // Sauvegarde automatique avec debounce
    debouncedSave(updatedEvents);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                <p className="text-sm text-gray-600">Total tâches</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Priorités élevées</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.assigned}</p>
              </div>
              <Users className="h-8 w-8 text-green-600/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une tâche
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle tâche</DialogTitle>
            </DialogHeader>
            <ProjectTaskModal
              coordinationId={coordinationId}
              onEventAdded={handleManualEventAdded}
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
            <span>Planning de préparation</span>
            {events.length > 0 && (
              <Badge variant="secondary">
                {events.length} tâche{events.length > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune tâche planifiée
              </h3>
              <p className="text-gray-500 mb-6">
                Commencez par ajouter des tâches de préparation pour votre mariage
              </p>
              <Button onClick={() => setIsTaskModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter votre première tâche
              </Button>
            </div>
          ) : (
            <ProjectTimeline
              events={events}
              onEventsChange={handleEventsUpdate}
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

export default ProjectPlanningContent;