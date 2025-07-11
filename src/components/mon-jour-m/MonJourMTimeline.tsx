
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import MonJourMEventCard from './MonJourMEventCard';
import MonJourMParallelTasks from './MonJourMParallelTasks';
import { addMinutes, parseISO } from 'date-fns';
import { generateParallelGroupId } from '@/types/monjourm-mvp';

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

  // Grouper les événements par parallel_group
  const groupEventsByParallelGroup = (eventsList: PlanningEvent[]): Map<string, PlanningEvent[]> => {
    const groups = new Map<string, PlanningEvent[]>();
    
    eventsList.forEach(event => {
      const groupKey = (event as any).parallel_group || `single_${event.id}`;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(event);
    });
    
    return groups;
  };

  // Obtenir la durée maximale d'un groupe parallèle
  const getGroupDuration = (groupEvents: PlanningEvent[]): number => {
    return Math.max(...groupEvents.map(event => event.duration));
  };

  // Fonction pour recalculer chronologiquement TOUS les horaires (avec support des groupes parallèles)
  const recalculateAllTimes = (eventsList: PlanningEvent[]): PlanningEvent[] => {
    if (eventsList.length === 0) return eventsList;

    console.log('🔄 Recalculating all times chronologically for', eventsList.length, 'events');
    
    // Grouper les événements par parallel_group
    const groups = groupEventsByParallelGroup(eventsList);
    const groupKeys = Array.from(groups.keys()).sort((a, b) => {
      const firstEventA = groups.get(a)![0];
      const firstEventB = groups.get(b)![0];
      const indexA = eventsList.findIndex(e => e.id === firstEventA.id);
      const indexB = eventsList.findIndex(e => e.id === firstEventB.id);
      return indexA - indexB;
    });

    let currentTime = groups.get(groupKeys[0])![0]?.startTime || new Date();
    const updatedEvents: PlanningEvent[] = [];
    
    groupKeys.forEach((groupKey, groupIndex) => {
      const groupEvents = groups.get(groupKey)!;
      const maxDuration = getGroupDuration(groupEvents);
      
      if (groupIndex === 0) {
        // Le premier groupe garde son heure de début actuelle
        currentTime = new Date(groupEvents[0].startTime);
      } else {
        // Les groupes suivants : fin du précédent + buffer
        currentTime = addMinutes(currentTime, BUFFER_TIME_MINUTES);
      }
      
      // Tous les événements du groupe commencent en même temps
      groupEvents.forEach(event => {
        const updatedEvent = {
          ...event,
          startTime: new Date(currentTime),
          endTime: addMinutes(currentTime, event.duration)
        };
        updatedEvents.push(updatedEvent);
        
        console.log(`⏰ Group ${groupIndex + 1}: ${updatedEvent.title} - ${updatedEvent.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} à ${updatedEvent.endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`);
      });
      
      // Préparer pour le prochain groupe (utiliser la durée maximale du groupe)
      currentTime = addMinutes(currentTime, maxDuration);
    });
    
    return updatedEvents;
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || selectionMode) return;

    console.log('🎯 Drag & drop started');
    
    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // RECALCUL CHRONOLOGIQUE COMPLET
    const recalculatedItems = recalculateAllTimes(items);

    console.log('✅ Drag & drop completed, updating all events with new chronological times');
    onEventsUpdate(recalculatedItems);
  };

  const handleEventUpdate = (updatedEvent: PlanningEvent) => {
    console.log('📝 Updating single event:', updatedEvent.title);
    
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    
    // Si l'heure de début a été modifiée, recalculer tous les événements suivants
    const eventIndex = updatedEvents.findIndex(e => e.id === updatedEvent.id);
    if (eventIndex !== -1) {
      // Recalculer seulement les événements suivants
      const eventsToRecalculate = [...updatedEvents];
      let currentTime = updatedEvent.endTime;
      
      for (let i = eventIndex + 1; i < eventsToRecalculate.length; i++) {
        const newStartTime = addMinutes(currentTime, BUFFER_TIME_MINUTES);
        eventsToRecalculate[i] = {
          ...eventsToRecalculate[i],
          startTime: newStartTime,
          endTime: addMinutes(newStartTime, eventsToRecalculate[i].duration)
        };
        currentTime = eventsToRecalculate[i].endTime;
      }
      
      console.log('🔄 Recalculated following events after update');
      onEventsUpdate(eventsToRecalculate);
    } else {
      onEventsUpdate(updatedEvents);
    }
  };

  const handleEventDelete = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    
    // Recalculer tous les horaires après suppression
    const recalculatedEvents = recalculateAllTimes(updatedEvents);
    onEventsUpdate(recalculatedEvents);
  };

  const handleAddParallelTask = (baseEvent: PlanningEvent) => {
    console.log('➕ Adding parallel task to:', baseEvent.title);
    
    // Générer un ID de groupe si la tâche de base n'en a pas
    const parallelGroupId = (baseEvent as any).parallel_group || generateParallelGroupId();
    
    // Créer une nouvelle tâche parallèle
    const newEvent: PlanningEvent = {
      id: `parallel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Tâche parallèle`,
      startTime: new Date(baseEvent.startTime),
      endTime: addMinutes(baseEvent.startTime, 30),
      duration: 30,
      category: baseEvent.category,
      type: baseEvent.type,
      isHighlight: false,
      assignedTo: [],
      notes: ''
    };

    // Mettre à jour la tâche de base avec le groupe parallèle
    const updatedBaseEvent = {
      ...baseEvent,
      parallel_group: parallelGroupId
    } as any;

    // Ajouter le parallel_group à la nouvelle tâche
    (newEvent as any).parallel_group = parallelGroupId;

    // Mettre à jour la liste des événements
    const updatedEvents = events.map(event => 
      event.id === baseEvent.id ? updatedBaseEvent : event
    );
    updatedEvents.push(newEvent);

    // Recalculer tous les horaires
    const recalculatedEvents = recalculateAllTimes(updatedEvents);
    onEventsUpdate(recalculatedEvents);
  };

  // Grouper les événements pour l'affichage
  const getGroupedEventsForDisplay = () => {
    const groups = groupEventsByParallelGroup(events);
    const groupKeys = Array.from(groups.keys()).sort((a, b) => {
      const firstEventA = groups.get(a)![0];
      const firstEventB = groups.get(b)![0];
      const indexA = events.findIndex(e => e.id === firstEventA.id);
      const indexB = events.findIndex(e => e.id === firstEventB.id);
      return indexA - indexB;
    });

    return groupKeys.map(groupKey => ({
      groupKey,
      events: groups.get(groupKey)!
    }));
  };

  const groupedEvents = getGroupedEventsForDisplay();

  if (selectionMode) {
    // Mode sélection - affichage groupé sans drag & drop
    return (
      <div className="space-y-4">
        {groupedEvents.map(({ groupKey, events: groupEvents }) => (
          <MonJourMParallelTasks
            key={groupKey}
            parallelTasks={groupEvents}
            teamMembers={teamMembers}
            onUpdate={handleEventUpdate}
            onDelete={handleEventDelete}
            selectionMode={selectionMode}
            selectedEvents={selectedEvents}
            onSelectionChange={onSelectionChange}
          />
        ))}
      </div>
    );
  }

  // Mode normal avec drag & drop et support des tâches parallèles
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="timeline">
        {(provided) => (
          <div 
            {...provided.droppableProps} 
            ref={provided.innerRef}
            className="space-y-4"
          >
            {groupedEvents.map(({ groupKey, events: groupEvents }, groupIndex) => (
              <Draggable key={groupKey} draggableId={groupKey} index={groupIndex}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <MonJourMParallelTasks
                      parallelTasks={groupEvents}
                      teamMembers={teamMembers}
                      onUpdate={handleEventUpdate}
                      onDelete={handleEventDelete}
                      onAddParallelTask={handleAddParallelTask}
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
