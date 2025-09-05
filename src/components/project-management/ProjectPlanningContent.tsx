import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Calendar, Clock, Users, Trash2, CheckSquare, Square, Save, Sparkles, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import { useProjectCoordination } from '@/hooks/useProjectCoordination';
import ProjectTaskModal from './ProjectTaskModal';
import ProjectTaskList from './ProjectTaskList';
import ProjectAISuggestionsModal from './ProjectAISuggestionsModal';

interface ProjectPlanningContentProps {
  coordinationId: string;
}

const ProjectPlanningContent: React.FC<ProjectPlanningContentProps> = ({ 
  coordinationId 
}) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
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

  // Charger les événements existants avec validation stricte
  useEffect(() => {
    const loadExistingPlanning = async () => {
      // Vérifications strictes pour éviter les erreurs
      if (!coordination?.user_id || !coordinationId || coordinationId.trim() === '') {
        console.log('📋 ProjectPlanning: Waiting for valid coordination data...');
        return;
      }

      try {
        setIsLoading(true);
        console.log('📋 Loading existing project planning for coordination:', coordinationId);

        const { data, error } = await supabase
          .from('coordination_planning')
          .select('*')
          .eq('coordination_id', coordinationId)
          .eq('category', 'project')
          .order('position', { ascending: true });

        if (error) {
          console.error('❌ Error loading project planning:', error);
          throw error;
        }

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
        // Logging silencieux pour les erreurs temporaires qui se résolvent automatiquement
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Délai pour éviter les appels trop rapides lors de l'initialisation
    const timeoutId = setTimeout(loadExistingPlanning, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [coordination?.user_id, coordinationId]);

  // Gestionnaire pour l'ajout d'événement manuel
  const handleManualEventAdded = (newEvent: PlanningEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  // Gestionnaire pour les suggestions IA
  const handleAITasksAdded = async (aiTasks: PlanningEvent[]) => {
    try {
      // Enregistrer les tâches en base
      const tasksToSave = aiTasks.map((task, index) => ({
        coordination_id: coordinationId,
        title: task.title,
        description: task.notes,
        start_time: '09:00',
        duration: 30,
        category: 'project',
        priority: 'medium',
        position: events.length + index,
        assigned_to: []
      }));

      const { data, error } = await supabase
        .from('coordination_planning')
        .insert(tasksToSave)
        .select();

      if (error) throw error;

      // Convertir les données de retour en PlanningEvent
      const convertedEvents: PlanningEvent[] = data.map((item: any) => {
        const baseDate = new Date();
        baseDate.setHours(9, 0, 0, 0);
        
        return {
          id: item.id,
          title: item.title,
          notes: item.description,
          startTime: baseDate,
          endTime: new Date(baseDate.getTime() + 30 * 60000),
          duration: 30,
          category: item.category,
          type: item.category,
          
          assignedTo: []
        };
      });

      setEvents(prev => [...prev, ...convertedEvents]);
      setShowAISuggestions(false);
    } catch (error) {
      console.error('❌ Error adding AI tasks:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les tâches suggérées",
        variant: "destructive"
      });
    }
  };

  // Gestionnaire pour l'édition d'une tâche
  const handleEditTask = async (updatedEvent: PlanningEvent) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  // Gestionnaire pour la suppression d'une tâche
  const handleDeleteTask = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('coordination_planning')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== eventId));
      
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été supprimée avec succès"
      });
    } catch (error) {
      console.error('❌ Error deleting task:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer la tâche",
        variant: "destructive"
      });
    }
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
    const assigned = events.filter(e => e.assignedTo && e.assignedTo.length > 0).length;
    
    return { total, assigned };
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
                <p className="text-sm text-muted-foreground">Total tâches</p>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
        
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tâches assignées</p>
                <p className="text-2xl font-bold text-success">{stats.assigned}</p>
              </div>
              <Users className="h-8 w-8 text-success/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une tâche
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuItem
              onClick={() => setIsTaskModalOpen(true)}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajout manuel
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowAISuggestions(true)}
              className="cursor-pointer"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Suggestions IA mariage
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Modal ajout manuel */}
        <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
          <DialogContent className="max-w-2xl">
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

        {/* Modal suggestions IA */}
        <Dialog open={showAISuggestions} onOpenChange={setShowAISuggestions}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <ProjectAISuggestionsModal
              coordinationId={coordinationId}
              onTasksAdded={handleAITasksAdded}
              onClose={() => setShowAISuggestions(false)}
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
            className={selectionMode ? "bg-primary hover:bg-primary/90" : ""}
          >
            {selectionMode ? <CheckSquare className="h-4 w-4 mr-2" /> : <Square className="h-4 w-4 mr-2" />}
            {selectionMode ? "Annuler sélection" : "Sélectionner plusieurs"}
          </Button>
        )}

        {/* Indicateur de sauvegarde */}
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Save className="h-4 w-4 animate-pulse" />
            Sauvegarde...
          </div>
        )}
      </div>

      {/* Actions de sélection multiple */}
      {selectionMode && events.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="text-primary hover:bg-primary/10"
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

      {/* TO DO List principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>TO DO List</span>
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
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Aucune tâche planifiée
              </h3>
              <p className="text-muted-foreground mb-6">
                Commencez par ajouter des tâches de préparation pour votre mariage
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter votre première tâche
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsTaskModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajout manuel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowAISuggestions(true)}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Suggestions IA mariage
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <ProjectTaskList
              events={events}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
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