import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TASK_CATEGORY_KEYS, TASK_STATUSES } from './taskConstants';
import type { ChecklistTask, ChecklistTaskInput, TaskPriority, TaskStatus } from '@/hooks/useChecklistTasks';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: ChecklistTask | null;
  onSubmit: (values: ChecklistTaskInput) => void;
}

const emptyForm: ChecklistTaskInput = {
  title: '',
  description: '',
  category: 'autres',
  status: 'pending',
  priority: 'medium',
  due_date: '',
  responsible: '',
};

const TaskDialog: React.FC<TaskDialogProps> = ({ open, onOpenChange, task, onSubmit }) => {
  const { t } = useTranslation('checklist');
  const [form, setForm] = useState<ChecklistTaskInput>(emptyForm);

  useEffect(() => {
    if (!open) return;
    setForm(
      task
        ? {
            title: task.title,
            description: task.description || '',
            category: task.category,
            status: task.status,
            priority: task.priority,
            due_date: task.due_date || '',
            responsible: task.responsible || '',
          }
        : emptyForm
    );
  }, [open, task]);

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? t('tasks.dialog.editTitle') : t('tasks.dialog.addTitle')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="task-title">{t('tasks.fields.title')}</Label>
            <Input
              id="task-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={t('tasks.fields.titlePlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor="task-description">{t('tasks.fields.description')}</Label>
            <Textarea
              id="task-description"
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>{t('tasks.fields.category')}</Label>
              <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TASK_CATEGORY_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>{t(`tasks.categories.${key}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('tasks.fields.status')}</Label>
              <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as TaskStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>{t(`tasks.status.${status}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('tasks.fields.priority')}</Label>
              <Select value={form.priority} onValueChange={(value) => setForm({ ...form, priority: value as TaskPriority })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['low', 'medium', 'high'] as TaskPriority[]).map((priority) => (
                    <SelectItem key={priority} value={priority}>{t(`tasks.priority.${priority}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="task-due">{t('tasks.fields.dueDate')}</Label>
              <Input
                id="task-due"
                type="date"
                value={form.due_date || ''}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="task-responsible">{t('tasks.fields.assignedTo')}</Label>
            <Input
              id="task-responsible"
              value={form.responsible || ''}
              onChange={(e) => setForm({ ...form, responsible: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('tasks.actions.cancel')}</Button>
          <Button onClick={handleSubmit} disabled={!form.title.trim()} className="bg-wedding-olive hover:bg-wedding-olive/90">
            {task ? t('tasks.actions.save') : t('tasks.actions.add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
