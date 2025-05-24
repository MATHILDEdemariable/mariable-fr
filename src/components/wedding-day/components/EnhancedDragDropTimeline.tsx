
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { addMinutes } from 'date-fns';
import { PlanningEvent } from '../types/planningTypes';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePlanning } from '../context/PlanningContext';
import EditableTimelineEvent from './EditableTimelineEvent';
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
  const { user } = usePlanning();
  const { toast } = useToast();

  useEffect(() => {
    setTimelineEvents(events);
  }, [events]);

  const recalculateTimeline = (reorderedEvents: PlanningEvent[]): PlanningEvent[] => {
    if (reorderedEvents.length === 0) return [];
    
    let currentTime = reorderedEvents[0]?.startTime || new Date();
    
    return reorderedEvents.map((event, index) => {
      const updatedEvent = { ...event };
      
      if (index === 0) {
        updatedEvent.startTime = currentTime;
      } else {
        updatedEvent.startTime = new Date(currentTime);
      }
      
      updatedEvent.endTime = addMinutes(updatedEvent.startTime, event.duration);
      currentTime = updatedEvent.endTime;
      
      return updatedEvent;
    });
  };

  const handleAddCustomBlock = (block: { duration: number; title: string; description?: string }) => {
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

    saveToDatabase(recalculatedEvents);
    
    toast({
      title: "Étape ajoutée",
      description: `"${block.title}" a été ajoutée à votre planning.`
    });
  };

  const handleUpdateEvent = (updatedEvent: PlanningEvent) => {
    const updatedEvents = timelineEvents.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    
    setTimelineEvents(updatedEvents);
    
    if (onEventsUpdate) {
      onEventsUpdate(updatedEvents);
    }

    saveToDatabase(updatedEvents);
  };

  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = timelineEvents.filter(event => event.id !== eventId);
    const recalculatedEvents = recalculateTimeline(updatedEvents);
    
    setTimelineEvents(recalculatedEvents);
    
    if (onEventsUpdate) {
      onEventsUpdate(recalculatedEvents);
    }

    saveToDatabase(recalculatedEvents);
    
    toast({
      title: "Étape supprimée",
      description: "L'étape a été supprimée de votre planning."
    });
  };

  const saveToDatabase = async (events: PlanningEvent[]) => {
    if (!user) return;

    try {
      const serializableEvents = events.map(event => ({
        ...event,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString()
      }));

      const { error } = await supabase
        .from('planning_reponses_utilisateur')
        .upsert({
          user_id: user.id,
          email: user.email || undefined,
          planning_genere: serializableEvents,
          reponses: {}
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving planning:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive"
      });
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const reorderedEvents = Array.from(timelineEvents);
    const [movedEvent] = reorderedEvents.splice(sourceIndex, 1);
    reorderedEvents.splice(destinationIndex, 0, movedEvent);

    const updatedEvents = recalculateTimeline(reorderedEvents);
    
    setTimelineEvents(updatedEvents);
    
    if (onEventsUpdate) {
      onEventsUpdate(updatedEvents);
    }

    saveToDatabase(updatedEvents);

    toast({
      title: "Planning mis à jour",
      description: "Les modifications ont été sauvegardées automatiquement."
    });
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
              className={`space-y-4 ${snapshot.isDraggingOver ? 'bg-gray-50 rounded-lg p-2' : ''}`}
            >
              {timelineEvents.map((event, index) => (
                <Draggable key={event.id} draggableId={event.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <EditableTimelineEvent
                        event={event}
                        onUpdate={handleUpdateEvent}
                        onDelete={event.type === 'custom' ? handleDeleteEvent : undefined}
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
