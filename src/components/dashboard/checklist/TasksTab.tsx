import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { LayoutGrid, List as ListIcon, CalendarDays, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useChecklistTasks, type ChecklistTask, type ChecklistTaskInput, type TaskStatus } from '@/hooks/useChecklistTasks';
import KanbanView from './KanbanView';
import ListView from './ListView';
import CalendarView from './CalendarView';
import TaskDialog from './TaskDialog';
import TaskCard from './TaskCard';
import { TASK_STATUSES } from './taskConstants';

type ViewMode = 'kanban' | 'list' | 'calendar';

const TasksTab: React.FC = () => {
  const { t } = useTranslation('checklist');
  const { toast } = useToast();
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useChecklistTasks();

  const [view, setView] = useState<ViewMode>('kanban');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ChecklistTask | null>(null);
  const [activeTask, setActiveTask] = useState<ChecklistTask | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const counts = useMemo(
    () => ({
      pending: tasks.filter((task) => task.status === 'pending').length,
      in_progress: tasks.filter((task) => task.status === 'in_progress').length,
      completed: tasks.filter((task) => task.status === 'completed').length,
    }),
    [tasks]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks.find((task) => task.id === event.active.id) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const newStatus = over.id as TaskStatus;
    if (!TASK_STATUSES.includes(newStatus)) return;

    const task = tasks.find((item) => item.id === active.id);
    if (!task || task.status === newStatus) return;

    updateTask.mutate(
      { id: task.id, status: newStatus },
      {
        onSuccess: () =>
          toast({
            title: t('tasks.toasts.statusUpdated'),
            description: t(`tasks.status.${newStatus}`),
          }),
        onError: () => toast({ title: t('tasks.toasts.error'), variant: 'destructive' }),
      }
    );
  };

  const handleToggleStatus = (task: ChecklistTask) => {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTask.mutate(
      { id: task.id, status: nextStatus },
      {
        onSuccess: () =>
          toast({
            title: nextStatus === 'completed' ? t('tasks.toasts.completed') : t('tasks.toasts.statusUpdated'),
          }),
        onError: () => toast({ title: t('tasks.toasts.error'), variant: 'destructive' }),
      }
    );
  };

  const handleEdit = (task: ChecklistTask) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (task: ChecklistTask) => {
    deleteTask.mutate(task.id, {
      onSuccess: () => toast({ title: t('tasks.toasts.deleted') }),
      onError: () => toast({ title: t('tasks.toasts.error'), variant: 'destructive' }),
    });
  };

  const handleSubmit = (values: ChecklistTaskInput) => {
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, ...values },
        {
          onSuccess: () => {
            toast({ title: t('tasks.toasts.updated') });
            setDialogOpen(false);
            setEditingTask(null);
          },
          onError: () => toast({ title: t('tasks.toasts.error'), variant: 'destructive' }),
        }
      );
      return;
    }

    createTask.mutate(values, {
      onSuccess: () => {
        toast({ title: t('tasks.toasts.created') });
        setDialogOpen(false);
      },
      onError: () => toast({ title: t('tasks.toasts.error'), variant: 'destructive' }),
    });
  };

  const summaryCards: Array<{ status: TaskStatus; className: string }> = [
    { status: 'pending', className: 'bg-muted/50' },
    { status: 'in_progress', className: 'bg-blue-50' },
    { status: 'completed', className: 'bg-wedding-olive/10' },
  ];

  const viewButtons: Array<{ key: ViewMode; icon: React.ReactNode }> = [
    { key: 'kanban', icon: <LayoutGrid className="h-4 w-4" /> },
    { key: 'list', icon: <ListIcon className="h-4 w-4" /> },
    { key: 'calendar', icon: <CalendarDays className="h-4 w-4" /> },
  ];

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">{t('tasks.loading')}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {summaryCards.map(({ status, className }) => (
          <Card key={status} className={className}>
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">{t(`tasks.status.${status}`)}</p>
              <p className="text-2xl font-semibold">{counts[status]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg bg-muted p-1">
          {viewButtons.map(({ key, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                view === key ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {icon}
              <span className="hidden sm:inline">{t(`tasks.views.${key}`)}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={() => {
            setEditingTask(null);
            setDialogOpen(true);
          }}
          className="bg-wedding-olive hover:bg-wedding-olive/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('tasks.actions.add')}
        </Button>
      </div>

      {view === 'kanban' && (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <KanbanView
            tasks={tasks}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <DragOverlay>
            {activeTask && (
              <TaskCard
                task={activeTask}
                onToggleStatus={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
                draggable={false}
                overlay
              />
            )}
          </DragOverlay>
        </DndContext>
      )}

      {view === 'list' && (
        <ListView tasks={tasks} onToggleStatus={handleToggleStatus} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {view === 'calendar' && <CalendarView tasks={tasks} onEdit={handleEdit} />}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TasksTab;
