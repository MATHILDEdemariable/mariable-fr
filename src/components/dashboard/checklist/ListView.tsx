import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr as frLocale, enUS } from 'date-fns/locale';
import { Calendar, User, Circle, Clock, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ChecklistTask } from '@/hooks/useChecklistTasks';

interface ListViewProps {
  tasks: ChecklistTask[];
  onToggleStatus: (task: ChecklistTask) => void;
  onEdit: (task: ChecklistTask) => void;
  onDelete: (task: ChecklistTask) => void;
}

const ListView: React.FC<ListViewProps> = ({ tasks, onToggleStatus, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation('checklist');
  const locale = i18n.language?.startsWith('en') ? enUS : frLocale;

  if (tasks.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">{t('tasks.empty.all')}</p>;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="group flex flex-col gap-2 rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-start gap-3">
            <button type="button" onClick={() => onToggleStatus(task)} aria-label={t('tasks.actions.toggleStatus')} className="mt-0.5">
              {task.status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5 text-wedding-olive" />
              ) : task.status === 'in_progress' ? (
                <Clock className="h-5 w-5 text-blue-600" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            <div className="min-w-0">
              <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </p>
              {task.description && <p className="line-clamp-2 text-sm text-muted-foreground">{task.description}</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <Badge variant="secondary">{t(`tasks.categories.${task.category}`, { defaultValue: task.category })}</Badge>
            {task.due_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.due_date), 'dd MMM yyyy', { locale })}
              </span>
            )}
            {task.responsible && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {task.responsible}
              </span>
            )}
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
      ))}
    </div>
  );
};

export default ListView;
