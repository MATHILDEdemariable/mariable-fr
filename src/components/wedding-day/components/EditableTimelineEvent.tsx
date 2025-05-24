
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { format, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
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
  GripVertical,
  Edit2,
  Check,
  X,
  Trash2
} from 'lucide-react';
import { PlanningEvent } from '../types/planningTypes';

interface EditableTimelineEventProps {
  event: PlanningEvent;
  onUpdate: (updatedEvent: PlanningEvent) => void;
  onDelete?: (eventId: string) => void;
  dragHandleProps?: any;
  isDragging?: boolean;
  isCustom?: boolean;
}

const EditableTimelineEvent: React.FC<EditableTimelineEventProps> = ({ 
  event, 
  onUpdate, 
  onDelete,
  dragHandleProps,
  isDragging,
  isCustom = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(event.title);
  const [editNotes, setEditNotes] = useState(event.notes || '');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

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
      case 'custom':
        return <Award className="h-5 w-5 text-wedding-olive" />;
      default:
        return <Calendar className="h-5 w-5 text-slate-600" />;
    }
  };

  const handleSave = () => {
    const updatedEvent = {
      ...event,
      title: editTitle.trim() || 'Nouvelle étape',
      notes: editNotes.trim() || undefined
    };
    onUpdate(updatedEvent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(event.title);
    setEditNotes(event.notes || '');
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all cursor-move ${
        event.isHighlight ? 'border-wedding-olive/30 bg-wedding-olive/5' : ''
      } ${isDragging ? 'shadow-lg rotate-1' : 'hover:shadow-md'}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div {...dragHandleProps} className="mb-2 text-gray-400 hover:text-gray-600">
              <GripVertical className="h-5 w-5" />
            </div>
            <div className={`rounded-full p-2 ${
              event.isHighlight ? 'bg-wedding-olive/20' : 'bg-slate-100'
            }`}>
              {getEventIcon(event.type)}
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-lg ${
                  event.isHighlight ? 'text-wedding-olive' : ''
                }`}>
                  {format(event.startTime, 'HH:mm', { locale: fr })}
                </span>
                {event.duration > 0 && (
                  <span className="text-slate-500 text-sm">
                    → {format(event.endTime, 'HH:mm', { locale: fr })}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {event.isHighlight && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wedding-olive/20 text-wedding-olive">
                    Moment clé
                  </span>
                )}
                {isCustom && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Personnalisé
                  </span>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  ref={titleInputRef}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="font-medium"
                />
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Description (optionnel)..."
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-medium ${
                    event.isHighlight ? 'text-wedding-olive' : ''
                  }`}>
                    {event.title}
                  </h3>
                  {(isCustom || event.type === 'custom') && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      {onDelete && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(event.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                {event.duration > 0 && (
                  <p className="text-sm text-slate-500">
                    Durée: {event.duration} minutes
                  </p>
                )}
                
                {event.notes && (
                  <p className="text-sm italic text-slate-600">
                    {event.notes}
                  </p>
                )}
                
                {event.location && (
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableTimelineEvent;
