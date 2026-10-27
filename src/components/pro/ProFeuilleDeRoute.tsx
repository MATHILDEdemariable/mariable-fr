import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import type { Wedding } from '@/contexts/WeddingContext';

interface ProFeuilleDeRouteProps {
  weddings: Wedding[];
  onOpenWedding: (weddingId: string, targetPath?: string) => void;
}

interface MonthPriority { id: string; title: string; date: string; weddingId: string }

/**
 * Feuille de route multi-mariages : priorités du mois calculées depuis le « Planning & tâches »
 * de chaque mariage (étapes non terminées, en retard ou datées ce mois-ci).
 */
const ProFeuilleDeRoute: React.FC<ProFeuilleDeRouteProps> = ({ weddings, onOpenWedding }) => {
  const { i18n } = useTranslation('pro');
  const isEnglish = i18n.language?.startsWith('en');
  const [monthPriorities, setMonthPriorities] = useState<MonthPriority[]>([]);
  const [loading, setLoading] = useState(true);
  const weddingIds = weddings.map((wedding) => wedding.id).join(',');

  useEffect(() => {
    const loadPriorities = async () => {
      if (!weddingIds) { setMonthPriorities([]); setLoading(false); return; }
      try {
        const { data, error } = await (supabase as any)
          .from('wedding_retroplanning')
          .select('wedding_id, timeline_data')
          .in('wedding_id', weddingIds.split(','))
          .eq('mode', 'manual');
        if (error) throw error;
        const monthEnd = new Date();
        monthEnd.setMonth(monthEnd.getMonth() + 1, 0);
        const monthEndKey = monthEnd.toISOString().slice(0, 10);
        const priorities = ((data ?? []) as { wedding_id: string; timeline_data: any }[]).flatMap((row) =>
          (Array.isArray(row.timeline_data) ? row.timeline_data : [])
            .filter((step: any) => step?.status !== 'completed' && typeof step?.date === 'string' && step.date && step.date <= monthEndKey)
            .map((step: any) => ({ id: `${row.wedding_id}-${step.id}`, title: step.title, date: step.date, weddingId: row.wedding_id }))
        ).sort((a, b) => a.date.localeCompare(b.date));
        setMonthPriorities(priorities);
      } catch (error) {
        console.error('❌ ProFeuilleDeRoute: priorités illisibles', error);
      } finally {
        setLoading(false);
      }
    };
    loadPriorities();
  }, [weddingIds]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const weddingTitleById = new Map(weddings.map((wedding) => [wedding.id, wedding.title]));

  return (
    <section aria-labelledby="pro-roadmap-title" className="space-y-3">
      <div>
        <h2 id="pro-roadmap-title" className="font-serif text-2xl font-bold">
          {isEnglish ? 'My priorities this month' : 'Mes priorités du mois'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isEnglish ? 'Unfinished tasks from each wedding’s Planning & tasks (overdue or due this month).' : 'Tâches non terminées du Planning & tâches de chaque mariage (en retard ou prévues ce mois-ci).'}
        </p>
      </div>
      <div className="border border-primary/40 bg-primary/5 p-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">…</p>
        ) : monthPriorities.length === 0 ? (
          <p className="text-sm text-muted-foreground">{isEnglish ? 'Nothing here 🎉' : 'Rien à signaler 🎉'}</p>
        ) : (
          <ul className="divide-y divide-border">
            {monthPriorities.slice(0, 12).map((priority) => (
              <li key={priority.id} className="flex flex-col sm:flex-row sm:items-center gap-2 py-2">
                <div className="flex-1 text-sm">
                  <span className="block font-medium">{priority.title}</span>
                  <span className={`block text-xs ${priority.date < todayKey ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {weddingTitleById.get(priority.weddingId) ?? ''} · {new Date(`${priority.date}T12:00:00`).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR')}
                    {priority.date < todayKey ? (isEnglish ? ' · overdue' : ' · en retard') : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenWedding(priority.weddingId, '/dashboard/mon-mariage/retroplanning')}
                  className="min-h-[44px] px-4 text-xs uppercase tracking-wider border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {isEnglish ? 'Open planning' : 'Ouvrir le planning'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ProFeuilleDeRoute;
