import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Plus, Pencil, Trash2, Loader2, List as ListIcon, CalendarDays } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useWeddingScope } from '@/hooks/useWeddingScope';
import RetroplanningShareButton from './RetroplanningShareButton';

export type ManualStepStatus = 'pending' | 'in_progress' | 'completed';

export interface ManualStep {
  id: string;
  title: string;
  date: string; // yyyy-MM-dd, optionnel
  period: string; // ex. "J-6 mois"
  category: string;
  status: ManualStepStatus;
  note: string;
}

export const MANUAL_STATUS_LABELS: Record<ManualStepStatus, { fr: string; en: string; className: string }> = {
  pending: { fr: 'À faire', en: 'To do', className: 'bg-muted text-foreground' },
  in_progress: { fr: 'En cours', en: 'In progress', className: 'bg-secondary text-secondary-foreground' },
  completed: { fr: 'Terminé', en: 'Done', className: 'bg-primary text-primary-foreground' },
};

const EMPTY_STEP: ManualStep = { id: '', title: '', date: '', period: '', category: '', status: 'pending', note: '' };

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
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [editingStep, setEditingStep] = useState<ManualStep | null>(null);
  const db = supabase as any;

  useEffect(() => {
    const loadManualRetroplanning = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await scopeQuery(
          db.from('wedding_retroplanning').select('id, timeline_data').eq('user_id', user.id).eq('mode', 'manual')
        ).order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (error) throw error;
        setRetroplanningId(data?.id ?? null);
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

  const persistSteps = async (nextSteps: ManualStep[]) => {
    setSteps(nextSteps);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      if (retroplanningId) {
        const { error } = await db.from('wedding_retroplanning')
          .update({ timeline_data: nextSteps, updated_at: new Date().toISOString() })
          .eq('id', retroplanningId);
        if (error) throw error;
      } else {
        const firstDate = nextSteps.find((step) => step.date)?.date || new Date().toISOString().slice(0, 10);
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

  const sortedSteps = useMemo(() => sortManualSteps(steps), [steps]);
  const counts = useMemo(() => ({
    pending: steps.filter((step) => step.status === 'pending').length,
    in_progress: steps.filter((step) => step.status === 'in_progress').length,
    completed: steps.filter((step) => step.status === 'completed').length,
  }), [steps]);

  const stepsByMonth = useMemo(() => {
    const groups: Record<string, ManualStep[]> = {};
    sortedSteps.forEach((step) => {
      const key = step.date ? format(new Date(step.date), 'MMMM yyyy', { locale: dateLocale }) : (isEnglish ? 'No date' : 'Sans date');
      (groups[key] ||= []).push(step);
    });
    return groups;
  }, [sortedSteps, dateLocale, isEnglish]);

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto my-12" />;

  const renderStepRow = (step: ManualStep) => (
    <div key={step.id} className="flex flex-col sm:flex-row sm:items-center gap-3 border border-border p-4 bg-card">
      <div className="flex-1 min-w-0">
        <p className="font-medium">{step.title}</p>
        <p className="text-sm text-muted-foreground">
          {[step.date && format(new Date(step.date), 'dd MMM yyyy', { locale: dateLocale }), step.period, step.category].filter(Boolean).join(' · ')}
        </p>
        {step.note && <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{step.note}</p>}
      </div>
      <Select value={step.status} onValueChange={(value) => persistSteps(steps.map((item) => item.id === step.id ? { ...item, status: value as ManualStepStatus } : item))}>
        <SelectTrigger className="w-full sm:w-36" aria-label={isEnglish ? 'Status' : 'Statut'}><SelectValue /></SelectTrigger>
        <SelectContent>
          {(Object.keys(MANUAL_STATUS_LABELS) as ManualStepStatus[]).map((status) => (
            <SelectItem key={status} value={status}>{MANUAL_STATUS_LABELS[status][isEnglish ? 'en' : 'fr']}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" aria-label={isEnglish ? 'Edit' : 'Modifier'} onClick={() => setEditingStep(step)}><Pencil className="h-4 w-4" /></Button>
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
          </div>
          <Button onClick={() => setEditingStep({ ...EMPTY_STEP })}><Plus className="h-4 w-4 mr-2" />{isEnglish ? 'Add a step' : 'Ajouter une étape'}</Button>
        </div>

        {steps.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{isEnglish ? 'No steps yet. Add your first one.' : 'Aucune étape pour le moment. Ajoutez la première.'}</p>
        ) : view === 'list' ? (
          <div className="space-y-2">{sortedSteps.map(renderStepRow)}</div>
        ) : (
          <div className="space-y-6">
            {Object.entries(stepsByMonth).map(([month, monthSteps]) => (
              <div key={month} className="space-y-2">
                <h3 className="font-serif text-lg capitalize flex items-center gap-2">{month}<Badge variant="secondary">{monthSteps.length}</Badge></h3>
                {monthSteps.map(renderStepRow)}
              </div>
            ))}
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
