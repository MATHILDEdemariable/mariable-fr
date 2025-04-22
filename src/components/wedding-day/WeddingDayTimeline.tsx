
import React from 'react';
import type { WeddingDaySchedule } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WeddingDayTimelineProps {
  schedule: WeddingDaySchedule;
}

export const WeddingDayTimeline = ({ schedule }: WeddingDayTimelineProps) => {
  return (
    <div className="space-y-4">
      {schedule.events.map((event, index) => (
        <div
          key={index}
          className={`p-4 rounded-md ${
            event.isHighlight
              ? 'bg-wedding-olive/10 border border-wedding-olive'
              : 'bg-gray-50'
          }`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span
                className={`font-medium ${
                  event.isHighlight ? 'text-wedding-olive' : ''
                }`}
              >
                {event.label}
              </span>
              <span className="text-sm font-medium">
                {format(event.time, 'HH:mm', { locale: fr })}
              </span>
            </div>
            {event.duration && event.duration > 0 && (
              <div className="text-sm text-muted-foreground pt-1 border-t">
                Durée : {event.duration} minutes
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
