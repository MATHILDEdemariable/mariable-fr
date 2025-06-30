
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import MonJourMEventCard from './MonJourMEventCard';

interface MonJourMTimelineProps {
  events: PlanningEvent[];
  teamMembers: any[];
  onEventsUpdate: (events: PlanningEvent[]) => void;
}

const MonJourMTimeline: React.FC<MonJourMTimelineProps> = ({
  events,
  teamMembers,
  onEventsUpdate
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Recalculer les heures après le réarrangement
    let currentTime = items[0]?.startTime || new Date();
    const updatedItems = items.map((item, index) => {
      if (index === 0) {
        currentTime = item.startTime;
      } else {
        currentTime = new Date(currentTime.getTime() + items[index - 1].duration * 60000);
        item.startTime = currentTime;
      }
      item.endTime = new Date(currentTime.getTime() + item.duration * 60000);
      return item;
    });

    onEventsUpdate(updatedItems);
  };

  const handleEventUpdate = (updatedEvent: PlanningEvent) => {
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    onEventsUpdate(updatedEvents);
  };

  const handleEventDelete = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    onEventsUpdate(updatedEvents);
  };

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
