import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import TaskCard from './TaskCard';
import { STATUS_COLUMN_STYLES, TASK_STATUSES } from './taskConstants';
import type { ChecklistTask, TaskStatus } from '@/hooks/useChecklistTasks';

interface KanbanViewProps {
  tasks: ChecklistTask[];
  onToggleStatus: (task: ChecklistTask) => void;
  onEdit: (task: ChecklistTask) => void;
  onDelete: (task: ChecklistTask) => void;
}

const KanbanColumn: React.FC<{
  status: TaskStatus;
  tasks: ChecklistTask[];
  onToggleStatus: (task: ChecklistTask) => void;
  onEdit: (task: ChecklistTask) => void;
  onDelete: (task: ChecklistTask) => void;
}> = ({ status, tasks, onToggleStatus, onEdit, onDelete }) => {
  const { t } = useTranslation('checklist');
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const styles = STATUS_COLUMN_STYLES[status];

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[300px] rounded-lg border p-3 transition-all ${styles.column} ${
        isOver ? 'ring-2 ring-yellow-400' : ''
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
          <h3 className="text-sm font-semibold">{t(`tasks.status.${status}`)}</h3>
        </div>
        <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">{tasks.length}</span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <p className="py-6 text-center text-xs text-muted-foreground">{t('tasks.empty.column')}</p>
        )}
      </div>
    </div>
  );
};

const KanbanView: React.FC<KanbanViewProps> = ({ tasks, onToggleStatus, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {TASK_STATUSES.map((status) => (
      <KanbanColumn
        key={status}
        status={status}
        tasks={tasks.filter((task) => task.status === status)}
        onToggleStatus={onToggleStatus}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);

export default KanbanView;
