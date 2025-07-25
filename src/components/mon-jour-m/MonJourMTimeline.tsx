
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import MonJourMEventCard from './MonJourMEventCard';
import { addMinutes, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  const BUFFER_TIME_MINUTES = 15; // Buffer entre les événements
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [justRecalculated, setJustRecalculated] = useState(false);
  const { toast } = useToast();

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


  // Fonction pour recalcul manuel avec feedback amélioré
  const handleManualRecalculate = async () => {
    setIsRecalculating(true);
    
    toast({
      title: "Recalcul en cours...",
      description: "Réorganisation des horaires selon les durées",
    });

    // Simule un petit délai pour le feedback visuel
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const recalculatedEvents = recalculateAllTimes(events);
    onEventsUpdate(recalculatedEvents);
    
    setIsRecalculating(false);
    setJustRecalculated(true);
    
    toast({
      title: "✅ Horaires recalculés avec succès",
      description: "Tous les événements ont été réorganisés chronologiquement",
    });

    // Réinitialiser l'état de succès après 3 secondes
    setTimeout(() => {
      setJustRecalculated(false);
    }, 3000);

    // Scroll vers le haut pour voir les changements
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fonction pour obtenir l'icône appropriée
  const getRecalcIcon = () => {
    if (isRecalculating) return <Loader2 className="h-4 w-4 mr-2 animate-spin" />;
    if (justRecalculated) return <CheckCircle className="h-4 w-4 mr-2 text-green-600" />;
    return <Clock className="h-4 w-4 mr-2" />;
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isRecalculating}
                  className={`text-sm transition-colors ${
                    justRecalculated 
                      ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100' 
                      : ''
                  }`}
                >
                  {getRecalcIcon()}
                  {isRecalculating ? 'Recalcul...' : 'Réorganiser chronologiquement'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Réorganiser chronologiquement ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>Attention :</strong> Cette action va recalculer tous les horaires à partir de la première carte selon les durées définies. 
                    <br /><br />
                    <span className="text-amber-600">⚠️ Les tâches simultanées ne seront plus possibles après cette opération.</span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleManualRecalculate}>
                    Confirmer le recalcul
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
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

  // Mode normal avec drag & drop - utiliser l'ordre des événements tels qu'ils sont dans la liste
  return (
    <div className="space-y-4">
      {/* Bouton de recalcul manuel */}
      {events.length > 1 && (
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isRecalculating}
                className={`text-sm transition-colors ${
                  justRecalculated 
                    ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100' 
                    : ''
                }`}
              >
                {getRecalcIcon()}
                {isRecalculating ? 'Recalcul...' : 'Réorganiser chronologiquement'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Réorganiser chronologiquement ?</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>Attention :</strong> Cette action va recalculer tous les horaires à partir de la première carte selon les durées définies. 
                  <br /><br />
                  <span className="text-amber-600">⚠️ Les tâches simultanées ne seront plus possibles après cette opération.</span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleManualRecalculate}>
                  Confirmer le recalcul
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
