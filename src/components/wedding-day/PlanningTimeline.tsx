
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
  // Helper to get the appropriate icon for each event type and category
  const getEventIcon = (event: PlanningEvent | SerializablePlanningEvent) => {
    const { type, category, title } = event;
    
    // Specific icons for logistics/travel
    if (category === 'logistique' || type === 'travel' || title.toLowerCase().includes('trajet')) {
      return <Car className="h-5 w-5 text-blue-600" />;
    }
    
    // Specific icons for preparation activities
    if (category === 'préparatifs_final') {
      if (title.toLowerCase().includes('coiffure')) {
        return <Scissors className="h-5 w-5 text-pink-500" />;
      }
      if (title.toLowerCase().includes('maquillage')) {
        return <Palette className="h-5 w-5 text-purple-500" />;
      }
      if (title.toLowerCase().includes('habillage')) {
        return <Shirt className="h-5 w-5 text-indigo-500" />;
      }
      return <Clock className="h-5 w-5 text-pink-500" />;
    }
    
    // Category-based icons
    switch (type) {
      case 'ceremony':
        return <Heart className="h-5 w-5 text-wedding-olive" />;
      case 'cocktail':
        return <Utensils className="h-5 w-5 text-amber-600" />;
      case 'dinner':
      case 'repas':
        return <Utensils className="h-5 w-5 text-slate-600" />;
      case 'party':
      case 'soiree':
        return <Music className="h-5 w-5 text-purple-600" />;
      case 'couple_photos':
      case 'photos':
        return <Camera className="h-5 w-5 text-blue-500" />;
      default:
        return <Calendar className="h-5 w-5 text-slate-600" />;
    }
  };

  // Helper to get category-specific styling
  const getCategoryColor = (event: PlanningEvent | SerializablePlanningEvent) => {
    const { category, type } = event;
    
    if (category === 'logistique' || type === 'travel') {
      return 'border-blue-200 bg-blue-50';
    }
    if (category === 'préparatifs_final') {
      return 'border-pink-200 bg-pink-50';
    }
    if (category === 'cérémonie') {
      return 'border-wedding-olive/30 bg-wedding-olive/5';
    }
    if (category === 'photos') {
      return 'border-blue-200 bg-blue-50';
    }
    if (category === 'cocktail') {
      return 'border-amber-200 bg-amber-50';
    }
    if (category === 'repas') {
      return 'border-slate-200 bg-slate-50';
    }
    if (category === 'soiree') {
      return 'border-purple-200 bg-purple-50';
    }
    
    return event.isHighlight ? 'border-wedding-olive/30 bg-wedding-olive/5' : '';
  };

  // Helper to ensure we always work with Date objects
  const getTimeFromEvent = (event: PlanningEvent | SerializablePlanningEvent, timeKey: 'startTime' | 'endTime'): Date => {
    const time = event[timeKey];
    return time instanceof Date ? time : new Date(time);
  };
  
  return (
    <div id="planning-timeline" className="space-y-4">
      {events.map((event, index) => (
        <Card key={event.id} className={`overflow-hidden transition-all ${getCategoryColor(event)}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`rounded-full p-2 ${
                  event.isHighlight ? 'bg-wedding-olive/20' : 'bg-white/70'
                }`}>
                  {getEventIcon(event)}
                </div>
                {index < events.length - 1 && (
                  <div className="w-px h-8 bg-slate-200 my-2"></div>
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-lg ${
                      event.isHighlight ? 'text-wedding-olive' : 'text-slate-700'
                    }`}>
                      {format(getTimeFromEvent(event, 'startTime'), 'HH:mm', { locale: fr })}
                    </span>
                    {event.duration > 0 && (
                      <span className="text-slate-500 text-sm">
                        → {format(getTimeFromEvent(event, 'endTime'), 'HH:mm', { locale: fr })}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {event.isHighlight && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wedding-olive/20 text-wedding-olive">
                        Moment clé
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      event.category === 'logistique' ? 'bg-blue-100 text-blue-800' :
                      event.category === 'préparatifs_final' ? 'bg-pink-100 text-pink-800' :
                      event.category === 'cérémonie' ? 'bg-wedding-olive/20 text-wedding-olive' :
                      event.category === 'photos' ? 'bg-blue-100 text-blue-800' :
                      event.category === 'cocktail' ? 'bg-amber-100 text-amber-800' :
                      event.category === 'repas' ? 'bg-slate-100 text-slate-800' :
                      event.category === 'soiree' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <h3 className={`font-medium ${
                  event.isHighlight ? 'text-wedding-olive' : 'text-slate-800'
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
