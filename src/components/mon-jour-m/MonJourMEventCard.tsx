
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2, Check, X, GripVertical, Users, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import { addMinutes } from 'date-fns';

interface MonJourMEventCardProps {
  event: PlanningEvent;
  teamMembers: any[];
  onUpdate: (updatedEvent: PlanningEvent) => void;
  dragHandleProps?: any;
  isDragging?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (eventId: string, selected: boolean) => void;
  selectionMode?: boolean;
}

const MonJourMEventCard: React.FC<MonJourMEventCardProps> = ({
  event,
  teamMembers,
  onUpdate,
  dragHandleProps,
  isDragging,
  isSelected = false,
  onSelectionChange,
  selectionMode = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(event.title);
  const [editedNotes, setEditedNotes] = useState(event.notes || '');
  const [editedDuration, setEditedDuration] = useState(event.duration);
  const [editedStartTime, setEditedStartTime] = useState(
    event.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  );
  const [showAssignmentSelect, setShowAssignmentSelect] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSave = () => {
    console.log('💾 Saving event changes:', editedTitle);
    
    if (!editedTitle.trim()) {
      console.warn('⚠️ Empty title, not saving');
      return;
    }

    // Parse et valider l'heure modifiée
    const [hours, minutes] = editedStartTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      console.warn('⚠️ Invalid time format');
      return;
    }

    // Créer la nouvelle heure de début
    const newStartTime = new Date(event.startTime);
    newStartTime.setHours(hours, minutes, 0, 0);

    const updatedEvent: PlanningEvent = {
      ...event,
      title: editedTitle.trim(),
      notes: editedNotes.trim() || undefined,
      duration: Math.max(editedDuration, 5),
      startTime: newStartTime,
      endTime: addMinutes(newStartTime, Math.max(editedDuration, 5))
    };
    
    onUpdate(updatedEvent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log('❌ Cancelling edit');
    setEditedTitle(event.title);
    setEditedNotes(event.notes || '');
    setEditedDuration(event.duration);
    setEditedStartTime(event.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    setIsEditing(false);
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

  const handleUnassignMember = (memberId: string) => {
    console.log('🚫 Unassigning member:', memberId);
    const currentAssigned = event.assignedTo || [];
    const newAssigned = currentAssigned.filter(id => id !== memberId);
    
    const updatedEvent: PlanningEvent = {
      ...event,
      assignedTo: newAssigned
    };
    
    onUpdate(updatedEvent);
  };

  const handleSelectionToggle = () => {
    if (onSelectionChange) {
      onSelectionChange(event.id, !isSelected);
    }
  };

  const getAssignedMembers = () => {
    const assignedIds = event.assignedTo || [];
    return teamMembers.filter(member => assignedIds.includes(member.id));
  };

  const formatTime = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      return '--:--';
    }
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimeRange = () => {
    const start = formatTime(event.startTime);
    const end = formatTime(event.endTime);
    return `${start} - ${end}`;
  };

  return (
    <Card className={`transition-all duration-200 ${
      isDragging ? 'opacity-50 rotate-2 scale-105 shadow-lg' : 'hover:shadow-md'
    } ${
      event.isHighlight ? 'border-wedding-olive border-2 bg-wedding-olive/5' : 'border-gray-200'
    } ${
      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
    }`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-4">
          {/* Selection checkbox in selection mode */}
          {selectionMode && (
            <div className="mt-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={handleSelectionToggle}
                className="h-4 w-4 sm:h-5 sm:w-5"
              />
            </div>
          )}

          {/* Drag Handle - masqué sur mobile */}
          {!selectionMode && (
            <div 
              {...dragHandleProps} 
              className="cursor-grab active:cursor-grabbing mt-2 text-gray-400 hover:text-gray-600 hidden sm:block"
            >
              <GripVertical className="h-5 w-5" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {/* Layout mobile responsive */}
            <div className="block sm:hidden">{/* Mobile Layout */}
              <div className="space-y-2">
                {/* Heure et actions mobile - ligne compacte */}
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-primary min-w-0">
                    {isEditing ? (
                      <Input
                        type="time"
                        value={editedStartTime}
                        onChange={(e) => setEditedStartTime(e.target.value)}
                        className="w-20 text-sm h-7"
                      />
                    ) : (
                      <span className="truncate">{formatTimeRange()}</span>
                    )}
                  </div>
                  
                  {/* Actions mobile compactes */}
                  {!selectionMode && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!isEditing ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSave}
                            className="h-6 w-6 p-0 text-green-600"
                            disabled={!editedTitle.trim()}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            className="h-6 w-6 p-0 text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Titre mobile - ligne séparée pour éviter le chevauchement */}
                <div>
                  {isEditing ? (
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-sm font-medium h-8"
                      placeholder="Titre de l'étape"
                      autoFocus
                    />
                  ) : (
                    <h4 className="text-sm font-medium leading-snug text-foreground line-clamp-2">
                      {event.title}
                    </h4>
                  )}
                </div>

                {/* Assignation mobile - compacte et lisible */}
                {getAssignedMembers().length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {getAssignedMembers().map((member) => (
                      <Badge 
                        key={member.id} 
                        variant="outline" 
                        className="text-xs px-1.5 py-0.5 bg-muted/50"
                      >
                        {member.role}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Bouton voir détails - conditionnel */}
                {(event.notes || (!selectionMode && teamMembers.length > 0)) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                    className="h-6 text-xs text-muted-foreground hover:text-foreground p-0 justify-start -ml-1"
                  >
                    {showDetails ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Voir moins
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Voir détails
                      </>
                    )}
                  </Button>
                )}

                {/* Section détails mobile - dépliable */}
                {showDetails && (
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    {/* Durée mobile */}
                    <div className="text-xs text-muted-foreground">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <span>Durée:</span>
                          <Input
                            type="number"
                            value={editedDuration}
                            onChange={(e) => setEditedDuration(Math.max(parseInt(e.target.value) || 5, 5))}
                            className="w-16 text-xs h-6"
                            min="5"
                          />
                          <span>min</span>
                        </div>
                      ) : (
                        <span>⏱️ {event.duration} minutes</span>
                      )}
                    </div>

                    {/* Gestion équipe mobile */}
                    {!selectionMode && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>Équipe assignée:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAssignmentSelect(!showAssignmentSelect)}
                            className="h-4 w-4 p-0 ml-auto"
                          >
                            <Plus className="h-2 w-2" />
                          </Button>
                        </div>

                        {getAssignedMembers().length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {getAssignedMembers().map((member) => (
                              <Badge 
                                key={member.id} 
                                variant="secondary" 
                                className="text-xs flex items-center gap-1 pr-1"
                              >
                                <span>{member.name}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnassignMember(member.id);
                                  }}
                                  className="hover:bg-destructive/20 rounded-full p-0.5"
                                >
                                  <X className="h-2 w-2" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        {showAssignmentSelect && (
                          <Select onValueChange={handleAssignMember}>
                            <SelectTrigger className="w-full h-7 text-xs">
                              <SelectValue placeholder="Assigner un membre" />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMembers.map((member) => (
                                <SelectItem key={member.id} value={member.id} className="text-xs">
                                  {member.name} - {member.role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    )}

                    {/* Notes mobiles */}
                    {(isEditing || event.notes) && (
                      <div>
                        {isEditing ? (
                          <Textarea
                            value={editedNotes}
                            onChange={(e) => setEditedNotes(e.target.value)}
                            placeholder="Notes ou instructions..."
                            rows={2}
                            className="resize-none text-xs"
                          />
                        ) : (
                          event.notes && (
                            <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
                              <span className="text-primary">💡</span> {event.notes}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Badge moment clé mobile */}
                {event.isHighlight && (
                  <Badge variant="outline" className="bg-wedding-olive/10 text-wedding-olive border-wedding-olive/30 text-xs w-fit">
                    ⭐ Moment clé
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Layout desktop */}
            <div className="hidden sm:block">
              <div>
                {/* HEURE sur une ligne */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-xl font-bold ${
                    event.isHighlight ? 'text-wedding-olive' : 'text-gray-700'
                  }`}>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={editedStartTime}
                          onChange={(e) => setEditedStartTime(e.target.value)}
                          className="w-24 text-lg font-bold"
                        />
                        <span className="text-gray-500">-</span>
                        <span className="text-sm text-gray-500">
                          {(() => {
                            const [hours, minutes] = editedStartTime.split(':').map(Number);
                            if (!isNaN(hours) && !isNaN(minutes)) {
                              const start = new Date();
                              start.setHours(hours, minutes, 0, 0);
                              const end = addMinutes(start, editedDuration);
                              return end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                            }
                            return '--:--';
                          })()}
                        </span>
                      </div>
                    ) : (
                      formatTimeRange()
                    )}
                  </div>
                  
                  {/* Actions */}
                  {!selectionMode && (
                    <div className="flex items-center gap-1">
                       {!isEditing ? (
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => setIsEditing(true)}
                           className="h-8 w-8 p-0 hover:bg-blue-100"
                           title="Modifier"
                         >
                           <Edit2 className="h-4 w-4" />
                         </Button>
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
                  )}
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
                    {!selectionMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAssignmentSelect(!showAssignmentSelect)}
                        className="h-6 w-6 p-0 hover:bg-blue-100"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Badges des membres assignés */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {getAssignedMembers().map((member) => (
                      <Badge 
                        key={member.id} 
                        variant="secondary" 
                        className="text-xs flex items-center gap-1 pr-1 hover:bg-red-100 transition-colors cursor-pointer group"
                      >
                        <span>{member.name} ({member.role})</span>
                        {!selectionMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnassignMember(member.id);
                            }}
                            className="ml-1 hover:bg-red-200 rounded-full p-0.5 group-hover:text-red-600 transition-colors"
                            title={`Désassigner ${member.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {(!event.assignedTo || event.assignedTo.length === 0) && (
                      <span className="text-xs text-gray-500 italic">Non assigné</span>
                    )}
                  </div>

                  {/* Sélecteur d'assignation */}
                  {showAssignmentSelect && !selectionMode && (
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonJourMEventCard;
