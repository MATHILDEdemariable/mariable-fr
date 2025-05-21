
import React from 'react';
import { format, addMinutes } from 'date-fns';
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
  Award
} from 'lucide-react';
import { PlanningEvent } from './types/planningTypes';

interface PlanningTimelineProps {
  events: PlanningEvent[];
}

const PlanningTimeline: React.FC<PlanningTimelineProps> = ({ events }) => {
  // Helper to get the appropriate icon for each event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ceremony':
        return <Heart className="h-5 w-5 text-wedding-olive" />;
      case 'travel':
        return <Car className="h-5 w-5 text-slate-600" />;
      case 'cocktail':
        return <Utensils className="h-5 w-5 text-amber-600" />;
      case 'dinner':
        return <Utensils className="h-5 w-5 text-slate-600" />;
      case 'party':
        return <Music className="h-5 w-5 text-purple-600" />;
      case 'couple_photos':
        return <Camera className="h-5 w-5 text-blue-500" />;
      case 'preparation':
        return <Clock className="h-5 w-5 text-pink-500" />;
      default:
        return <Calendar className="h-5 w-5 text-slate-600" />;
    }
  };
  
  return (
    <div id="planning-timeline" className="space-y-4">
      {events.map((event, index) => (
        <Card key={event.id} className={`overflow-hidden transition-all ${
          event.isHighlight ? 'border-wedding-olive/30 bg-wedding-olive/5' : ''
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`rounded-full p-2 ${
                  event.isHighlight ? 'bg-wedding-olive/20' : 'bg-slate-100'
                }`}>
                  {getEventIcon(event.type)}
                </div>
                <div className="w-px h-full bg-slate-200 my-2 flex-grow"></div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-lg ${
                      event.isHighlight ? 'text-wedding-olive' : ''
                    }`}>
                      {format(new Date(event.startTime), 'HH:mm', { locale: fr })}
                    </span>
                    {event.duration > 0 && (
                      <span className="text-slate-500 text-sm">
                        → {format(new Date(event.endTime), 'HH:mm', { locale: fr })}
                      </span>
                    )}
                  </div>
                  
                  {event.isHighlight && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wedding-olive/20 text-wedding-olive">
                      Moment clé
                    </span>
                  )}
                </div>
                
                <h3 className={`font-medium ${
                  event.isHighlight ? 'text-wedding-olive' : ''
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
