
import React from 'react';
import type { WeddingDaySchedule } from './types';
import { format, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WeddingDayTimelineProps {
  schedule: WeddingDaySchedule;
}

function formatEndTime(event: { time: Date; duration?: number }) {
  if (event.duration) {
    const end = addMinutes(event.time, event.duration);
    return format(end, 'HH:mm', { locale: fr });
  }
  return '';
}

export const WeddingDayTimeline = ({ schedule }: WeddingDayTimelineProps) => {
  return (
    <div className="space-y-4">
      {schedule.events.map((event, index) => (
        <div
          key={index}
          className={[
            'p-4 rounded-md',
            event.isHighlight
              ? 'bg-wedding-olive/10 border border-wedding-olive'
              : event.isMargin
              ? 'bg-gray-50 border border-dashed border-gray-200'
              : 'bg-gray-50'
          ].join(' ')}
        >
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span
                className={[
                  'font-medium',
                  event.isHighlight ? 'text-wedding-olive' : '',
                ].join(' ')}
              >
                {event.label}
              </span>
              <span className="text-base font-semibold">
                {format(event.time, 'HH:mm', { locale: fr })}
                {/* Affiche aussi l'heure de fin pour la cérémonie */}
                {event.type === 'ceremony' && event.duration ? (
                  <span className="ml-3 text-sm font-normal text-muted-foreground">
                    {'→ '}
                    {formatEndTime(event)} <span className="italic">(fin)</span>
                  </span>
                ) : null}
              </span>
            </div>
            {event.duration !== undefined && event.duration > 0 && (
              <div
                className={`${
                  event.isMargin
                    ? 'text-xs text-gray-600 italic mt-1'
                    : 'text-sm text-muted-foreground pt-1 border-t'
                }`}
              >
                Durée : {event.duration} minutes
                {event.note && (
                  <span className="block mt-1 italic">{event.note}</span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
