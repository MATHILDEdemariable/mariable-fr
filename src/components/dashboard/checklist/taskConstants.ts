import type { TaskStatus } from '@/hooks/useChecklistTasks';

export const TASK_CATEGORY_KEYS = [
  'invites',
  'budget',
  'lieu',
  'traiteur',
  'image',
  'decorations',
  'jour-j',
  'tenues',
  'beaute',
  'autres',
] as const;

export const TASK_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'completed'];

export const STATUS_COLUMN_STYLES: Record<TaskStatus, { column: string; dot: string }> = {
  pending: { column: 'bg-muted/50 border-border', dot: 'bg-muted-foreground' },
  in_progress: { column: 'bg-secondary/40 border-secondary', dot: 'bg-blue-500' },
  completed: { column: 'bg-wedding-olive/10 border-wedding-olive/30', dot: 'bg-wedding-olive' },
};
