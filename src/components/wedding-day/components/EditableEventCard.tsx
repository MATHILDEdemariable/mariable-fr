
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit2, Check, X, Trash2 } from 'lucide-react';
import { PlanningEvent } from '../types/planningTypes';

interface EditableEventCardProps {
  event: PlanningEvent;
  onUpdate: (updatedEvent: PlanningEvent) => void;
  onDelete?: (eventId: string) => void;
  dragHandleProps?: any;
  isDragging?: boolean;
  isCustom?: boolean;
}

const EditableEventCard: React.FC<EditableEventCardProps> = ({
  event,
  onUpdate,
  onDelete,
  dragHandleProps,
  isDragging,
  isCustom = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(event.title);
  const [editedNotes, setEditedNotes] = useState(event.notes || '');
  const [editedDuration, setEditedDuration] = useState(event.duration);

  const handleSave = () => {
    const updatedEvent = {
      ...event,
      title: editedTitle,
      notes: editedNotes,
      duration: editedDuration,
      endTime: new Date(event.startTime.getTime() + editedDuration * 60000)
    };
    
    onUpdate(updatedEvent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(event.title);
    setEditedNotes(event.notes || '');
    setEditedDuration(event.duration);
    setIsEditing(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-50 rotate-2' : ''} ${event.isHighlight ? 'border-wedding-olive border-2' : 'border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
                <div className="w-2 h-8 bg-gray-300 rounded-sm flex flex-col justify-center gap-0.5">
                  <div className="w-full h-0.5 bg-gray-400 rounded"></div>
                  <div className="w-full h-0.5 bg-gray-400 rounded"></div>
                  <div className="w-full h-0.5 bg-gray-400 rounded"></div>
                </div>
              </div>
              
              {/* HEURE en gros */}
              <div className="text-2xl font-bold text-wedding-olive">
                {formatTime(event.startTime)}
              </div>
              
              <div className="flex items-center gap-1 ml-auto">
                {!isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {isCustom && onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(event.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSave}
                      className="h-8 w-8 p-0 text-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="h-8 w-8 p-0 text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* INTITULÉ */}
            <div className="mb-3">
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-lg font-semibold"
                  autoFocus
                />
              ) : (
                <h4 
                  className="text-lg font-semibold text-gray-800 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  onDoubleClick={() => setIsEditing(true)}
                >
                  {event.title}
                </h4>
              )}
            </div>
            
            {/* DURÉE */}
            <div className="text-sm text-gray-600 mb-3">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span>Durée:</span>
                  <Input
                    type="number"
                    value={editedDuration}
                    onChange={(e) => setEditedDuration(parseInt(e.target.value) || 0)}
                    className="w-20"
                    min="1"
                  />
                  <span>min</span>
                </div>
              ) : (
                <span className="font-medium">Durée: {event.duration} min</span>
              )}
            </div>
            
            {/* Notes optionnelles */}
            {(isEditing || event.notes) && (
              <div className="mt-3">
                {isEditing ? (
                  <Textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Notes (optionnel)"
                    rows={2}
                  />
                ) : (
                  event.notes && (
                    <p className="text-sm text-gray-600 cursor-pointer hover:bg-gray-50 p-1 rounded" onDoubleClick={() => setIsEditing(true)}>
                      {event.notes}
                    </p>
                  )
                )}
              </div>
            )}
            
            {/* Badge pour les éléments personnalisés uniquement */}
            {isCustom && (
              <div className="mt-3">
                <span className="inline-block px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800">
                  Personnalisé
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableEventCard;
