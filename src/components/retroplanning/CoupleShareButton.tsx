import { useEffect, useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  useEffect(() => {
    if (!currentWeddingId) return;
    db.from('wedding_jour_j_handoffs').select('validated_at').eq('wedding_id', currentWeddingId).eq('module', COUPLE_SHARE_MODULE).maybeSingle()
      .then(({ data, error }: any) => { if (error) console.error('❌ loadCoupleShare failed:', error); setValidatedAt(data?.validated_at ?? null); });
  }, [currentWeddingId]);

  const handleValidateForCouple = async () => {
    if (!currentWeddingId || !user) return;
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const sharedSteps = steps.filter((step) => step.stakeholder !== 'planner');
      const { error } = await db.from('wedding_jour_j_handoffs').upsert(
        { wedding_id: currentWeddingId, module: COUPLE_SHARE_MODULE, validated_by: user.id, validated_at: now, snapshot: { steps: sharedSteps, wedding_date: weddingDate || null } },
        { onConflict: 'wedding_id,module' });
      if (error) throw error;
      setValidatedAt(now);
      toast({ title: isEnglish ? 'Shared with the couple' : 'Transmis aux mariés', description: isEnglish ? `${sharedSteps.length} steps shared (wedding planner tasks excluded).` : `${sharedSteps.length} étapes partagées (tâches « Wedding planner » exclues).` });
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
      <Button onClick={handleValidateForCouple} disabled={isSaving || steps.length === 0}>
        {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
        {validatedAt ? (isEnglish ? 'Update couple view' : 'Mettre à jour pour le couple') : (isEnglish ? 'Validate for couple sharing' : 'Valider pour partage couple')}
      </Button>
      {validatedAt && (
        <span className="text-xs text-primary flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />
          {isEnglish ? 'Shared on ' : 'Transmis le '}{new Date(validatedAt).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR')}
        </span>
      )}
    </div>
  );
};

export default CoupleShareButton;
