
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { addMinutes } from 'date-fns';
import { PlanningEvent } from '../types/planningTypes';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePlanning } from '../context/PlanningContext';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';
import EditableEventCard from './EditableEventCard';
import CustomBlockDialog from './CustomBlockDialog';
import { v4 as uuidv4 } from 'uuid';

interface EnhancedDragDropTimelineProps {
  events: PlanningEvent[];
  onEventsUpdate?: (events: PlanningEvent[]) => void;
}

const EnhancedDragDropTimeline: React.FC<EnhancedDragDropTimelineProps> = ({ 
  events, 
  onEventsUpdate 
}) => {
  const [timelineEvents, setTimelineEvents] = useState<PlanningEvent[]>([]);
  const { user, formData } = usePlanning();
  const { coordination } = useMonJourMCoordination();
  const { toast } = useToast();

  useEffect(() => {
    console.log('📋 Timeline events updated:', events.length);
    setTimelineEvents(events);
  }, [events]);

  // Fonction de recalcul du planning améliorée
  const recalculateTimeline = (events: PlanningEvent[]): PlanningEvent[] => {
    if (events.length === 0) return [];
    
    console.log('🔄 Recalculating timeline for', events.length, 'events');
    
    // Chercher un point de départ logique
    let currentTime = events[0]?.startTime || new Date();
    
    // Pour les cérémonies, essayer de préserver leur timing original
    const ceremonyEvents = events.filter(e => e.category === 'cérémonie' || e.type === 'ceremony');
    if (ceremonyEvents.length > 0) {
      const firstCeremony = ceremonyEvents[0];
      const ceremonyIndex = events.findIndex(e => e.id === firstCeremony.id);
      
      // Calculer le temps de préparation (commencer 3h avant la cérémonie)
      const preparationStartTime = addMinutes(firstCeremony.startTime, -180);
      currentTime = preparationStartTime;
    }
    
    // Fonction pour calculer le buffer entre événements
    const getBufferTime = (event: PlanningEvent, nextEvent?: PlanningEvent): number => {
      if (event.category === 'logistique' || event.type === 'travel') return 0;
      if (event.category === 'préparatifs_final') return 5;
      if (event.category === 'cérémonie') return 15;
      if (event.category === 'photos') return 10;
      if (event.category === 'cocktail') return 5;
      if (event.category === 'repas') return 10;
      return 5;
    };
    
    const recalculatedEvents = events.map((event, index) => {
      const updatedEvent = { ...event };
      
      // Pour les événements de cérémonie, essayer de préserver leur heure spécifiée
      if (event.category === 'cérémonie' && event.startTime) {
        const potentialCeremonyTime = event.startTime;
        if (index === 0 || potentialCeremonyTime >= currentTime) {
          updatedEvent.startTime = potentialCeremonyTime;
          updatedEvent.endTime = addMinutes(potentialCeremonyTime, event.duration);
          currentTime = updatedEvent.endTime;
          return updatedEvent;
        }
      }
      
      // Pour tous les autres événements, calculer séquentiellement
      updatedEvent.startTime = new Date(currentTime);
      updatedEvent.endTime = addMinutes(updatedEvent.startTime, event.duration);
      
      // Calculer le prochain temps de début avec buffer approprié
      const nextEvent = events[index + 1];
      const bufferTime = getBufferTime(event, nextEvent);
      currentTime = addMinutes(updatedEvent.endTime, bufferTime);
      
      return updatedEvent;
    });

    console.log('✅ Timeline recalculated successfully');
    return recalculatedEvents;
  };

  // Nouvelle fonction pour intégrer les événements générés par l'IA
  const handlePlanningGenerated = async (newEvents: PlanningEvent[]) => {
    console.log('🤖 Integrating AI-generated events:', newEvents.length);
    
    try {
      // Ajouter les nouveaux événements à la liste existante
      const updatedEvents = [...timelineEvents, ...newEvents];
      
      // Recalculer le planning complet
      const recalculatedEvents = recalculateTimeline(updatedEvents);
      
      setTimelineEvents(recalculatedEvents);
      
      if (onEventsUpdate) {
        onEventsUpdate(recalculatedEvents);
      }

      await saveToDatabase(recalculatedEvents);
      
      toast({
        title: "Planning mis à jour",
        description: `${newEvents.length} nouvelle${newEvents.length > 1 ? 's' : ''} étape${newEvents.length > 1 ? 's ont été ajoutées' : ' a été ajoutée'}.`
      });
    } catch (error) {
      console.error('❌ Error integrating AI events:', error);
      toast({
        title: "Erreur d'intégration",
        description: "Impossible d'ajouter les événements générés par l'IA.",
        variant: "destructive"
      });
    }
  };

  // Gestionnaire d'ajout de bloc personnalisé amélioré
  const handleAddCustomBlock = async (block: { duration: number; title: string; description?: string }) => {
    console.log('➕ Adding custom block:', block.title);
    
    const newEvent: PlanningEvent = {
      id: uuidv4(),
      title: block.title,
      category: 'personnalisé',
      startTime: new Date(),
      endTime: addMinutes(new Date(), block.duration),
      duration: block.duration,
      type: 'custom',
      notes: block.description,
      isHighlight: false
    };

    const updatedEvents = [...timelineEvents, newEvent];
    const recalculatedEvents = recalculateTimeline(updatedEvents);
    
    setTimelineEvents(recalculatedEvents);
    
    if (onEventsUpdate) {
      onEventsUpdate(recalculatedEvents);
    }

    await saveToDatabase(recalculatedEvents);
    
    toast({
      title: "Étape ajoutée",
      description: `"${block.title}" a été ajoutée à votre planning.`
    });
  };

  // Gestionnaire de mise à jour d'événement corrigé avec validation améliorée
  const handleUpdateEvent = async (updatedEvent: PlanningEvent) => {
    console.log('✏️ Updating event:', updatedEvent.title);
    
    try {
      // Validation des données
      if (!updatedEvent.title.trim()) {
        toast({
          title: "Erreur de validation",
          description: "Le titre de l'étape ne peut pas être vide.",
          variant: "destructive"
        });
        return;
      }

      if (updatedEvent.duration < 5) {
        toast({
          title: "Erreur de validation", 
          description: "La durée minimum est de 5 minutes.",
          variant: "destructive"
        });
        return;
      }

      const updatedEvents = timelineEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      );
      
      // Recalculer le planning après la mise à jour individuelle
      const recalculatedEvents = recalculateTimeline(updatedEvents);
      setTimelineEvents(recalculatedEvents);
      
      if (onEventsUpdate) {
        onEventsUpdate(recalculatedEvents);
      }

      await saveToDatabase(recalculatedEvents);
      
      toast({
        title: "Étape modifiée",
        description: "Les modifications ont été sauvegardées avec succès."
      });
    } catch (error) {
      console.error('❌ Error updating event:', error);
      toast({
        title: "Erreur de mise à jour",
        description: "Impossible de sauvegarder les modifications. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Gestionnaire de suppression d'événement
  const handleDeleteEvent = async (eventId: string) => {
    console.log('🗑️ Deleting event:', eventId);
    
    try {
      // Supprimer directement de la base de données
      const { error } = await supabase
        .from('coordination_planning')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      const updatedEvents = timelineEvents.filter(event => event.id !== eventId);
      const recalculatedEvents = recalculateTimeline(updatedEvents);
      
      setTimelineEvents(recalculatedEvents);
      
      if (onEventsUpdate) {
        onEventsUpdate(recalculatedEvents);
      }

      // Sauvegarder les positions mises à jour
      await saveToDatabase(recalculatedEvents);
      
      toast({
        title: "Étape supprimée",
        description: "L'étape a été supprimée de votre planning."
      });
    } catch (error) {
      console.error('❌ Error deleting event:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer l'étape. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Fonction de sauvegarde en base corrigée - supprime et recrée tout
  const saveToDatabase = async (events: PlanningEvent[], retryCount = 0) => {
    if (!coordination?.id) {
      console.warn('⚠️ No coordination found, skipping save');
      return;
    }

    try {
      console.log('💾 Synchronizing', events.length, 'events to coordination_planning');
      
      // 1. Supprimer tous les événements jour-m existants
      await supabase
        .from('coordination_planning')
        .delete()
        .eq('coordination_id', coordination.id)
        .eq('category', 'jour-m');
      
      // 2. Recréer tous les événements dans l'ordre
      if (events.length > 0) {
        const eventsToInsert = events.map((event, index) => ({
          id: event.id,
          coordination_id: coordination.id,
          title: event.title,
          description: event.notes || null,
          start_time: event.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          duration: event.duration,
          assigned_to: event.assignedTo || [],
          position: index,
          category: 'jour-m',
          priority: 'medium',
          is_ai_generated: event.type !== 'custom'
        }));
        
        const { error: insertError } = await supabase
          .from('coordination_planning')
          .insert(eventsToInsert);
          
        if (insertError) throw insertError;
      }
      
      console.log('✅ Events synchronized successfully to coordination_planning');
    } catch (error) {
      console.error('❌ Error synchronizing planning:', error);
      
      // Retry une fois en cas d'échec
      if (retryCount < 1) {
        console.log('🔄 Retrying synchronization...');
        setTimeout(() => saveToDatabase(events, retryCount + 1), 1000);
      } else {
        // Afficher une erreur seulement après retry
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de synchroniser avec la base. Vos modifications sont conservées localement.",
          variant: "destructive"
        });
      }
    }
  };

  // Gestionnaire de drag & drop corrigé avec validation améliorée
  const handleDragEnd = async (result: DropResult) => {
    console.log('🔄 Drag operation:', result);
    
    if (!result.destination) {
      console.log('❌ No destination, cancelling drag');
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) {
      console.log('❌ Same position, cancelling drag');
      return;
    }

    try {
      // Réorganiser le tableau d'événements
      const reorderedEvents = Array.from(timelineEvents);
      const [movedEvent] = reorderedEvents.splice(sourceIndex, 1);
      reorderedEvents.splice(destinationIndex, 0, movedEvent);

      console.log('📋 Events reordered, recalculating timeline');
      
      // Recalculer tous les horaires dans le nouvel ordre
      const recalculatedEvents = recalculateTimeline(reorderedEvents);
      
      setTimelineEvents(recalculatedEvents);
      
      if (onEventsUpdate) {
        onEventsUpdate(recalculatedEvents);
      }

      // Sauvegarde asynchrone pour ne pas bloquer l'UI
      saveToDatabase(recalculatedEvents);

      toast({
        title: "Planning réorganisé",
        description: "Les horaires ont été recalculés automatiquement.",
      });
    } catch (error) {
      console.error('❌ Error during drag & drop:', error);
      toast({
        title: "Erreur de réorganisation",
        description: "Impossible de réorganiser le planning. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Planning de votre journée</h3>
        <CustomBlockDialog onAddBlock={handleAddCustomBlock} />
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="timeline">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-4 transition-colors ${
                snapshot.isDraggingOver ? 'bg-gray-50 rounded-lg p-2' : ''
              }`}
            >
              {timelineEvents.map((event, index) => (
                <Draggable key={event.id} draggableId={event.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <EditableEventCard
                        event={event}
                        onUpdate={handleUpdateEvent}
                        onDelete={handleDeleteEvent}
                        dragHandleProps={provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        isCustom={event.type === 'custom'}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default EnhancedDragDropTimeline;
