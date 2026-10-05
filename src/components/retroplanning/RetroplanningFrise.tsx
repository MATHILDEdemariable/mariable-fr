import { useMemo } from 'react';
import { differenceInCalendarDays, format, isSameMonth } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Check, Heart } from 'lucide-react';
import type { ManualStep } from './RetroplanningManuel';

interface RetroplanningFriseProps {
  steps: ManualStep[];
  weddingDate: string | null;
  isEnglish: boolean;
}

// Résumé : compte à rebours, progression, priorités du mois
export const RetroplanningSummary = ({ steps, weddingDate, isEnglish }: RetroplanningFriseProps) => {
  const completedCount = steps.filter((step) => step.status === 'completed').length;
  const progressPercent = steps.length ? Math.round((completedCount / steps.length) * 100) : 0;
  const daysLeft = weddingDate ? differenceInCalendarDays(new Date(weddingDate), new Date()) : null;
  const currentPriorities = steps.filter(
    (step) => step.status !== 'completed' && step.date && isSameMonth(new Date(step.date), new Date())
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border p-4 bg-card">
          <p className="text-sm text-muted-foreground">{isEnglish ? 'Countdown' : 'Compte à rebours'}</p>
          <p className="text-2xl font-serif">
            {daysLeft === null ? '—' : daysLeft > 0 ? `J-${daysLeft}` : daysLeft === 0 ? (isEnglish ? 'D-Day' : 'Jour J') : (isEnglish ? 'Done' : 'Passé')}
          </p>
        </div>
        <div className="border border-border p-4 bg-card">
          <p className="text-sm text-muted-foreground">{isEnglish ? 'Progress' : 'Avancement'}</p>
          <p className="text-2xl font-serif">{progressPercent}% <span className="text-sm text-muted-foreground">({completedCount}/{steps.length})</span></p>
          <div className="h-1.5 bg-muted mt-2"><div className="h-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} /></div>
        </div>
      </div>
      {currentPriorities.length > 0 && (
        <div className="border border-primary/40 bg-primary/5 p-4">
          <p className="font-serif text-lg mb-2">{isEnglish ? 'Priorities this month' : 'Priorités du moment'}</p>
          <ul className="space-y-1 text-sm">
            {currentPriorities.map((step) => <li key={step.id}>• {step.title}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

// Frise chronologique verticale, groupée par mois, terminée par le Jour J
const RetroplanningFrise = ({ steps, weddingDate, isEnglish }: RetroplanningFriseProps) => {
  const dateLocale = isEnglish ? enUS : fr;

  const groups = useMemo(() => {
    const sorted = [...steps].sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
    const map = new Map<string, ManualStep[]>();
    sorted.forEach((step) => {
      const key = step.date ? format(new Date(step.date), 'MMMM yyyy', { locale: dateLocale }) : (isEnglish ? 'No date' : 'Sans date');
      map.set(key, [...(map.get(key) ?? []), step]);
    });
    return Array.from(map.entries());
  }, [steps, dateLocale, isEnglish]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <ol className="relative border-l-2 border-border ml-3 space-y-8">
      {groups.map(([month, monthSteps]) => (
        <li key={month} className="pl-6">
          <span className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full bg-background border-2 border-primary" aria-hidden />
          <h3 className="font-serif text-lg capitalize mb-3">{month}</h3>
          <div className="space-y-2">
            {monthSteps.map((step) => {
              const isDone = step.status === 'completed';
              const isLate = !isDone && step.date && step.date < today;
              const daysBefore = weddingDate && step.date ? differenceInCalendarDays(new Date(weddingDate), new Date(step.date)) : null;
              return (
                <div key={step.id} className={`border p-3 bg-card ${isLate ? 'border-destructive/60' : 'border-border'} ${isDone ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-2">
                    {isDone && <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${isDone ? 'line-through' : ''}`}>{step.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {[
                          step.date && format(new Date(step.date), 'dd MMM', { locale: dateLocale }),
                          step.period || (daysBefore !== null && daysBefore >= 0 ? `J-${daysBefore}` : ''),
                          step.category,
                          isLate ? (isEnglish ? 'Late' : 'En retard') : '',
                        ].filter(Boolean).join(' · ')}
                      </p>
                      {step.note && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{step.note}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </li>
      ))}
      {weddingDate && (
        <li className="pl-6">
          <span className="absolute -left-[13px] mt-0.5 h-6 w-6 rounded-full bg-primary flex items-center justify-center" aria-hidden>
            <Heart className="h-3 w-3 text-primary-foreground" />
          </span>
          <h3 className="font-serif text-xl">{isEnglish ? 'Wedding day' : 'Jour J'}</h3>
          <p className="text-sm text-muted-foreground">{format(new Date(weddingDate), 'EEEE dd MMMM yyyy', { locale: dateLocale })}</p>
        </li>
      )}
    </ol>
  );
};

export default RetroplanningFrise;
