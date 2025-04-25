import React from 'react';
import type { WeddingDaySchedule } from './types';
import { format, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WeddingDayTimelineProps {
  schedule: WeddingDaySchedule;
}

// Helper to determine if an event is a highlight moment
const isHighlightEvent = (type?: string): boolean => {
  const highlightTypes = ['couple_photos', 'entrance', 'firstdance'];
  return type ? highlightTypes.includes(type) : false;
};

// Helper to determine if an event should be hidden based on user selections
const shouldShowEvent = (event: { type?: string }, schedule: WeddingDaySchedule): boolean => {
  // Always show non-optional events
  if (!event.type || ['ceremony', 'ceremony_time', 'travel', 'cocktail', 'dinner'].includes(event.type)) {
    return true;
  }
  
  // Check if specific optional events should be displayed
  switch(event.type) {
    case 'couple_photos':
      return schedule.userChoices?.hasCouplePhotoSession ?? true;
    case 'entrance':
      return schedule.userChoices?.hasCoupleEntrance ?? true;
    case 'animation':
      return schedule.userChoices?.hasOtherAnimations ?? false;
    case 'cake':
      return schedule.userChoices?.hasWeddingCake ?? true;
    case 'firstdance':
      return schedule.userChoices?.hasFirstDance ?? true;
    case 'marge':
      return true;
    default:
      return true;
  }
};

function formatEndTime(event: { time: Date; duration?: number }) {
  if (event.duration) {
    const end = addMinutes(event.time, event.duration);
    return format(end, 'HH:mm', { locale: fr });
  }
  return '';
}

export const WeddingDayTimeline = ({ schedule }: WeddingDayTimelineProps) => {
  return (
    <div className="space-y-3">
      {schedule.events.map((event, index) => {
        if (!shouldShowEvent(event, schedule)) {
          return null;
        }
        
        const endTime = formatEndTime(event);
        const isHighlight = isHighlightEvent(event.type);

        return (
          <div
            key={index}
            className={`p-4 rounded-lg transition-all ${
              event.isMargin ? 'bg-gray-50/50 border-dashed border-gray-200 py-2' : 'bg-white'
            }`}
          >
            {/* En-tête avec les horaires */}
            <div className="flex justify-between items-start mb-2">
              <span className={`${event.isMargin ? 'text-sm' : 'text-base'} font-medium`}>
                {format(event.time, 'HH:mm', { locale: fr })}
                {endTime && (
                  <span className="text-muted-foreground">
                    {' → '}
                    {endTime}
                  </span>
                )}
              </span>
              {isHighlight && (
                <span className="px-2 py-0.5 text-xs font-medium text-wedding-olive bg-wedding-olive/10 rounded-full">
                  Temps fort
                </span>
              )}
            </div>

            {/* Corps de l'événement */}
            <div className="space-y-1">
              <h3 className={`${event.isMargin ? 'text-sm' : 'text-lg'} ${
                isHighlight ? 'text-wedding-olive font-medium' : 'font-normal'
              }`}>
                {event.label}
              </h3>

              {/* Informations supplémentaires */}
              {(event.duration || event.note) && (
                <div className={`${
                  event.isMargin
                    ? 'text-xs text-muted-foreground italic'
                    : 'text-sm text-muted-foreground'
                }`}>
                  {event.duration && (
                    <p>
                      Durée estimative : {event.duration} minutes
                    </p>
                  )}
                  {event.note && <p className="mt-1 italic">{event.note}</p>}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
