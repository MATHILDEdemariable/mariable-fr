import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, Clock, MapPin, Loader2, ExternalLink } from 'lucide-react';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ConducteurTask {
  id: string;
  title: string;
  description: string | null;
  start_time: string | null;
  duration: number | null;
  event_day: string | null;
  position: number;
  status: string;
  assigned_to: string[] | null;
}

interface TeamOption { id: string; name: string }

const db = supabase as any;
const DAY_PRIORITY: Record<string, number> = { 'J-1': 0, 'Jour J': 1, 'J+1': 2 };

const formatTaskTime = (value: string | null, locale: string) => {
  if (!value) return null;
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
};

/** Vue « Conducteur » : même déroulé que la consultation, avec une coche « fait » synchronisée en direct. */
const MonJourMConducteur: React.FC = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const locale = isEnglish ? 'en-GB' : 'fr-FR';
  const { coordination } = useMonJourMCoordination();
  const [tasks, setTasks] = useState<ConducteurTask[]>([]);
  const [team, setTeam] = useState<TeamOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Jour J');

  const loadConducteur = async (coordinationId: string) => {
    try {
      const [{ data: taskRows, error: taskError }, { data: teamRows }] = await Promise.all([
        db.from('coordination_planning')
          .select('id, title, description, start_time, duration, event_day, position, status, assigned_to')
          .eq('coordination_id', coordinationId)
          .eq('category', 'jour-m')
          .order('position'),
        db.from('coordination_team').select('id, name').eq('coordination_id', coordinationId),
      ]);
      if (taskError) throw taskError;
      setTasks(taskRows || []);
      setTeam(teamRows || []);
    } catch (error) {
      console.error('❌ loadConducteur failed:', error);
      toast.error(tr('Impossible de charger le conducteur', 'Could not load the run sheet'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!coordination?.id) return;
    loadConducteur(coordination.id);
    const channel = supabase
      .channel(`conducteur-${coordination.id}-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'coordination_planning', filter: `coordination_id=eq.${coordination.id}` }, () => loadConducteur(coordination.id))
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordination?.id]);

  const availableDays = useMemo(() => {
    const days = Array.from(new Set(tasks.map((task) => task.event_day || 'Jour J')));
    return days.sort((a, b) => (DAY_PRIORITY[a] ?? 99) - (DAY_PRIORITY[b] ?? 99) || a.localeCompare(b));
  }, [tasks]);

  useEffect(() => {
    if (availableDays.length > 0 && !availableDays.includes(selectedDay)) {
      setSelectedDay(availableDays.includes('Jour J') ? 'Jour J' : availableDays[0]);
    }
  }, [availableDays, selectedDay]);

  const visibleTasks = tasks.filter((task) => (task.event_day || 'Jour J') === selectedDay);
  const completedCount = visibleTasks.filter((task) => task.status === 'completed').length;

  const toggleTaskStatus = async (task: ConducteurTask) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    setTasks((previous) => previous.map((entry) => (entry.id === task.id ? { ...entry, status: nextStatus } : entry)));
    const { error } = await db
      .from('coordination_planning')
      .update({ status: nextStatus, completed_at: nextStatus === 'completed' ? new Date().toISOString() : null })
      .eq('id', task.id);
    if (error) {
      console.error('❌ toggleTaskStatus failed:', error);
      toast.error(tr('Mise à jour impossible', 'Could not update'));
      setTasks((previous) => previous.map((entry) => (entry.id === task.id ? { ...entry, status: task.status } : entry)));
    }
  };

  const teamNames = (ids: string[] | null) =>
    (ids || []).map((id) => team.find((member) => member.id === id)?.name).filter(Boolean).join(', ');

  return (
    <>
      <Helmet>
        <title>{tr('Conducteur Jour J | Mariable', 'Wedding day run sheet | Mariable')}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <MonJourMLayout coordinationId={coordination?.id}>
        <section className="max-w-3xl mx-auto space-y-4">
          <header className="bg-editorial-beige border border-border p-4 sm:p-5 space-y-2">
            <h2 className="font-serif text-2xl">{tr('Conducteur en direct', 'Live run sheet')}</h2>
            <p className="text-sm text-muted-foreground">
              {tr('Cochez chaque étape réalisée : le planning partagé en consultation se met à jour instantanément pour les mariés et les prestataires.',
                'Tick each completed step: the shared view-only schedule updates instantly for the couple and vendors.')}
            </p>
            {coordination?.id && (
              <a href={`/planning-public/${coordination.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-wedding-olive hover:underline">
                <ExternalLink className="h-4 w-4" /> {tr('Ouvrir la vue consultation', 'Open the shared view')}
              </a>
            )}
          </header>

          {availableDays.length > 1 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label={tr('Jour', 'Day')}>
              {availableDays.map((day) => (
                <button key={day} type="button" onClick={() => setSelectedDay(day)} aria-pressed={selectedDay === day}
                  className={`min-h-[44px] px-4 text-sm border ${selectedDay === day ? 'bg-wedding-olive text-white border-wedding-olive' : 'border-wedding-olive/40 text-wedding-olive hover:bg-wedding-olive/10'}`}>
                  {day}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-wedding-olive" /></div>
          ) : visibleTasks.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">{tr('Aucune étape dans le planning pour le moment.', 'No steps in the schedule yet.')}</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground" aria-live="polite">{completedCount} / {visibleTasks.length} {tr('étapes réalisées', 'steps done')}</p>
              <ol className="space-y-2">
                {visibleTasks.map((task) => {
                  const isDone = task.status === 'completed';
                  const time = formatTaskTime(task.start_time, locale);
                  const assignees = teamNames(task.assigned_to);
                  return (
                    <li key={task.id}>
                      <button type="button" onClick={() => toggleTaskStatus(task)} aria-pressed={isDone}
                        className={`w-full text-left flex items-start gap-3 border p-4 min-h-[64px] transition-colors ${isDone ? 'bg-muted/60 border-border' : 'bg-background border-wedding-olive/25 hover:border-wedding-olive'}`}>
                        {isDone ? <CheckCircle2 className="h-6 w-6 shrink-0 text-wedding-olive" /> : <Circle className="h-6 w-6 shrink-0 text-muted-foreground" />}
                        <span className="flex-1 min-w-0">
                          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            {time && <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{time}</span>}
                            {task.duration ? <span>{task.duration} min</span> : null}
                          </span>
                          <span className={`block font-medium ${isDone ? 'line-through text-muted-foreground' : ''}`}>{task.title}</span>
                          {task.description && <span className="block text-sm text-muted-foreground line-clamp-2">{task.description}</span>}
                          {assignees && <span className="mt-1 inline-flex items-center gap-1 text-xs text-wedding-olive"><MapPin className="h-3 w-3" />{assignees}</span>}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </section>
      </MonJourMLayout>
    </>
  );
};

export default MonJourMConducteur;
