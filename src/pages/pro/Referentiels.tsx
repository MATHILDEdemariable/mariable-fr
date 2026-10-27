import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PriceCatalogTab from '@/components/dashboard/catalog/PriceCatalogTab';
import { STAKEHOLDER_LABELS } from '@/components/retroplanning/RetroplanningManuel';
import { RETROPLANNING_CATALOG_PERIODS } from '@/data/retroplanningTaskCatalog';

export interface ProTaskTemplate {
  id: string;
  title: string;
  category: string;
  stakeholder: string;
  months_before: number;
}

// Table récente : types générés pas encore à jour
const taskTemplatesTable = () => (supabase as any).from('pro_task_templates');

export const fetchProTaskTemplates = async (): Promise<ProTaskTemplate[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await taskTemplatesTable()
    .select('id, title, category, stakeholder, months_before')
    .eq('owner_id', user.id)
    .order('months_before', { ascending: false });
  if (error) { console.error('❌ fetchProTaskTemplates failed:', error); return []; }
  return (data ?? []).map((row: any) => ({ ...row, months_before: Number(row.months_before) }));
};

const emptyTaskForm = { title: '', category: 'Organisation', stakeholder: 'planner', months_before: '1' };

const Referentiels: React.FC = () => {
  const { i18n } = useTranslation('pro');
  const isEnglish = i18n.language?.startsWith('en');
  const { toast } = useToast();
  const [tasks, setTasks] = useState<ProTaskTemplate[]>([]);
  const [form, setForm] = useState(emptyTaskForm);
  const [noteText, setNoteText] = useState('');
  const [isImportingNote, setIsImportingNote] = useState(false);

  useEffect(() => { fetchProTaskTemplates().then(setTasks); }, []);

  const handleAddTask = async () => {
    if (!form.title.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await taskTemplatesTable().insert({
      owner_id: user.id,
      title: form.title.trim(),
      category: form.category.trim() || 'Organisation',
      stakeholder: form.stakeholder,
      months_before: Number(form.months_before),
    });
    if (error) {
      console.error('❌ add task template failed:', error);
      toast({ title: isEnglish ? 'Could not add the task' : 'Impossible d’ajouter la tâche', variant: 'destructive' });
      return;
    }
    setForm(emptyTaskForm);
    setTasks(await fetchProTaskTemplates());
  };

  // Une ligne de la note = une tâche (puces et numéros retirés), avec le responsable et la période choisis ci-dessus
  const handleImportNote = async () => {
    const titles = noteText
      .split('\n')
      .map((line) => line.replace(/^\s*([-*•–]|\d+[.)]|\[[ xX]?\])\s*/, '').trim())
      .filter((line) => line.length > 1);
    if (titles.length === 0) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setIsImportingNote(true);
    const { error } = await taskTemplatesTable().insert(titles.map((title) => ({
      owner_id: user.id,
      title: title.slice(0, 200),
      category: form.category.trim() || 'Organisation',
      stakeholder: form.stakeholder,
      months_before: Number(form.months_before),
    })));
    setIsImportingNote(false);
    if (error) {
      console.error('❌ import note tasks failed:', error);
      toast({ title: isEnglish ? 'Import failed' : 'Import impossible', variant: 'destructive' });
      return;
    }
    toast({ title: isEnglish ? `${titles.length} task(s) added` : `${titles.length} tâche(s) ajoutée(s)` });
    setNoteText('');
    setTasks(await fetchProTaskTemplates());
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await taskTemplatesTable().delete().eq('id', taskId);
    if (error) { console.error('❌ delete task template failed:', error); return; }
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  const periodText = (monthsBefore: number) => {
    const period = RETROPLANNING_CATALOG_PERIODS.find((item) => item.monthsBefore === monthsBefore);
    return period ? (isEnglish ? period.en : period.fr) : `${monthsBefore}`;
  };

  return (
    <DashboardLayout variant="pro">
      <Helmet>
        <title>{isEnglish ? 'Templates & catalogues' : 'Modèles & catalogues'} | Mariable Pro</title>
      </Helmet>
      <section className="space-y-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">{isEnglish ? 'Templates & catalogues' : 'Modèles & catalogues'}</h1>
          <p className="text-sm text-muted-foreground">
            {isEnglish
              ? 'Your in-house references, reusable in every wedding: your tasks are added in each wedding with the “My usual tasks” button, your prices are available in each Budget.'
              : 'Vos référentiels internes, réutilisables dans chaque mariage : vos tâches s’ajoutent dans chaque mariage avec le bouton « Mes tâches habituelles », vos prix sont disponibles dans chaque Budget.'}
          </p>
        </div>
        <Tabs defaultValue="tasks">
          <TabsList className="rounded-none">
            <TabsTrigger value="tasks" className="rounded-none">{isEnglish ? 'Task catalogue' : 'Catalogue de tâches'}</TabsTrigger>
            <TabsTrigger value="prices" className="rounded-none">{isEnglish ? 'Price catalogue' : 'Catalogue de prix'}</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <div className="border border-border bg-background p-4 grid gap-2 md:grid-cols-[2fr_1fr_1fr_1fr_auto] items-end">
              <Input placeholder={isEnglish ? 'Task title' : 'Intitulé de la tâche'} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              <Input placeholder={isEnglish ? 'Category' : 'Catégorie'} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
              <select aria-label={isEnglish ? 'Assigned to' : 'Responsable'} className="h-10 border border-input bg-background px-2 text-sm" value={form.stakeholder} onChange={(event) => setForm({ ...form, stakeholder: event.target.value })}>
                {Object.entries(STAKEHOLDER_LABELS).map(([key, label]) => <option key={key} value={key}>{isEnglish ? label.en : label.fr}</option>)}
              </select>
              <select aria-label={isEnglish ? 'When' : 'Quand'} className="h-10 border border-input bg-background px-2 text-sm" value={form.months_before} onChange={(event) => setForm({ ...form, months_before: event.target.value })}>
                {RETROPLANNING_CATALOG_PERIODS.map((period) => <option key={period.monthsBefore} value={String(period.monthsBefore)}>{isEnglish ? period.en : period.fr}</option>)}
              </select>
              <Button onClick={handleAddTask} className="rounded-none"><Plus className="h-4 w-4 mr-1" />{isEnglish ? 'Add' : 'Ajouter'}</Button>
            </div>
            <details className="border border-border bg-background p-4">
              <summary className="cursor-pointer text-sm font-medium text-wedding-olive">
                {isEnglish ? 'Import from a text note' : 'Importer depuis une note texte'}
              </summary>
              <div className="space-y-2 pt-3">
                <p className="text-xs text-muted-foreground">
                  {isEnglish
                    ? 'Paste your list: one line = one task. The category, person in charge and timing selected above are applied to all of them; you can adjust each task later in the wedding.'
                    : 'Collez votre liste : une ligne = une tâche. La catégorie, le responsable et la période choisis ci-dessus s’appliquent à toutes ; vous ajusterez chaque tâche ensuite dans le mariage.'}
                </p>
                <Textarea rows={6} className="rounded-none" placeholder={isEnglish ? '- Book the venue\n- Send save-the-dates\n- Taste the menu' : '- Réserver le lieu\n- Envoyer les save-the-date\n- Dégustation traiteur'} value={noteText} onChange={(event) => setNoteText(event.target.value)} />
                <Button variant="outline" className="rounded-none" onClick={handleImportNote} disabled={isImportingNote || !noteText.trim()}>
                  <Plus className="h-4 w-4 mr-1" />{isEnglish ? 'Create the tasks' : 'Créer les tâches'}
                </Button>
              </div>
            </details>
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {isEnglish ? 'No task yet. Add your usual method: it will be loaded with the standard template in each wedding.' : 'Aucune tâche pour l’instant. Ajoutez votre méthodologie habituelle : elle sera chargée avec la trame standard dans chaque mariage.'}
              </p>
            ) : (
              <ul className="divide-y divide-border border border-border bg-background">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center gap-3 p-3 text-sm">
                    <div className="flex-1">
                      <span className="block font-medium">{task.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {periodText(task.months_before)} · {task.category} · {isEnglish ? STAKEHOLDER_LABELS[task.stakeholder]?.en : STAKEHOLDER_LABELS[task.stakeholder]?.fr}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" aria-label={isEnglish ? 'Delete' : 'Supprimer'} onClick={() => handleDeleteTask(task.id)}><Trash2 className="h-4 w-4" /></Button>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="prices">
            <PriceCatalogTab guestsCount={100} />
          </TabsContent>
        </Tabs>
      </section>
    </DashboardLayout>
  );
};

export default Referentiels;
