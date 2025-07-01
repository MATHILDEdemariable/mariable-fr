
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import MonJourMEventCard from './MonJourMEventCard';
import { addMinutes } from 'date-fns';

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

  const handleDragEnd = (result: any) => {
    if (!result.destination || selectionMode) return;

    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Recalculer les heures séquentiellement avec buffer
    let currentTime = items[0]?.startTime || new Date();
    
    const updatedItems = items.map((item, index) => {
      if (index === 0) {
        // Le premier événement garde son heure de début
        currentTime = new Date(item.startTime);
      } else {
        // Les événements suivants commencent après la fin du précédent + buffer
        const previousEvent = items[index - 1];
        const previousEndTime = addMinutes(previousEvent.startTime, previousEvent.duration);
        currentTime = addMinutes(previousEndTime, BUFFER_TIME_MINUTES);
      }
      
      const updatedItem = {
        ...item,
        startTime: new Date(currentTime),
        endTime: addMinutes(currentTime, item.duration)
      };
      
      return updatedItem;
    });

    console.log('🔄 Drag & drop completed, recalculated times for', updatedItems.length, 'events');
    onEventsUpdate(updatedItems);
  };

  const handleEventUpdate = (updatedEvent: PlanningEvent) => {
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    
    // Recalculer les heures de tous les événements suivants si l'heure de début a changé
    const eventIndex = updatedEvents.findIndex(e => e.id === updatedEvent.id);
    if (eventIndex !== -1) {
      const eventsToUpdate = [...updatedEvents];
      
      // Recalculer les événements suivants
      for (let i = eventIndex + 1; i < eventsToUpdate.length; i++) {
        const previousEvent = eventsToUpdate[i - 1];
        const previousEndTime = addMinutes(previousEvent.startTime, previousEvent.duration);
        const newStartTime = addMinutes(previousEndTime, BUFFER_TIME_MINUTES);
        
        eventsToUpdate[i] = {
          ...eventsToUpdate[i],
          startTime: newStartTime,
          endTime: addMinutes(newStartTime, eventsToUpdate[i].duration)
        };
      }
      
      onEventsUpdate(eventsToUpdate);
    } else {
      onEventsUpdate(updatedEvents);
    }
  };

  const handleEventDelete = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    onEventsUpdate(updatedEvents);
  };

  if (selectionMode) {
    // Mode sélection - pas de drag & drop
    return (
      <div className="space-y-4">
        {events.map((event) => (
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

  // Mode normal avec drag & drop
  return (
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
  );
};

export default MonJourMTimeline;
