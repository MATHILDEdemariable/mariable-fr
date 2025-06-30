
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit2, Check, X, Trash2, GripVertical, Users, Plus } from 'lucide-react';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import { addMinutes } from 'date-fns';

interface MonJourMEventCardProps {
  event: PlanningEvent;
  teamMembers: any[];
  onUpdate: (updatedEvent: PlanningEvent) => void;
  onDelete?: (eventId: string) => void;
  dragHandleProps?: any;
  isDragging?: boolean;
}

const MonJourMEventCard: React.FC<MonJourMEventCardProps> = ({
  event,
  teamMembers,
  onUpdate,
  onDelete,
  dragHandleProps,
  isDragging
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(event.title);
  const [editedNotes, setEditedNotes] = useState(event.notes || '');
  const [editedDuration, setEditedDuration] = useState(event.duration);
  const [showAssignmentSelect, setShowAssignmentSelect] = useState(false);

  const handleSave = () => {
    console.log('💾 Saving event changes:', editedTitle);
    
    if (!editedTitle.trim()) {
      console.warn('⚠️ Empty title, not saving');
      return;
    }

    const updatedEvent: PlanningEvent = {
      ...event,
      title: editedTitle.trim(),
      notes: editedNotes.trim() || undefined,
      duration: Math.max(editedDuration, 5),
      endTime: addMinutes(event.startTime, Math.max(editedDuration, 5))
    };
    
    onUpdate(updatedEvent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log('❌ Cancelling edit');
    setEditedTitle(event.title);
    setEditedNotes(event.notes || '');
    setEditedDuration(event.duration);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Êtes-vous sûr de vouloir supprimer "${event.title}" ?`)) {
      console.log('🗑️ Deleting event:', event.title);
      onDelete(event.id);
    }
  };

  const handleAssignMember = (memberId: string) => {
    const currentAssigned = event.assignedTo || [];
    const newAssigned = currentAssigned.includes(memberId)
      ? currentAssigned.filter(id => id !== memberId)
      : [...currentAssigned, memberId];
    
    const updatedEvent: PlanningEvent = {
      ...event,
      assignedTo: newAssigned
    };
    
    onUpdate(updatedEvent);
    setShowAssignmentSelect(false);
  };

  const getAssignedMembers = () => {
    const assignedIds = event.assignedTo || [];
    return teamMembers.filter(member => assignedIds.includes(member.id));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimeRange = () => {
    return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
  };

  return (
    <Card className={`transition-all duration-200 ${
      isDragging ? 'opacity-50 rotate-2 scale-105 shadow-lg' : 'hover:shadow-md'
    } ${
      event.isHighlight ? 'border-wedding-olive border-2 bg-wedding-olive/5' : 'border-gray-200'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Drag Handle */}
          <div 
            {...dragHandleProps} 
            className="cursor-grab active:cursor-grabbing mt-2 text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          
          <div className="flex-1">
            {/* HEURE sur une ligne */}
            <div className="flex items-center justify-between mb-3">
              <div className={`text-xl font-bold ${
                event.isHighlight ? 'text-wedding-olive' : 'text-gray-700'
              }`}>
                {formatTimeRange()}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1">
                {!isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="h-8 w-8 p-0 hover:bg-blue-100"
                      title="Modifier"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                        title="Supprimer"
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
                      className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
                      disabled={!editedTitle.trim()}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* TITRE */}
            <div className="mb-3">
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-lg font-semibold"
                  placeholder="Titre de l'étape"
                  autoFocus
                />
              ) : (
                <h4 className={`text-lg font-semibold ${
                  event.isHighlight ? 'text-wedding-olive' : 'text-gray-800'
                }`}>
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
                    onChange={(e) => setEditedDuration(Math.max(parseInt(e.target.value) || 5, 5))}
                    className="w-20"
                    min="5"
                    max="480"
                  />
                  <span>min</span>
                </div>
              ) : (
                <span className="font-medium">
                  Durée: {event.duration} minutes
                </span>
              )}
            </div>

            {/* ASSIGNATION */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Assigné à:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAssignmentSelect(!showAssignmentSelect)}
                  className="h-6 w-6 p-0 hover:bg-blue-100"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Membres assignés */}
              <div className="flex flex-wrap gap-1 mb-2">
                {getAssignedMembers().map((member) => (
                  <Badge key={member.id} variant="secondary" className="text-xs">
                    {member.name} ({member.role})
                  </Badge>
                ))}
                {(!event.assignedTo || event.assignedTo.length === 0) && (
                  <span className="text-xs text-gray-500 italic">Non assigné</span>
                )}
              </div>

              {/* Sélecteur d'assignation */}
              {showAssignmentSelect && (
                <Select onValueChange={handleAssignMember}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Assigner à un membre" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    className="resize-none"
                  />
                ) : (
                  event.notes && (
                    <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
                      💡 {event.notes}
                    </p>
                  )
                )}
              </div>
            )}
            
            {/* Moment clé badge */}
            {event.isHighlight && (
              <div className="mt-3">
                <Badge variant="outline" className="bg-wedding-olive/20 text-wedding-olive border-wedding-olive">
                  Moment clé
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonJourMEventCard;
