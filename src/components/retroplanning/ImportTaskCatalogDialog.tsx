import { useEffect, useMemo, useState } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { RETROPLANNING_CATALOG_PERIODS, RETROPLANNING_TASK_CATALOG } from '@/data/retroplanningTaskCatalog';

export interface CatalogStepDraft {
  title: string;
  date: string;
  period: string;
  category: string;
  stakeholder: string;
}

interface ImportTaskCatalogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weddingDate: string;
  isEnglish: boolean;
  onImport: (drafts: CatalogStepDraft[]) => void;
}

interface CatalogRow { id: string; monthsBefore: number; title: string; category: string; stakeholder: string; source: 'catalog' | 'ai' }

// Date estimée à partir de la date du mariage (0.5 = 2 semaines, 0.25 = 1 semaine)
const computeStepDate = (weddingDate: string, monthsBefore: number) => {
  if (!weddingDate) return '';
  const wedding = new Date(`${weddingDate}T12:00:00`);
  if (isNaN(wedding.getTime())) return '';
  const date = monthsBefore >= 1 ? subMonths(wedding, Math.round(monthsBefore)) : subDays(wedding, Math.round(monthsBefore * 30));
  return format(date, 'yyyy-MM-dd');
};

const periodLabel = (monthsBefore: number, isEnglish: boolean) => {
  if (monthsBefore >= 1) return isEnglish ? `${Math.round(monthsBefore)} months before` : `J-${Math.round(monthsBefore)} mois`;
  const weeks = Math.max(1, Math.round(monthsBefore * 4));
  return isEnglish ? `${weeks} week${weeks > 1 ? 's' : ''} before` : `J-${weeks} semaine${weeks > 1 ? 's' : ''}`;
};

const ImportTaskCatalogDialog = ({ open, onOpenChange, weddingDate, isEnglish, onImport }: ImportTaskCatalogDialogProps) => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [aiRows, setAiRows] = useState<CatalogRow[]>([]);

  // Charge les tâches du rétroplanning IA existant pour les proposer aussi
  useEffect(() => {
    if (!open) return;
    const loadAiTasks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await (supabase as any).from('wedding_retroplanning').select('timeline_data')
          .eq('user_id', user.id).eq('mode', 'ai').order('updated_at', { ascending: false }).limit(1).maybeSingle();
        const timeline = Array.isArray(data?.timeline_data) ? data.timeline_data : [];
        const rows: CatalogRow[] = [];
        timeline.forEach((period: any, periodIndex: number) => {
          (Array.isArray(period?.tasks) ? period.tasks : []).forEach((rawTask: any, taskIndex: number) => {
            const title = typeof rawTask === 'string' ? rawTask : String(rawTask?.name ?? rawTask?.title ?? '');
            if (title.trim()) rows.push({ id: `ai-${periodIndex}-${taskIndex}`, monthsBefore: Number(period?.monthsBefore) || 0, title: title.slice(0, 200), category: '', stakeholder: '', source: 'ai' });
          });
        });
        setAiRows(rows);
      } catch (error) {
        console.error('❌ loadAiTasks failed:', error);
      }
    };
    loadAiTasks();
  }, [open]);

  const allRows = useMemo<CatalogRow[]>(() => [
    ...RETROPLANNING_TASK_CATALOG.map((item) => ({ id: item.id, monthsBefore: item.monthsBefore, title: isEnglish ? item.en : item.fr, category: item.category, stakeholder: item.stakeholder, source: 'catalog' as const })),
    ...aiRows,
  ], [aiRows, isEnglish]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? allRows.filter((row) => row.title.toLowerCase().includes(query)) : allRows;
  }, [allRows, search]);

  const groups = useMemo(() => {
    const catalog = RETROPLANNING_CATALOG_PERIODS.map((period) => ({
      key: `p-${period.monthsBefore}`, label: isEnglish ? period.en : period.fr,
      rows: filteredRows.filter((row) => row.source === 'catalog' && row.monthsBefore === period.monthsBefore),
    }));
    const ai = { key: 'ai', label: isEnglish ? 'From my AI timeline' : 'Depuis mon rétroplanning IA', rows: filteredRows.filter((row) => row.source === 'ai') };
    return [...catalog, ai].filter((group) => group.rows.length > 0);
  }, [filteredRows, isEnglish]);

  const toggleIds = (ids: string[], checked: boolean) => setSelectedIds((prev) => {
    const next = new Set(prev);
    ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
    return next;
  });

  const handleImport = () => {
    const drafts = allRows.filter((row) => selectedIds.has(row.id)).map((row) => ({
      title: row.title, date: computeStepDate(weddingDate, row.monthsBefore), period: periodLabel(row.monthsBefore, isEnglish),
      category: row.category, stakeholder: row.stakeholder,
    }));
    if (!drafts.length) return;
    onImport(drafts);
    setSelectedIds(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col rounded-none">
        <DialogHeader><DialogTitle className="font-serif">{isEnglish ? 'Task catalogue' : 'Catalogue de tâches'}</DialogTitle></DialogHeader>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={isEnglish ? 'Search a task' : 'Rechercher une tâche'} aria-label={isEnglish ? 'Search' : 'Rechercher'} />
        {!weddingDate && <p className="text-xs text-muted-foreground">{isEnglish ? 'Set the wedding date to get dates automatically.' : 'Renseignez la date du mariage pour obtenir les dates automatiquement.'}</p>}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {groups.map((group) => {
            const ids = group.rows.map((row) => row.id);
            const allChecked = ids.every((id) => selectedIds.has(id));
            return (
              <section key={group.key}>
                <div className="flex items-center justify-between border-b border-border pb-1 mb-2">
                  <h3 className="font-serif text-base">{group.label}</h3>
                  <Button variant="ghost" size="sm" onClick={() => toggleIds(ids, !allChecked)}>
                    {allChecked ? (isEnglish ? 'Unselect all' : 'Tout décocher') : (isEnglish ? 'Select all' : 'Tout cocher')}
                  </Button>
                </div>
                {group.rows.map((row) => (
                  <label key={row.id} className="flex items-center gap-3 py-2 min-h-[44px] cursor-pointer">
                    <Checkbox checked={selectedIds.has(row.id)} onCheckedChange={(checked) => toggleIds([row.id], !!checked)} />
                    <span className="text-sm flex-1">{row.title}</span>
                    {row.category && <span className="text-xs text-muted-foreground">{row.category}</span>}
                  </label>
                ))}
              </section>
            );
          })}
        </div>
        <DialogFooter>
          <Button onClick={handleImport} disabled={selectedIds.size === 0}>
            {isEnglish ? `Add ${selectedIds.size} task(s)` : `Ajouter ${selectedIds.size} tâche(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTaskCatalogDialog;
