import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, isSameMonth, isToday } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Plus, Pencil, Trash2, Loader2, List as ListIcon, CalendarDays, Sparkles, GitCommitVertical, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useWeddingScope } from '@/hooks/useWeddingScope';
import RetroplanningShareButton from './RetroplanningShareButton';
import ImportTaskCatalogDialog, { type CatalogStepDraft } from './ImportTaskCatalogDialog';
import RetroplanningFrise, { RetroplanningSummary } from './RetroplanningFrise';

export type ManualStepStatus = 'pending' | 'in_progress' | 'completed';

export interface ManualStep {
  id: string;
  title: string;
  date: string; // yyyy-MM-dd, optionnel
  period: string; // ex. "J-6 mois"
  category: string;
  status: ManualStepStatus;
  note: string;
  stakeholder?: string;
}

export const STAKEHOLDER_LABELS: Record<string, { fr: string; en: string }> = {
  planner: { fr: 'Wedding planner', en: 'Wedding planner' },
  couple: { fr: 'Les mariés', en: 'The couple' },
  bride: { fr: 'La mariée', en: 'The bride' },
  groom: { fr: 'Le marié', en: 'The groom' },
  parents: { fr: 'Les parents', en: 'Parents' },
  witnesses: { fr: 'Les témoins', en: 'Witnesses' },
};

export const MANUAL_STATUS_LABELS: Record<ManualStepStatus, { fr: string; en: string; className: string }> = {
  pending: { fr: 'À faire', en: 'To do', className: 'bg-muted text-foreground' },
  in_progress: { fr: 'En cours', en: 'In progress', className: 'bg-secondary text-secondary-foreground' },
  completed: { fr: 'Terminé', en: 'Done', className: 'bg-primary text-primary-foreground' },
};

const EMPTY_STEP: ManualStep = { id: '', title: '', date: '', period: '', category: '', status: 'pending', note: '', stakeholder: '' };

export const sortManualSteps = (steps: ManualStep[]) =>
  [...steps].sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));

const RetroplanningManuel = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  const dateLocale = isEnglish ? enUS : fr;
  const { toast } = useToast();
  const { weddingId, scopeQuery, withWedding } = useWeddingScope();
  const [steps, setSteps] = useState<ManualStep[]>([]);
  const [retroplanningId, setRetroplanningId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'frise' | 'list' | 'calendar'>('list');
  const [editingStep, setEditingStep] = useState<ManualStep | null>(null);
  const [weddingDate, setWeddingDate] = useState('');
  const [inputMode, setInputMode] = useState<'quick' | 'notes'>('quick');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDate, setQuickDate] = useState('');
  const [quickStakeholder, setQuickStakeholder] = useState('');
  const [stakeholderFilter, setStakeholderFilter] = useState('all');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [noteText, setNoteText] = useState('');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const db = supabase as any;

  useEffect(() => {
    const loadManualRetroplanning = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await scopeQuery(
          db.from('wedding_retroplanning').select('id, timeline_data, wedding_date').eq('user_id', user.id).eq('mode', 'manual')
        ).order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (error) throw error;
        setRetroplanningId(data?.id ?? null);
        setWeddingDate(data?.wedding_date ?? '');
        setSteps(Array.isArray(data?.timeline_data) ? data.timeline_data : []);
      } catch (error) {
        console.error('❌ loadManualRetroplanning failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadManualRetroplanning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  const persistSteps = async (nextSteps: ManualStep[], nextWeddingDate: string = weddingDate) => {
    setSteps(nextSteps);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      if (retroplanningId) {
        const { error } = await db.from('wedding_retroplanning')
          .update({ timeline_data: nextSteps, ...(nextWeddingDate ? { wedding_date: nextWeddingDate } : {}), updated_at: new Date().toISOString() })
          .eq('id', retroplanningId);
        if (error) throw error;
      } else {
        const firstDate = nextWeddingDate || nextSteps.find((step) => step.date)?.date || new Date().toISOString().slice(0, 10);
        const { data, error } = await db.from('wedding_retroplanning')
          .insert([withWedding({
            user_id: user.id,
            mode: 'manual',
            title: isEnglish ? 'Manual timeline' : 'Rétroplanning manuel',
            wedding_date: firstDate,
            timeline_data: nextSteps,
            categories: [],
            milestones: [],
            progress: {},
            language: isEnglish ? 'en' : 'fr',
          })])
          .select('id')
          .single();
        if (error) throw error;
        setRetroplanningId(data.id);
      }
    } catch (error) {
      console.error('❌ persistSteps failed:', error);
      toast({ title: isEnglish ? 'Error' : 'Erreur', description: isEnglish ? 'Unable to save' : 'Impossible d\'enregistrer', variant: 'destructive' });
    }
  };

  const handleSaveStep = () => {
    if (!editingStep?.title.trim()) return;
    const stepToSave = { ...editingStep, title: editingStep.title.trim(), id: editingStep.id || uuidv4() };
    const exists = steps.some((step) => step.id === stepToSave.id);
    persistSteps(exists ? steps.map((step) => (step.id === stepToSave.id ? stepToSave : step)) : [...steps, stepToSave]);
    setEditingStep(null);
  };

  const handleDeleteStep = (stepId: string) => {
    if (!confirm(isEnglish ? 'Delete this step?' : 'Supprimer cette étape ?')) return;
    persistSteps(steps.filter((step) => step.id !== stepId));
  };

  const handleGenerateFromNote = async () => {
    if (noteText.trim().length < 3) return;
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-retroplanning-notes', {
        body: { noteText: noteText.trim(), weddingDate, language: isEnglish ? 'en' : 'fr' },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);
      const newSteps: ManualStep[] = (data.steps || []).map((step: Omit<ManualStep, 'id' | 'status'>) => ({ ...step, id: uuidv4(), status: 'pending' }));
      if (!newSteps.length) throw new Error(isEnglish ? 'No steps found' : 'Aucune étape trouvée');
      await persistSteps([...steps, ...newSteps]);
      toast({ title: isEnglish ? `${newSteps.length} steps added` : `${newSteps.length} étapes ajoutées` });
      setNoteText('');
      setView('frise');
    } catch (error) {
      console.error('❌ handleGenerateFromNote failed:', error);
      toast({ title: isEnglish ? 'Error' : 'Erreur', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const sortedSteps = useMemo(() => sortManualSteps(steps), [steps]);
  const counts = useMemo(() => ({
    pending: steps.filter((step) => step.status === 'pending').length,
    in_progress: steps.filter((step) => step.status === 'in_progress').length,
    completed: steps.filter((step) => step.status === 'completed').length,
  }), [steps]);

  // Ajout rapide : Entrée ajoute, un collage multi-lignes ajoute une étape par ligne
  const handleQuickAdd = () => {
    const titles = quickTitle.split('\n').map((line) => line.replace(/^[-•*\d.)\s]+/, '').trim()).filter(Boolean);
    if (!titles.length) return;
    const newSteps = titles.map((title) => ({ ...EMPTY_STEP, id: uuidv4(), title: title.slice(0, 200), date: quickDate, stakeholder: quickStakeholder }));
    persistSteps([...steps, ...newSteps]);
    setQuickTitle('');
  };

  const handleImportFromCatalog = (drafts: CatalogStepDraft[]) => {
    const newSteps = drafts.map((draft) => ({ ...EMPTY_STEP, ...draft, id: uuidv4() }));
    persistSteps([...steps, ...newSteps]);
    toast({ title: isEnglish ? `${newSteps.length} tasks added` : `${newSteps.length} tâches ajoutées` });
  };

  const updateStep = (stepId: string, patch: Partial<ManualStep>) =>
    persistSteps(steps.map((item) => (item.id === stepId ? { ...item, ...patch } : item)));

  const visibleSteps = useMemo(
    () => (stakeholderFilter === 'all' ? sortedSteps : sortedSteps.filter((step) => step.stakeholder === stakeholderFilter)),
    [sortedSteps, stakeholderFilter]
  );

  const calendarDays = useMemo(() => eachDayOfInterval({
    start: startOfWeek(startOfMonth(calendarMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(calendarMonth), { weekStartsOn: 1 }),
  }), [calendarMonth]);

  const stakeholderLabel = (key?: string) => (key && STAKEHOLDER_LABELS[key] ? STAKEHOLDER_LABELS[key][isEnglish ? 'en' : 'fr'] : '');
  const weekDayLabels = isEnglish ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto my-12" />;

  const renderStepRow = (step: ManualStep) => (
    <div key={step.id} className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_150px_160px_auto] items-center gap-2 border-b border-border py-2">
      <Checkbox checked={step.status === 'completed'} aria-label={isEnglish ? 'Done' : 'Terminé'}
        onCheckedChange={(checked) => updateStep(step.id, { status: checked ? 'completed' : 'pending' })} />
      <Input defaultValue={step.title} maxLength={200} aria-label={isEnglish ? 'Title' : 'Titre'}
        className={`border-0 shadow-none px-1 h-9 focus-visible:ring-1 ${step.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}
        onBlur={(e) => e.target.value.trim() && e.target.value.trim() !== step.title && updateStep(step.id, { title: e.target.value.trim() })}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} />
      <div className="flex gap-1 sm:hidden row-span-1">
        <Button variant="ghost" size="icon" aria-label={isEnglish ? 'Edit' : 'Modifier'} onClick={() => setEditingStep(step)}><Pencil className="h-4 w-4" /></Button>
      </div>
      <Input type="date" value={step.date} aria-label="Date" className="h-9 col-span-3 sm:col-span-1" onChange={(e) => updateStep(step.id, { date: e.target.value })} />
      <Select value={step.stakeholder || 'none'} onValueChange={(value) => updateStep(step.id, { stakeholder: value === 'none' ? '' : value })}>
        <SelectTrigger className="h-9 col-span-2 sm:col-span-1" aria-label={isEnglish ? 'Stakeholder' : 'Partie prenante'}><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="none">{isEnglish ? 'Nobody' : 'Personne'}</SelectItem>
          {Object.keys(STAKEHOLDER_LABELS).map((key) => <SelectItem key={key} value={key}>{stakeholderLabel(key)}</SelectItem>)}
        </SelectContent>
      </Select>
      <div className="flex gap-1 justify-end">
        <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label={isEnglish ? 'Edit' : 'Modifier'} onClick={() => setEditingStep(step)}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" aria-label={isEnglish ? 'Delete' : 'Supprimer'} onClick={() => handleDeleteStep(step.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-2xl font-serif">{isEnglish ? 'Build your own timeline' : 'Créez votre rétroplanning'}</h2>
          <RetroplanningShareButton retroplanningId={retroplanningId} />
        </div>

        <div className="sm:w-56">
          <Label htmlFor="retro-wedding-date">{isEnglish ? 'Wedding date' : 'Date du mariage'}</Label>
          <Input id="retro-wedding-date" type="date" value={weddingDate} onChange={(e) => { setWeddingDate(e.target.value); if (e.target.value) persistSteps(steps, e.target.value); }} />
        </div>

        {/* Espace de création unique */}
        <div className="border border-editorial-olive/30 bg-editorial-beige p-4 space-y-3">
          <div className="flex flex-wrap gap-1 bg-background p-1 w-fit">
            <Button variant={inputMode === 'quick' ? 'default' : 'ghost'} size="sm" onClick={() => setInputMode('quick')}><Plus className="h-4 w-4 mr-1" />{isEnglish ? 'Quick add' : 'Saisie rapide'}</Button>
            <Button variant={inputMode === 'notes' ? 'default' : 'ghost'} size="sm" onClick={() => setInputMode('notes')}><Sparkles className="h-4 w-4 mr-1" />{isEnglish ? 'Notes → AI' : 'Notes en vrac (IA)'}</Button>
            <Button variant="ghost" size="sm" onClick={() => setIsCatalogOpen(true)}><BookOpen className="h-4 w-4 mr-1" />{isEnglish ? 'Catalogue' : 'Catalogue'}</Button>
          </div>
          {inputMode === 'quick' ? (
            <>
              <div className="flex flex-col sm:flex-row gap-2">
                <Textarea rows={1} value={quickTitle} maxLength={4000}
                  placeholder={isEnglish ? 'Type a step and press Enter (or paste several lines)' : 'Tapez une étape puis Entrée (ou collez plusieurs lignes)'}
                  aria-label={isEnglish ? 'New step' : 'Nouvelle étape'} className="flex-1 min-h-10 resize-none bg-background"
                  onChange={(e) => setQuickTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleQuickAdd(); } }} />
                <Input type="date" value={quickDate} onChange={(e) => setQuickDate(e.target.value)} aria-label="Date" className="sm:w-40 bg-background" />
                <Select value={quickStakeholder || 'none'} onValueChange={(value) => setQuickStakeholder(value === 'none' ? '' : value)}>
                  <SelectTrigger className="sm:w-44 bg-background" aria-label={isEnglish ? 'Stakeholder' : 'Partie prenante'}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{isEnglish ? 'Who?' : 'Qui ?'}</SelectItem>
                    {Object.keys(STAKEHOLDER_LABELS).map((key) => <SelectItem key={key} value={key}>{stakeholderLabel(key)}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button onClick={handleQuickAdd} disabled={!quickTitle.trim()}>{isEnglish ? 'Add' : 'Ajouter'}</Button>
              </div>
              <p className="text-xs text-muted-foreground">{isEnglish ? 'Date and stakeholder stay selected so you can chain entries.' : 'La date et la partie prenante restent sélectionnées pour enchaîner les saisies.'}</p>
            </>
          ) : (
            <>
              <Textarea rows={6} value={noteText} maxLength={8000} onChange={(e) => setNoteText(e.target.value)} className="bg-background"
                placeholder={isEnglish ? 'Paste your meeting notes: "venue in Jan, caterer tasting in March, invites end of May, witnesses organise the bachelor party"…' : 'Collez vos notes : « lieu en janvier, dégustation traiteur en mars, faire-part fin mai, les témoins organisent l\'EVJF »…'}
                aria-label="Notes" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {!weddingDate && <p className="text-xs text-muted-foreground">{isEnglish ? 'Tip: set the wedding date first for accurate dates.' : 'Astuce : renseignez la date du mariage pour des dates précises.'}</p>}
                <Button className="sm:ml-auto" onClick={handleGenerateFromNote} disabled={isGenerating || noteText.trim().length < 3}>
                  {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  {isEnglish ? 'Turn into steps' : 'Transformer en étapes'}
                </Button>
              </div>
            </>
          )}
        </div>

        <ImportTaskCatalogDialog open={isCatalogOpen} onOpenChange={setIsCatalogOpen} weddingDate={weddingDate} isEnglish={isEnglish} onImport={handleImportFromCatalog} />

        {steps.length > 0 && <RetroplanningSummary steps={steps} weddingDate={weddingDate || null} isEnglish={isEnglish} />}

        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(MANUAL_STATUS_LABELS) as ManualStepStatus[]).map((status) => (
            <div key={status} className="border border-border p-3 sm:p-4">
              <p className="text-sm text-muted-foreground">{MANUAL_STATUS_LABELS[status][isEnglish ? 'en' : 'fr']}</p>
              <p className="text-2xl font-semibold">{counts[status]}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex gap-1 bg-muted p-1 w-fit">
            <Button variant={view === 'list' ? 'outline' : 'ghost'} size="sm" onClick={() => setView('list')}><ListIcon className="h-4 w-4 mr-1" />{isEnglish ? 'List' : 'Liste'}</Button>
            <Button variant={view === 'calendar' ? 'outline' : 'ghost'} size="sm" onClick={() => setView('calendar')}><CalendarDays className="h-4 w-4 mr-1" />{isEnglish ? 'Calendar' : 'Calendrier'}</Button>
            <Button variant={view === 'frise' ? 'outline' : 'ghost'} size="sm" onClick={() => setView('frise')}><GitCommitVertical className="h-4 w-4 mr-1" />{isEnglish ? 'Timeline' : 'Frise'}</Button>
          </div>
          <Select value={stakeholderFilter} onValueChange={setStakeholderFilter}>
            <SelectTrigger className="sm:w-52" aria-label={isEnglish ? 'Filter by stakeholder' : 'Filtrer par partie prenante'}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isEnglish ? 'Everyone' : 'Tout le monde'}</SelectItem>
              {Object.keys(STAKEHOLDER_LABELS).map((key) => <SelectItem key={key} value={key}>{stakeholderLabel(key)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {steps.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{isEnglish ? 'No steps yet. Type a step above, or paste your notes and let AI build your timeline.' : 'Aucune étape pour le moment. Tapez une étape ci-dessus, ou collez vos notes et laissez l\'IA créer votre rétroplanning.'}</p>
        ) : view === 'frise' ? (
          <RetroplanningFrise steps={visibleSteps} weddingDate={weddingDate || null} isEnglish={isEnglish} />
        ) : view === 'list' ? (
          <div>{visibleSteps.map(renderStepRow)}</div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" aria-label={isEnglish ? 'Previous month' : 'Mois précédent'} onClick={() => setCalendarMonth(addMonths(calendarMonth, -1))}><ChevronLeft className="h-4 w-4" /></Button>
              <h3 className="font-serif text-lg capitalize">{format(calendarMonth, 'MMMM yyyy', { locale: dateLocale })}</h3>
              <Button variant="ghost" size="icon" aria-label={isEnglish ? 'Next month' : 'Mois suivant'} onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-7 border-l border-t border-border text-xs">
              {weekDayLabels.map((label) => <div key={label} className="border-r border-b border-border p-1 text-center text-muted-foreground bg-muted">{label}</div>)}
              {calendarDays.map((day) => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const daySteps = visibleSteps.filter((step) => step.date === dayKey);
                const isWeddingDay = weddingDate === dayKey;
                return (
                  <div key={dayKey} className={`border-r border-b border-border min-h-16 sm:min-h-24 p-1 ${isSameMonth(day, calendarMonth) ? '' : 'bg-muted/40 text-muted-foreground'} ${isWeddingDay ? 'bg-editorial-olive/10' : ''}`}>
                    <p className={`text-right ${isToday(day) ? 'font-bold text-editorial-olive' : ''}`}>{format(day, 'd')}</p>
                    {isWeddingDay && <p className="font-serif text-editorial-olive truncate">{isEnglish ? 'Wedding' : 'Jour J'}</p>}
                    {daySteps.map((step) => (
                      <button key={step.id} type="button" onClick={() => setEditingStep(step)}
                        className={`block w-full text-left truncate px-1 mt-0.5 bg-editorial-olive/15 hover:bg-editorial-olive/25 ${step.status === 'completed' ? 'line-through opacity-60' : ''}`}>{step.title}</button>
                    ))}
                  </div>
                );
              })}
            </div>
            {visibleSteps.some((step) => !step.date) && (
              <p className="text-xs text-muted-foreground">{isEnglish ? 'Undated steps are visible in the List view.' : 'Les étapes sans date sont visibles dans la vue Liste.'}</p>
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={!!editingStep} onOpenChange={(isOpen) => !isOpen && setEditingStep(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingStep?.id ? (isEnglish ? 'Edit step' : 'Modifier l\'étape') : (isEnglish ? 'New step' : 'Nouvelle étape')}</DialogTitle></DialogHeader>
          {editingStep && (
            <div className="space-y-3">
              <div><Label htmlFor="step-title">{isEnglish ? 'Title' : 'Titre'} *</Label><Input id="step-title" value={editingStep.title} maxLength={200} onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label htmlFor="step-date">Date</Label><Input id="step-date" type="date" value={editingStep.date} onChange={(e) => setEditingStep({ ...editingStep, date: e.target.value })} /></div>
                <div><Label htmlFor="step-period">{isEnglish ? 'Period' : 'Période'}</Label><Input id="step-period" placeholder={isEnglish ? 'e.g. 6 months before' : 'ex. J-6 mois'} value={editingStep.period} maxLength={50} onChange={(e) => setEditingStep({ ...editingStep, period: e.target.value })} /></div>
              </div>
              <div><Label htmlFor="step-category">{isEnglish ? 'Category' : 'Catégorie'}</Label><Input id="step-category" placeholder={isEnglish ? 'e.g. Venue, Caterer' : 'ex. Lieu, Traiteur'} value={editingStep.category} maxLength={80} onChange={(e) => setEditingStep({ ...editingStep, category: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{isEnglish ? 'Stakeholder' : 'Partie prenante'}</Label>
                  <Select value={editingStep.stakeholder || 'none'} onValueChange={(value) => setEditingStep({ ...editingStep, stakeholder: value === 'none' ? '' : value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{isEnglish ? 'Nobody' : 'Personne'}</SelectItem>
                      {Object.keys(STAKEHOLDER_LABELS).map((key) => <SelectItem key={key} value={key}>{stakeholderLabel(key)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>{isEnglish ? 'Status' : 'Statut'}</Label>
                  <Select value={editingStep.status} onValueChange={(value) => setEditingStep({ ...editingStep, status: value as ManualStepStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(MANUAL_STATUS_LABELS) as ManualStepStatus[]).map((status) => <SelectItem key={status} value={status}>{MANUAL_STATUS_LABELS[status][isEnglish ? 'en' : 'fr']}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label htmlFor="step-note">Note</Label><Textarea id="step-note" value={editingStep.note} maxLength={1000} onChange={(e) => setEditingStep({ ...editingStep, note: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStep(null)}>{isEnglish ? 'Cancel' : 'Annuler'}</Button>
            <Button onClick={handleSaveStep} disabled={!editingStep?.title.trim()}>{isEnglish ? 'Save' : 'Enregistrer'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </Card>
  );
};

export default RetroplanningManuel;
