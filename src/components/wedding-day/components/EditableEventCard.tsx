
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit2, Check, X, Trash2, GripVertical } from 'lucide-react';
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
    <Card className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
      isDragging ? 'opacity-50 rotate-2' : ''
    } ${
      event.isHighlight ? 'border-wedding-olive/30 bg-wedding-olive/5' : 'border-gray-200'
    } hover:shadow-md`}>
      <CardContent className="p-0">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div {...dragHandleProps} className="mb-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
              <GripVertical className="h-5 w-5" />
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex items-baseline gap-3">
                <span className={`text-2xl font-bold ${
                  event.isHighlight ? 'text-wedding-olive' : 'text-wedding-olive'
                }`}>
                  {formatTime(event.startTime)}
                </span>
                {event.duration > 0 && (
                  <span className="text-lg text-slate-500">
                    → {formatTime(event.endTime)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
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
            
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-lg font-medium"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Durée:</span>
                  <Input
                    type="number"
                    value={editedDuration}
                    onChange={(e) => setEditedDuration(parseInt(e.target.value) || 0)}
                    className="w-20"
                    min="1"
                  />
                  <span className="text-sm text-slate-600">min</span>
                </div>
                <Textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Notes (optionnel)"
                  className="mt-2"
                  rows={2}
                />
              </div>
            ) : (
              <>
                <h3 
                  className="font-medium text-lg text-slate-800 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  onDoubleClick={() => setIsEditing(true)}
                >
                  {event.title}
                </h3>
                
                <p className="text-sm text-slate-500">
                  Durée: {event.duration} minutes
                </p>
                
                {event.notes && (
                  <p className="text-sm text-gray-600 mt-2 cursor-pointer hover:bg-gray-50 p-1 rounded" onDoubleClick={() => setIsEditing(true)}>
                    {event.notes}
                  </p>
                )}
                
                {isCustom && (
                  <span className="inline-block px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800">
                    Personnalisé
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableEventCard;
