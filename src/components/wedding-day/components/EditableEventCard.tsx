
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit2, Check, X, Trash2, GripVertical } from 'lucide-react';
import { PlanningEvent } from '../types/planningTypes';
import { addMinutes } from 'date-fns';

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
    console.log('💾 Saving event changes:', editedTitle);
    
    if (!editedTitle.trim()) {
      console.warn('⚠️ Empty title, not saving');
      return;
    }

    const updatedEvent: PlanningEvent = {
      ...event,
      title: editedTitle.trim(),
      notes: editedNotes.trim() || undefined,
      duration: Math.max(editedDuration, 5), // Minimum 5 minutes
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

  const handleStartEdit = () => {
    console.log('✏️ Starting edit mode for:', event.title);
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Êtes-vous sûr de vouloir supprimer "${event.title}" ?`)) {
      console.log('🗑️ Deleting event:', event.title);
      onDelete(event.id);
    }
  };

  // Gestionnaire unifié des raccourcis clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
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
            <div className="flex items-center gap-3 mb-3">
              {/* HEURE en gros */}
              <div className={`text-2xl font-bold ${
                event.isHighlight ? 'text-wedding-olive' : 'text-gray-700'
              }`}>
                {formatTime(event.startTime)}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1 ml-auto">
                {!isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleStartEdit}
                      className="h-8 w-8 p-0 hover:bg-blue-100"
                      title="Modifier (double-clic aussi)"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {isCustom && onDelete && (
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
                      title="Sauvegarder (Entrée)"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                      title="Annuler (Échap)"
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
                  placeholder="Titre de l'étape"
                  autoFocus
                  onKeyDown={handleKeyDown}
                />
              ) : (
                <h4 
                  className={`text-lg font-semibold cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors ${
                    event.isHighlight ? 'text-wedding-olive' : 'text-gray-800'
                  }`}
                  onDoubleClick={handleStartEdit}
                  title="Double-cliquez pour modifier"
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
                    onChange={(e) => setEditedDuration(Math.max(parseInt(e.target.value) || 5, 5))}
                    className="w-20"
                    min="5"
                    max="480"
                    onKeyDown={handleKeyDown}
                  />
                  <span>min</span>
                </div>
              ) : (
                <span className="font-medium">
                  Durée: {event.duration} min • 
                  Fin: {formatTime(event.endTime)}
                </span>
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
                    onKeyDown={(e) => {
                      // Permettre Shift+Entrée pour nouvelle ligne dans textarea
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSave();
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        handleCancel();
                      }
                    }}
                  />
                ) : (
                  event.notes && (
                    <p 
                      className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={handleStartEdit}
                      title="Cliquez pour modifier"
                    >
                      💡 {event.notes}
                    </p>
                  )
                )}
              </div>
            )}
            
            {/* Catégorie et highlight badge */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                event.category === 'logistique' ? 'bg-blue-100 text-blue-800' :
                event.category === 'préparatifs_final' ? 'bg-pink-100 text-pink-800' :
                event.category === 'cérémonie' ? 'bg-wedding-olive/20 text-wedding-olive' :
                event.category === 'photos' ? 'bg-blue-100 text-blue-800' :
                event.category === 'cocktail' ? 'bg-amber-100 text-amber-800' :
                event.category === 'repas' ? 'bg-slate-100 text-slate-800' :
                event.category === 'soiree' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {event.category}
              </span>
              
              {event.isHighlight && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wedding-olive/20 text-wedding-olive">
                  Moment clé
                </span>
              )}
              
              {isEditing && (
                <span className="text-xs text-gray-500 italic">
                  Entrée = Sauver • Échap = Annuler
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableEventCard;
