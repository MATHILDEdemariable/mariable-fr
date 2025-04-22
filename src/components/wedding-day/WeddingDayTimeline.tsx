
import React from 'react';
import type { WeddingDaySchedule } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WeddingDayTimelineProps {
  schedule: WeddingDaySchedule;
}

export const WeddingDayTimeline = ({ schedule }: WeddingDayTimelineProps) => {
  return (
    <div className="space-y-2">
      {schedule.events.map((event, index) => (
        <div
          key={index}
          className={`p-3 rounded-md ${
            event.isHighlight
              ? 'bg-wedding-olive/10 border border-wedding-olive'
              : 'bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-center">
            <span
              className={`font-medium ${
                event.isHighlight ? 'text-wedding-olive' : ''
              }`}
            >
              {event.label}
            </span>
            <span className="text-sm">
              {format(event.time, 'HH:mm', { locale: fr })}
            </span>
          </div>
          {event.duration && (
            <div className="text-sm text-muted-foreground mt-1">
              Durée : {event.duration} min
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
