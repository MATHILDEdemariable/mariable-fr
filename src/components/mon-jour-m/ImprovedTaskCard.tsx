
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Check, X, Trash2, GripVertical, Clock } from 'lucide-react';
import { calculateEndTime } from '@/utils/timeCalculations';

interface Task {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  duration: number;
  category: string;
  priority: "low" | "medium" | "high";
  assigned_role?: string;
  is_ai_generated?: boolean;
}

interface ImprovedTaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  dragHandleProps?: any;
  isDragging?: boolean;
  isCustom?: boolean;
}

const ImprovedTaskCard: React.FC<ImprovedTaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  dragHandleProps,
  isDragging,
  isCustom = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const endTime = calculateEndTime(task.start_time, task.duration);

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return 'Moyenne';
    }
  };

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'opacity-75 rotate-1 shadow-lg' : 'hover:shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="flex items-center pt-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          
          {/* Horaires - GROS à gauche */}
          <div className="flex-shrink-0">
            <div className="text-3xl font-bold text-wedding-olive leading-tight">
              {task.start_time}
            </div>
            <div className="text-lg text-gray-600 leading-tight">
              {endTime}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Clock className="h-3 w-3" />
              <span>{task.duration}min</span>
            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-grow min-w-0">
                {isEditing ? (
                  <Input
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="text-lg font-semibold mb-2"
                    autoFocus
                  />
                ) : (
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {task.title}
                  </h3>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1 ml-2">
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
                        onClick={() => onDelete(task.id)}
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
            
            {/* Description */}
            {(isEditing || task.description) && (
              <div className="mb-3">
                {isEditing ? (
                  <Textarea
                    value={editedTask.description || ''}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    placeholder="Description (optionnel)"
                    rows={2}
                    className="text-sm"
                  />
                ) : (
                  task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                  )
                )}
              </div>
            )}
            
            {/* Durée éditable */}
            {isEditing && (
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Durée:</span>
                  <Input
                    type="number"
                    value={editedTask.duration}
                    onChange={(e) => setEditedTask({ ...editedTask, duration: parseInt(e.target.value) || 0 })}
                    className="w-20 text-sm"
                    min="5"
                    max="480"
                  />
                  <span className="text-sm text-gray-500">minutes</span>
                </div>
              </div>
            )}
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {task.category}
              </Badge>
              
              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                {getPriorityLabel(task.priority)}
              </Badge>
              
              {task.assigned_role && (
                <Badge variant="secondary" className="text-xs">
                  {task.assigned_role}
                </Badge>
              )}
              
              {task.is_ai_generated && (
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                  IA
                </Badge>
              )}
              
              {isCustom && (
                <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-800">
                  Personnalisé
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovedTaskCard;
