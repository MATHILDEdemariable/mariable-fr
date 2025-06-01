
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Camera, 
  Music, 
  Utensils, 
  Heart, 
  Car,
  Award,
  Scissors,
  Palette,
  Shirt
} from 'lucide-react';
import { PlanningEvent, SerializablePlanningEvent } from './types/planningTypes';

interface PlanningTimelineProps {
  events: PlanningEvent[] | SerializablePlanningEvent[];
}

const PlanningTimeline: React.FC<PlanningTimelineProps> = ({ events }) => {
  // Helper to ensure we always work with Date objects
  const getTimeFromEvent = (event: PlanningEvent | SerializablePlanningEvent, timeKey: 'startTime' | 'endTime'): Date => {
    const time = event[timeKey];
    return time instanceof Date ? time : new Date(time);
  };
  
  return (
    <div id="planning-timeline" className="space-y-4">
      {events.map((event, index) => (
        <Card key={event.id} className={`p-3 sm:p-4 rounded-lg border transition-all ${
          event.isHighlight ? 'border-wedding-olive/30 bg-wedding-olive/5' : 'border-gray-200'
        } hover:shadow-md`}>
          <CardContent className="p-0">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-baseline gap-3">
                    <span className={`text-2xl font-bold ${
                      event.isHighlight ? 'text-wedding-olive' : 'text-wedding-olive'
                    }`}>
                      {format(getTimeFromEvent(event, 'startTime'), 'HH:mm', { locale: fr })}
                    </span>
                    {event.duration > 0 && (
                      <span className="text-lg text-slate-500">
                        → {format(getTimeFromEvent(event, 'endTime'), 'HH:mm', { locale: fr })}
                      </span>
                    )}
                  </div>
                  
                  {event.isHighlight && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wedding-olive/20 text-wedding-olive">
                      Moment clé
                    </span>
                  )}
                </div>
                
                <h3 className={`font-medium text-lg ${
                  event.isHighlight ? 'text-slate-800' : 'text-slate-800'
                }`}>
                  {event.title}
                </h3>
                
                {event.duration > 0 && (
                  <p className="text-sm text-slate-500">
                    Durée: {event.duration} minutes
                  </p>
                )}
                
                {event.notes && (
                  <p className="text-sm italic text-slate-600 mt-1">
                    {event.notes}
                  </p>
                )}
                
                {event.location && (
                  <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlanningTimeline;
