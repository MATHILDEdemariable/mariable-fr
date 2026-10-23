import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWedding } from '@/contexts/WeddingContext';
import { useAuth } from '@/contexts/AuthContext';

export type JourJModule = 'seating' | 'drinks' | 'decor' | 'trombinoscope';

const db = supabase as any;

/** Mémorise qu'un module de l'organisation a été validé et transmis au Jour J. */
export const useJourJHandoff = (module: JourJModule) => {
  const { currentWeddingId } = useWedding();
  const { user } = useAuth();
  const weddingId = currentWeddingId || user?.id || null;
  const [validatedAt, setValidatedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadHandoff = useCallback(async () => {
    if (!weddingId) return;
    const { data, error } = await db
      .from('wedding_jour_j_handoffs')
      .select('validated_at')
      .eq('wedding_id', weddingId)
      .eq('module', module)
      .maybeSingle();
    if (error) {
      console.error('❌ loadHandoff failed:', error);
      return;
    }
    setValidatedAt(data?.validated_at ?? null);
  }, [weddingId, module]);

  useEffect(() => {
    loadHandoff();
  }, [loadHandoff]);

  const validateHandoff = async () => {
    if (!weddingId || !user) throw new Error('NOT_READY');
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const { error } = await db
        .from('wedding_jour_j_handoffs')
        .upsert({ wedding_id: weddingId, module, validated_by: user.id, validated_at: now }, { onConflict: 'wedding_id,module' });
      if (error) throw error;
      setValidatedAt(now);
    } finally {
      setIsSaving(false);
    }
  };

  return { weddingId, validatedAt, isSaving, validateHandoff, setValidatedAt };
};
