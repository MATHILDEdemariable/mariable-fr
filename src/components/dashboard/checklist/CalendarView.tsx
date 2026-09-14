import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { fr as frLocale, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChecklistTask } from '@/hooks/useChecklistTasks';

interface CalendarViewProps {
  tasks: ChecklistTask[];
  onEdit: (task: ChecklistTask) => void;
}

const statusColor: Record<ChecklistTask['status'], string> = {
  pending: 'bg-muted text-foreground',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-wedding-olive/20 text-wedding-olive',
};

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onEdit }) => {
  const { t, i18n } = useTranslation('checklist');
  const locale = i18n.language?.startsWith('en') ? enUS : frLocale;
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end: endOfWeek(start, { weekStartsOn: 1 }) });
  }, []);

  const tasksForDay = (day: Date) =>
    tasks.filter((task) => task.due_date && isSameDay(new Date(task.due_date), day));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} aria-label={t('tasks.calendar.previous')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-base font-semibold capitalize">{format(currentMonth, 'MMMM yyyy', { locale })}</h3>
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} aria-label={t('tasks.calendar.next')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="py-1 capitalize">
            {format(day, 'EEE', { locale })}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayTasks = tasksForDay(day);
          const isToday = isSameDay(day, new Date());
          return (
            <div
              key={day.toISOString()}
              className={`min-h-[80px] rounded-md border p-1 text-left ${
                isSameMonth(day, currentMonth) ? 'bg-card' : 'bg-muted/30 text-muted-foreground'
              } ${isToday ? 'ring-2 ring-wedding-olive' : ''}`}
            >
              <span className="text-xs font-medium">{format(day, 'd')}</span>
              <div className="mt-1 space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => onEdit(task)}
                    className={`block w-full truncate rounded px-1 py-0.5 text-left text-[10px] ${statusColor[task.status]}`}
                    title={task.title}
                  >
                    {task.title}
                  </button>
                ))}
                {dayTasks.length > 3 && (
                  <span className="block text-[10px] text-muted-foreground">+{dayTasks.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
