
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import MonJourMEventCard from './MonJourMEventCard';
import { addMinutes, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface MonJourMTimelineProps {
  events: PlanningEvent[];
  teamMembers: any[];
  onEventsUpdate: (events: PlanningEvent[]) => void;
  selectionMode?: boolean;
  selectedEvents?: string[];
  onSelectionChange?: (eventId: string, selected: boolean) => void;
}

const MonJourMTimeline: React.FC<MonJourMTimelineProps> = ({
  events,
  teamMembers,
  onEventsUpdate,
  selectionMode = false,
  selectedEvents = [],
  onSelectionChange
}) => {
  const BUFFER_TIME_MINUTES = 15; // Buffer entre les événements
  const [showManualRecalc, setShowManualRecalc] = useState(false);

  // Fonction pour recalculer chronologiquement TOUS les horaires
  const recalculateAllTimes = (eventsList: PlanningEvent[]): PlanningEvent[] => {
    if (eventsList.length === 0) return eventsList;

    console.log('🔄 Recalculating all times chronologically for', eventsList.length, 'events');
    
    // Trier par position pour maintenir l'ordre voulu
    const sortedEvents = [...eventsList].sort((a, b) => {
      const aIndex = eventsList.findIndex(e => e.id === a.id);
      const bIndex = eventsList.findIndex(e => e.id === b.id);
      return aIndex - bIndex;
    });

    let currentTime = sortedEvents[0]?.startTime || new Date();
    
    return sortedEvents.map((event, index) => {
      if (index === 0) {
        // Le premier événement garde son heure de début actuelle
        currentTime = new Date(event.startTime);
      } else {
        // Les événements suivants : fin du précédent + buffer
        currentTime = addMinutes(currentTime, BUFFER_TIME_MINUTES);
      }
      
      const updatedEvent = {
        ...event,
        startTime: new Date(currentTime),
        endTime: addMinutes(currentTime, event.duration)
      };
      
      // Préparer pour le prochain événement
      currentTime = addMinutes(currentTime, event.duration);
      
      console.log(`⏰ Event ${index + 1}: ${updatedEvent.title} - ${updatedEvent.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} à ${updatedEvent.endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`);
      
      return updatedEvent;
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || selectionMode) return;

    console.log('🎯 Drag & drop started');
    
    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // PAS DE RECALCUL AUTOMATIQUE - maintient les horaires existants
    console.log('✅ Drag & drop completed, maintaining existing times');
    onEventsUpdate(items);
  };

  const handleEventUpdate = (updatedEvent: PlanningEvent) => {
    console.log('📝 Updating single event:', updatedEvent.title);
    
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    
    // PAS DE RECALCUL AUTOMATIQUE - maintient les horaires existants
    console.log('✅ Event updated, maintaining existing times for other events');
    onEventsUpdate(updatedEvents);
  };

  const handleEventDelete = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    
    // PAS DE RECALCUL AUTOMATIQUE - maintient les horaires existants
    onEventsUpdate(updatedEvents);
  };

  // Fonction pour recalcul manuel
  const handleManualRecalculate = () => {
    const recalculatedEvents = recalculateAllTimes(events);
    onEventsUpdate(recalculatedEvents);
    setShowManualRecalc(false);
  };

  // Trier les événements par heure de début pour l'affichage
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  if (selectionMode) {
    // Mode sélection - pas de drag & drop
    return (
      <div className="space-y-4">
        {/* Bouton de recalcul manuel */}
        {events.length > 1 && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRecalculate}
              className="text-sm"
            >
              <Clock className="h-4 w-4 mr-2" />
              Réorganiser chronologiquement
            </Button>
          </div>
        )}
        {sortedEvents.map((event) => (
          <MonJourMEventCard
            key={event.id}
            event={event}
            teamMembers={teamMembers}
            onUpdate={handleEventUpdate}
            onDelete={handleEventDelete}
            selectionMode={selectionMode}
            isSelected={selectedEvents.includes(event.id)}
            onSelectionChange={onSelectionChange}
          />
        ))}
      </div>
    );
  }

  // Mode normal avec drag & drop - utiliser l'ordre des événements tels qu'ils sont dans la liste
  return (
    <div className="space-y-4">
      {/* Bouton de recalcul manuel */}
      {events.length > 1 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRecalculate}
            className="text-sm"
          >
            <Clock className="h-4 w-4 mr-2" />
            Réorganiser chronologiquement
          </Button>
        </div>
      )}
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="timeline">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="space-y-4"
            >
              {events.map((event, index) => (
                <Draggable key={event.id} draggableId={event.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <MonJourMEventCard
                        event={event}
                        teamMembers={teamMembers}
                        onUpdate={handleEventUpdate}
                        onDelete={handleEventDelete}
                        dragHandleProps={provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
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

export default MonJourMTimeline;
