import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Wedding {
  id: string;
  title: string;
  wedding_date: string | null;
  wedding_location: string | null;
  guest_count: number | null;
  is_default: boolean;
  owner_id: string;
  created_at: string;
}

export type AccountType = 'b2c' | 'b2b';

interface WeddingContextType {
  accountType: AccountType;
  weddings: Wedding[];
  currentWeddingId: string | null;
  currentWedding: Wedding | null;
  loading: boolean;
  selectWedding: (weddingId: string) => void;
  refreshWeddings: () => Promise<void>;
  createWedding: (input: {
    title: string;
    wedding_date?: string | null;
    wedding_location?: string | null;
    guest_count?: number | null;
  }) => Promise<Wedding>;
  updateWedding: (
    weddingId: string,
    input: {
      title: string;
      wedding_date?: string | null;
      wedding_location?: string | null;
      guest_count?: number | null;
    }
  ) => Promise<void>;
  canCreateMoreWeddings: boolean;
}

const STORAGE_KEY = 'mariable:current-wedding-id';

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

// Le client typé ne connaît pas encore les nouvelles tables tant que la
// migration n'est pas appliquée : on passe par un client non typé.
const db = supabase as any;

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>('b2c');
  const [isPremium, setIsPremium] = useState(false);
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [currentWeddingId, setCurrentWeddingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    if (!user) {
      setWeddings([]);
      setCurrentWeddingId(null);
      setAccountType('b2c');
      setLoading(false);
      return;
    }

    try {
      const [profileRes, weddingsRes] = await Promise.all([
        db
          .from('profiles')
          .select('account_type, subscription_type, subscription_expires_at')
          .eq('id', user.id)
          .maybeSingle(),
        db
          .from('weddings')
          .select('id, title, wedding_date, wedding_location, guest_count, is_default, owner_id, created_at')
          .order('created_at', { ascending: true }),
      ]);

      const profile = profileRes?.data;
      const type: AccountType = profile?.account_type === 'b2b' ? 'b2b' : 'b2c';
      setAccountType(type);
      setIsPremium(
        ['premium', 'pro_premium'].includes(profile?.subscription_type) &&
          (!profile?.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date())
      );

      let list: Wedding[] = weddingsRes?.data ?? [];

      // Un particulier a toujours un mariage : on le crée à la volée si besoin
      // (comptes créés après la migration initiale).
      if (list.length === 0 && type === 'b2c') {
        // Le mariage par défaut reprend l'identifiant du compte (migration sans risque).
        const { data: created } = await db
          .from('weddings')
          .insert({ id: user.id, owner_id: user.id, title: 'Mon mariage', is_default: true })
          .select()
          .single();
        if (created) {
          list = [created];
        }
      }

      setWeddings(list);

      const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      const fromUrl = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('wedding')
        : null;

      const resolved =
        (fromUrl && list.find((w) => w.id === fromUrl)?.id) ||
        (type === 'b2b'
          ? stored && list.find((w) => w.id === stored)?.id
          : list.find((w) => w.is_default)?.id || list[0]?.id) ||
        (type === 'b2b' && list.length === 1 ? list[0].id : null) ||
        null;

      setCurrentWeddingId(resolved ?? null);
    } catch (error) {
      console.error('❌ WeddingContext: chargement impossible', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    loadAll();
  }, [authLoading, loadAll]);

  const selectWedding = useCallback((weddingId: string) => {
    setCurrentWeddingId(weddingId);
    try {
      localStorage.setItem(STORAGE_KEY, weddingId);
    } catch {
      /* stockage indisponible : sans effet */
    }
  }, []);

  const createWedding = useCallback<WeddingContextType['createWedding']>(
    async (input) => {
      if (!user) throw new Error('Utilisateur non authentifié');

      const { data, error } = await db
        .from('weddings')
        .insert({
          owner_id: user.id,
          title: input.title,
          wedding_date: input.wedding_date || null,
          wedding_location: input.wedding_location || null,
          guest_count: input.guest_count ?? null,
        })
        .select()
        .single();

      if (error) throw error;

      setWeddings((prev) => [...prev, data]);
      selectWedding(data.id);
      return data as Wedding;
    },
    [user, selectWedding]
  );

  const updateWedding = useCallback<WeddingContextType['updateWedding']>(
    async (weddingId, input) => {
      if (!user) throw new Error('Utilisateur non authentifié');

      const payload = {
        title: input.title,
        wedding_date: input.wedding_date || null,
        wedding_location: input.wedding_location || null,
        guest_count: input.guest_count ?? null,
      };

      const { error } = await db.from('weddings').update(payload).eq('id', weddingId);
      if (error) throw error;

      setWeddings((prev) => prev.map((w) => (w.id === weddingId ? { ...w, ...payload } : w)));
    },
    [user]
  );

  const canCreateMoreWeddings = accountType !== 'b2b' ? false : isPremium || weddings.length < 1;

  const value = useMemo<WeddingContextType>(
    () => ({
      accountType,
      weddings,
      currentWeddingId,
      currentWedding: weddings.find((w) => w.id === currentWeddingId) ?? null,
      loading,
      selectWedding,
      refreshWeddings: loadAll,
      createWedding,
      updateWedding,
      canCreateMoreWeddings,
    }),
    [accountType, weddings, currentWeddingId, loading, selectWedding, loadAll, createWedding, updateWedding, canCreateMoreWeddings]
  );

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>;
};

export const useWedding = (): WeddingContextType => {
  const context = useContext(WeddingContext);
  if (context === undefined) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};

export default WeddingContext;
