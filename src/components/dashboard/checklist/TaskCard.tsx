import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { format } from 'date-fns';
import { fr as frLocale, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { GripVertical, Circle, Clock, CheckCircle2, Pencil, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChecklistTask } from '@/hooks/useChecklistTasks';

interface TaskCardProps {
  task: ChecklistTask;
  onToggleStatus: (task: ChecklistTask) => void;
  onEdit: (task: ChecklistTask) => void;
  onDelete: (task: ChecklistTask) => void;
  draggable?: boolean;
  overlay?: boolean;
}

const StatusIcon: React.FC<{ status: ChecklistTask['status'] }> = ({ status }) => {
  if (status === 'completed') return <CheckCircle2 className="h-4 w-4 text-wedding-olive" />;
  if (status === 'in_progress') return <Clock className="h-4 w-4 text-blue-600" />;
  return <Circle className="h-4 w-4 text-muted-foreground" />;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleStatus, onEdit, onDelete, draggable = true, overlay = false }) => {
  const { i18n, t } = useTranslation('checklist');
  const locale = i18n.language?.startsWith('en') ? enUS : frLocale;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled: !draggable,
  });

  return (
    <div
      ref={draggable ? setNodeRef : undefined}
      className={`group rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md ${
        isDragging && !overlay ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        {draggable && (
          <button
            type="button"
            aria-label={t('tasks.actions.drag')}
            className="mt-0.5 cursor-grab touch-none text-muted-foreground hover:text-foreground"
            {...listeners}
            {...attributes}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          aria-label={t('tasks.actions.toggleStatus')}
          onClick={() => onToggleStatus(task)}
          className="mt-0.5"
        >
          <StatusIcon status={task.status} />
        </button>

        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
          )}
          {task.due_date && (
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(new Date(task.due_date), 'dd MMM', { locale })}
            </p>
          )}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onEdit(task)} aria-label={t('tasks.actions.edit')}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-destructive"
            onClick={() => onDelete(task)}
            aria-label={t('tasks.actions.delete')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
