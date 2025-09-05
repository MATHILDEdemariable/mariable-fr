
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import MonJourMEventCard from './MonJourMEventCard';
import { addMinutes, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleDragEnd = (result: any) => {
    if (!result.destination || selectionMode) return;

    console.log('🎯 Drag & drop started');
    
    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    console.log('✅ Drag & drop completed, maintaining existing times');
    onEventsUpdate(items);
  };

  const handleEventUpdate = (updatedEvent: PlanningEvent) => {
    console.log('📝 Updating single event:', updatedEvent.title);
    
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    
    console.log('✅ Event updated, maintaining existing times for other events');
    onEventsUpdate(updatedEvents);
  };

  // Trier les événements par heure de début pour l'affichage
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  if (selectionMode) {
    return (
      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <MonJourMEventCard
            key={event.id}
            event={event}
            teamMembers={teamMembers}
            onUpdate={handleEventUpdate}
            selectionMode={selectionMode}
            isSelected={selectedEvents.includes(event.id)}
            onSelectionChange={onSelectionChange}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">      
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
