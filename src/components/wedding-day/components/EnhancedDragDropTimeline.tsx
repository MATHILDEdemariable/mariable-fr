import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { addMinutes } from 'date-fns';
import { PlanningEvent, saveGeneratedPlanning } from '../types/planningTypes';
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
  const { user, formData } = usePlanning();
  const { toast } = useToast();

  useEffect(() => {
    setTimelineEvents(events);
  }, [events]);

  const recalculateTimeline = (reorderedEvents: PlanningEvent[]): PlanningEvent[] => {
    if (reorderedEvents.length === 0) return [];
    
    // Find the earliest start time to use as base, or use first event's start time
    let currentTime = reorderedEvents[0]?.startTime || new Date();
    
    // For ceremonies, try to preserve their original timing as anchor points
    const ceremonyEvents = reorderedEvents.filter(e => e.category === 'cérémonie' || e.type === 'ceremony');
    if (ceremonyEvents.length > 0) {
      // Use the first ceremony as time anchor
      const firstCeremony = ceremonyEvents[0];
      const ceremonyIndex = reorderedEvents.findIndex(e => e.id === firstCeremony.id);
      
      // Calculate preparation time (start 3 hours before ceremony)
      const preparationStartTime = addMinutes(firstCeremony.startTime, -180);
      currentTime = preparationStartTime;
    }
    
    // Get appropriate buffer time between events based on category
    const getBufferTime = (event: PlanningEvent, nextEvent?: PlanningEvent): number => {
      // No buffer for travel/logistics
      if (event.category === 'logistique' || event.type === 'travel') return 0;
      
      // Special buffers for different transitions
      if (event.category === 'préparatifs_final') return 5;
      if (event.category === 'cérémonie') return 15;
      if (event.category === 'photos') return 10;
      if (event.category === 'cocktail') return 5;
      if (event.category === 'repas') return 10;
      
      return 5; // Default buffer
    };
    
    return reorderedEvents.map((event, index) => {
      const updatedEvent = { ...event };
      
      // For ceremony events, try to preserve their specified times
      if (event.category === 'cérémonie' && event.startTime) {
        // Keep ceremony at its original time if it makes sense in sequence
        const potentialCeremonyTime = event.startTime;
        if (index === 0 || potentialCeremonyTime >= currentTime) {
          updatedEvent.startTime = potentialCeremonyTime;
          updatedEvent.endTime = addMinutes(potentialCeremonyTime, event.duration);
          currentTime = updatedEvent.endTime;
          return updatedEvent;
        }
      }
      
      // For all other events, calculate sequential timing
      updatedEvent.startTime = new Date(currentTime);
      updatedEvent.endTime = addMinutes(updatedEvent.startTime, event.duration);
      
      // Calculate next start time with appropriate buffer
      const nextEvent = reorderedEvents[index + 1];
      const bufferTime = getBufferTime(event, nextEvent);
      currentTime = addMinutes(updatedEvent.endTime, bufferTime);
      
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
    
    // Recalculate timeline after individual event update
    const recalculatedEvents = recalculateTimeline(updatedEvents);
    setTimelineEvents(recalculatedEvents);
    
    if (onEventsUpdate) {
      onEventsUpdate(recalculatedEvents);
    }

    saveToDatabase(recalculatedEvents);
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
      // Save to new generated_planning table
      await saveGeneratedPlanning(
        supabase,
        user.id,
        formData || {},
        events
      );
    } catch (error) {
      console.error('Error saving planning:', error);
      // Silent error handling - don't show error toast for save failures
      // The timeline changes are still visible to the user
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Reorder the events array
    const reorderedEvents = Array.from(timelineEvents);
    const [movedEvent] = reorderedEvents.splice(sourceIndex, 1);
    reorderedEvents.splice(destinationIndex, 0, movedEvent);

    // Recalculate all times in the new order
    const recalculatedEvents = recalculateTimeline(reorderedEvents);
    
    setTimelineEvents(recalculatedEvents);
    
    if (onEventsUpdate) {
      onEventsUpdate(recalculatedEvents);
    }

    saveToDatabase(recalculatedEvents);

    toast({
      title: "Planning réorganisé",
      description: "Les horaires ont été recalculés automatiquement pour maintenir une séquence logique.",
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
