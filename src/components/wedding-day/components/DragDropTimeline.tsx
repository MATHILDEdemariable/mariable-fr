import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { format, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Camera, 
  Music, 
  Utensils, 
  Heart, 
  Car,
  Award,
  GripVertical
} from 'lucide-react';
import { PlanningEvent, SerializablePlanningEvent } from '../types/planningTypes';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePlanning } from '../context/PlanningContext';

interface DragDropTimelineProps {
  events: PlanningEvent[] | SerializablePlanningEvent[];
  onEventsUpdate?: (events: PlanningEvent[]) => void;
}

const DragDropTimeline: React.FC<DragDropTimelineProps> = ({ events, onEventsUpdate }) => {
  const [timelineEvents, setTimelineEvents] = useState<PlanningEvent[]>([]);
  const { user } = usePlanning();
  const { toast } = useToast();

  useEffect(() => {
    // Convert SerializablePlanningEvent to PlanningEvent if needed
    const convertedEvents = events.map(event => ({
      ...event,
      startTime: event.startTime instanceof Date ? event.startTime : new Date(event.startTime),
      endTime: event.endTime instanceof Date ? event.endTime : new Date(event.endTime)
    })) as PlanningEvent[];
    
    setTimelineEvents(convertedEvents);
  }, [events]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ceremony':
        return <Heart className="h-5 w-5 text-wedding-olive" />;
      case 'travel':
        return <Car className="h-5 w-5 text-slate-600" />;
      case 'cocktail':
        return <Utensils className="h-5 w-5 text-amber-600" />;
      case 'dinner':
        return <Utensils className="h-5 w-5 text-slate-600" />;
      case 'party':
        return <Music className="h-5 w-5 text-purple-600" />;
      case 'couple_photos':
        return <Camera className="h-5 w-5 text-blue-500" />;
      case 'preparation':
        return <Clock className="h-5 w-5 text-pink-500" />;
      default:
        return <Calendar className="h-5 w-5 text-slate-600" />;
    }
  };

  const recalculateTimeline = (reorderedEvents: PlanningEvent[]): PlanningEvent[] => {
    let currentTime = reorderedEvents[0]?.startTime || new Date();
    
    return reorderedEvents.map((event, index) => {
      const updatedEvent = { ...event };
      
      if (index === 0) {
        // Keep the first event's start time as anchor
        updatedEvent.startTime = currentTime;
      } else {
        // Set start time to current time
        updatedEvent.startTime = new Date(currentTime);
      }
      
      // Calculate end time based on duration
      updatedEvent.endTime = addMinutes(updatedEvent.startTime, event.duration);
      
      // Update current time for next event (add some buffer time if needed)
      currentTime = updatedEvent.endTime;
      
      return updatedEvent;
    });
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Reorder events
    const reorderedEvents = Array.from(timelineEvents);
    const [movedEvent] = reorderedEvents.splice(sourceIndex, 1);
    reorderedEvents.splice(destinationIndex, 0, movedEvent);

    // Recalculate timeline
    const updatedEvents = recalculateTimeline(reorderedEvents);
    
    setTimelineEvents(updatedEvents);
    
    // Call parent update function
    if (onEventsUpdate) {
      onEventsUpdate(updatedEvents);
    }

    // Save to database if user is logged in
    if (user) {
      try {
        // Save updated planning to database
        const { error } = await supabase
          .from('planning_reponses_utilisateur')
          .upsert({
            user_id: user.id,
            email: user.email,
            planning_genere: updatedEvents,
            reponses: {} // Keep existing responses
          });

        if (error) throw error;

        toast({
          title: "Planning mis à jour",
          description: "Les modifications ont été sauvegardées automatiquement."
        });
      } catch (error) {
        console.error('Error updating planning:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder les modifications.",
          variant: "destructive"
        });
      }
    }
  };

  return (
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
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`overflow-hidden transition-all cursor-move ${
                      event.isHighlight ? 'border-wedding-olive/30 bg-wedding-olive/5' : ''
                    } ${snapshot.isDragging ? 'shadow-lg rotate-1' : 'hover:shadow-md'}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div {...provided.dragHandleProps} className="mb-2 text-gray-400 hover:text-gray-600">
                            <GripVertical className="h-5 w-5" />
                          </div>
                          <div className={`rounded-full p-2 ${
                            event.isHighlight ? 'bg-wedding-olive/20' : 'bg-slate-100'
                          }`}>
                            {getEventIcon(event.type)}
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold text-lg ${
                                event.isHighlight ? 'text-wedding-olive' : ''
                              }`}>
                                {format(event.startTime, 'HH:mm', { locale: fr })}
                              </span>
                              {event.duration > 0 && (
                                <span className="text-slate-500 text-sm">
                                  → {format(event.endTime, 'HH:mm', { locale: fr })}
                                </span>
                              )}
                            </div>
                            
                            {event.isHighlight && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wedding-olive/20 text-wedding-olive">
                                Moment clé
                              </span>
                            )}
                          </div>
                          
                          <h3 className={`font-medium ${
                            event.isHighlight ? 'text-wedding-olive' : ''
                          }`}>
                            {event.title}
                          </h3>
                          
                          {event.duration > 0 && (
                            <p className="text-sm text-slate-500">
                              Durée: {event.duration} minutes
                            </p>
                          )}
                          
                          {event.notes && (
                            <p className="text-sm italic text-slate-600 mt-1">
                              {event.notes}
                            </p>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragDropTimeline;
