import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWedding } from '@/contexts/WeddingContext';
import { useAuth } from '@/contexts/AuthContext';

const db = supabase as any;

/** Lit et enregistre (auto-save) le contenu d'un module (musique, traiteur) partagé pro / mariés. */
export const useWeddingModulePlan = <T extends object>(module: 'music' | 'catering' | 'decor_zones', defaults: T) => {
  const { currentWeddingId } = useWedding();
  const { user } = useAuth();
  const weddingId = currentWeddingId || user?.id || null;
  const [data, setData] = useState<T>(defaults);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const loadedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!weddingId) return;
    loadedRef.current = false;
    (async () => {
      setIsLoading(true);
      const { data: row, error } = await db.from('wedding_module_plans').select('data').eq('wedding_id', weddingId).eq('module', module).maybeSingle();
      if (error) console.error('❌ loadModulePlan failed:', error);
      setData({ ...defaults, ...(row?.data || {}) });
      setIsLoading(false);
      loadedRef.current = true;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId, module]);

  const saveNow = useCallback(async (next: T) => {
    if (!weddingId || !user) return;
    setIsSaving(true);
    const { error } = await db.from('wedding_module_plans').upsert(
      { wedding_id: weddingId, module, data: next, updated_by: user.id },
      { onConflict: 'wedding_id,module' },
    );
    if (error) console.error('❌ saveModulePlan failed:', error);
    setIsSaving(false);
  }, [weddingId, user, module]);

  const updateData = (updater: (previous: T) => T) => {
    setData((previous) => {
      const next = updater(previous);
      if (loadedRef.current) {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => saveNow(next), 800);
      }
      return next;
    });
  };

  return { weddingId, data, updateData, isLoading, isSaving };
};
