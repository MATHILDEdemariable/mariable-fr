import { useEffect, useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useWedding } from '@/contexts/WeddingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { ManualStep } from './RetroplanningManuel';

const db = supabase as any;
export const COUPLE_SHARE_MODULE = 'retroplanning_couple';

/** Le pro fige une copie du planning (sans ses tâches internes) : tant que ce n'est pas validé, rien n'est transmis aux mariés. */
const CoupleShareButton = ({ steps, weddingDate, isEnglish }: { steps: ManualStep[]; weddingDate: string; isEnglish: boolean }) => {
  const { currentWeddingId } = useWedding();
  const { user } = useAuth();
  const { toast } = useToast();
  const [validatedAt, setValidatedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sharedStepIds, setSharedStepIds] = useState<string[] | null>(null);
  const [selectedStepIds, setSelectedStepIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!currentWeddingId) return;
    db.from('wedding_jour_j_handoffs').select('validated_at, snapshot').eq('wedding_id', currentWeddingId).eq('module', COUPLE_SHARE_MODULE).maybeSingle()
      .then(({ data, error }: any) => { if (error) console.error('❌ loadCoupleShare failed:', error); setValidatedAt(data?.validated_at ?? null); setSharedStepIds(Array.isArray(data?.snapshot?.steps) ? data.snapshot.steps.map((step: ManualStep) => step.id) : null); });
  }, [currentWeddingId]);

  // Pré-sélection : dernier partage s'il existe, sinon tout sauf les tâches « Wedding planner »
  const openFilterDialog = () => {
    const defaultIds = sharedStepIds
      ? steps.filter((step) => sharedStepIds.includes(step.id)).map((step) => step.id)
      : steps.filter((step) => step.stakeholder !== 'planner').map((step) => step.id);
    setSelectedStepIds(new Set(defaultIds));
    setIsFilterOpen(true);
  };

  const toggleStep = (stepId: string) => {
    setSelectedStepIds((previous) => {
      const next = new Set(previous);
      if (next.has(stepId)) next.delete(stepId); else next.add(stepId);
      return next;
    });
  };

  const handleValidateForCouple = async () => {
    if (!currentWeddingId || !user) return;
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const sharedSteps = steps.filter((step) => selectedStepIds.has(step.id));
      const { error } = await db.from('wedding_jour_j_handoffs').upsert(
        { wedding_id: currentWeddingId, module: COUPLE_SHARE_MODULE, validated_by: user.id, validated_at: now, snapshot: { steps: sharedSteps, wedding_date: weddingDate || null } },
        { onConflict: 'wedding_id,module' });
      if (error) throw error;
      setValidatedAt(now);
      setSharedStepIds(sharedSteps.map((step) => step.id));
      setIsFilterOpen(false);
      toast({ title: isEnglish ? 'Shared with the couple' : 'Transmis aux mariés', description: isEnglish ? `${sharedSteps.length} of ${steps.length} steps shared.` : `${sharedSteps.length} étapes sur ${steps.length} partagées.` });
    } catch (error) {
      console.error('❌ handleValidateForCouple failed:', error);
      toast({ title: isEnglish ? 'Error' : 'Erreur', description: isEnglish ? 'Sharing failed.' : 'Le partage a échoué.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentWeddingId) return null;
  return (
    <div className="flex flex-col items-start gap-1">
      <Button onClick={openFilterDialog} disabled={isSaving || steps.length === 0}>
        {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
        {validatedAt ? (isEnglish ? 'Update couple view' : 'Mettre à jour pour le couple') : (isEnglish ? 'Validate for couple sharing' : 'Valider pour partage couple')}
      </Button>
      {validatedAt && (
        <span className="text-xs text-primary flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />
          {isEnglish ? 'Shared on ' : 'Transmis le '}{new Date(validatedAt).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR')}
        </span>
      )}

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="rounded-none max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">{isEnglish ? 'Choose what the couple sees' : 'Choisir ce que voient les mariés'}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{isEnglish ? 'Untick the steps to hide from the couple’s read-only view.' : 'Décochez les étapes à masquer dans la vue lecture seule des mariés.'}</p>
          <div className="flex gap-2 text-xs">
            <button type="button" className="underline" onClick={() => setSelectedStepIds(new Set(steps.map((step) => step.id)))}>{isEnglish ? 'Select all' : 'Tout cocher'}</button>
            <button type="button" className="underline" onClick={() => setSelectedStepIds(new Set())}>{isEnglish ? 'Clear' : 'Tout décocher'}</button>
          </div>
          <ul className="max-h-[50vh] overflow-y-auto divide-y border">
            {steps.map((step) => (
              <li key={step.id}>
                <label className="flex min-h-[44px] cursor-pointer items-center gap-3 px-3 py-2 text-sm">
                  <Checkbox checked={selectedStepIds.has(step.id)} onCheckedChange={() => toggleStep(step.id)} />
                  <span className="flex-1">{step.title || (isEnglish ? 'Untitled step' : 'Étape sans titre')}</span>
                  {step.period && <span className="text-xs text-muted-foreground">{step.period}</span>}
                  {step.stakeholder === 'planner' && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">WP</span>}
                </label>
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFilterOpen(false)}>{isEnglish ? 'Cancel' : 'Annuler'}</Button>
            <Button onClick={handleValidateForCouple} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEnglish ? `Share ${selectedStepIds.size} steps` : `Partager ${selectedStepIds.size} étapes`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoupleShareButton;
