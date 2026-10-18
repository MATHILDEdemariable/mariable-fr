import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import type { Wedding } from '@/contexts/WeddingContext';

interface RoadmapTask {
  id: string;
  title: string;
  due_date: string | null;
  priority: string;
  wedding_id: string | null;
}

type Quadrant = 'urgentImportant' | 'important' | 'urgent';

interface ProFeuilleDeRouteProps {
  weddings: Wedding[];
  onOpenWedding: (weddingId: string, targetPath?: string) => void;
}

/**
 * Feuille de route multi-mariages calculée automatiquement depuis la checklist
 * de chaque mariage (échéance + priorité). Aucune saisie supplémentaire.
 */
export const classifyRoadmapTask = (task: RoadmapTask, today: Date): Quadrant | null => {
  const isHighPriority = task.priority === 'haute' || task.priority === 'high';
  if (!task.due_date) return isHighPriority ? 'important' : null;
  const daysLeft = Math.ceil((new Date(task.due_date).getTime() - today.getTime()) / 86400000);
  const isUrgent = daysLeft <= 7;
  if (isUrgent && (isHighPriority || daysLeft < 0)) return 'urgentImportant';
  if (isUrgent) return 'urgent';
  if (isHighPriority) return 'important';
  return null;
};

const ProFeuilleDeRoute: React.FC<ProFeuilleDeRouteProps> = ({ weddings, onOpenWedding }) => {
  const { i18n } = useTranslation('pro');
  const isEnglish = i18n.language?.startsWith('en');
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>([]);
  const [loading, setLoading] = useState(true);
  const weddingIds = weddings.map((wedding) => wedding.id).join(',');

  useEffect(() => {
    const loadRoadmapTasks = async () => {
      if (!weddingIds) { setRoadmapTasks([]); setLoading(false); return; }
      try {
        const { data, error } = await supabase
          .from('checklist_mariage_manuel')
          .select('id, title, due_date, priority, wedding_id')
          .in('wedding_id', weddingIds.split(','))
          .eq('completed', false)
          .order('due_date', { ascending: true, nullsFirst: false })
          .limit(200);
        if (error) throw error;
        setRoadmapTasks((data ?? []) as RoadmapTask[]);
      } catch (error) {
        console.error('❌ ProFeuilleDeRoute: tâches illisibles', error);
      } finally {
        setLoading(false);
      }
    };
    loadRoadmapTasks();
  }, [weddingIds]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weddingTitleById = new Map(weddings.map((wedding) => [wedding.id, wedding.title]));
  const grouped: Record<Quadrant, RoadmapTask[]> = { urgentImportant: [], important: [], urgent: [] };
  roadmapTasks.forEach((task) => {
    const quadrant = classifyRoadmapTask(task, today);
    if (quadrant) grouped[quadrant].push(task);
  });

  const columns: { key: Quadrant; label: string; hint: string }[] = [
    { key: 'urgentImportant', label: isEnglish ? 'Urgent & important' : 'Urgent & important', hint: isEnglish ? 'Overdue or due within 7 days' : 'En retard ou sous 7 jours' },
    { key: 'important', label: isEnglish ? 'Important, not urgent' : 'Important, pas urgent', hint: isEnglish ? 'High priority, to plan' : 'Priorité haute, à planifier' },
    { key: 'urgent', label: isEnglish ? 'To follow up' : 'À relancer', hint: isEnglish ? 'Due soon, normal priority' : 'Échéance proche, priorité normale' },
  ];

  return (
    <section aria-labelledby="pro-roadmap-title" className="space-y-3">
      <div>
        <h2 id="pro-roadmap-title" className="font-serif text-2xl font-bold">
          {isEnglish ? 'My roadmap' : 'Ma feuille de route'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isEnglish ? 'Built automatically from each wedding’s checklist (due dates and priorities).' : 'Calculée automatiquement depuis la checklist de chaque mariage (échéances et priorités).'}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {columns.map((column) => (
          <div key={column.key} className="border border-border bg-background p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-wedding-olive">{column.label}</p>
            <p className="text-xs text-muted-foreground mb-3">{column.hint}</p>
            {loading ? (
              <p className="text-sm text-muted-foreground">…</p>
            ) : grouped[column.key].length === 0 ? (
              <p className="text-sm text-muted-foreground">{isEnglish ? 'Nothing here 🎉' : 'Rien à signaler 🎉'}</p>
            ) : (
              <ul className="space-y-2">
                {grouped[column.key].slice(0, 6).map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => task.wedding_id && onOpenWedding(task.wedding_id, '/dashboard/checklist-mariage?tab=pro')}
                      className="w-full min-h-[44px] text-left text-sm hover:text-wedding-olive"
                    >
                      <span className="block font-medium">{task.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {weddingTitleById.get(task.wedding_id ?? '') ?? ''}
                        {task.due_date ? ` · ${new Date(task.due_date).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR')}` : ''}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProFeuilleDeRoute;
