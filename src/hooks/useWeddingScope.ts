import { useCallback, useMemo } from 'react';
import { useWedding } from '@/contexts/WeddingContext';

/**
 * Utilitaire partagé pour rattacher les données d'un module au mariage courant.
 *
 * - `scopeQuery(query)` : ajoute le filtre sur `wedding_id` quand un mariage est
 *   sélectionné (sinon la requête reste inchangée, comportement B2C historique).
 * - `withWedding(payload)` : ajoute `wedding_id` au moment de l'insertion.
 */
export const useWeddingScope = () => {
  const { currentWeddingId, loading } = useWedding();

  const scopeQuery = useCallback(
    <T>(query: T): T => {
      if (!currentWeddingId) return query;
      return (query as any).eq('wedding_id', currentWeddingId) as T;
    },
    [currentWeddingId]
  );

  const withWedding = useCallback(
    <T extends Record<string, any>>(payload: T): T & { wedding_id?: string } => {
      if (!currentWeddingId) return payload;
      return { ...payload, wedding_id: currentWeddingId };
    },
    [currentWeddingId]
  );

  return useMemo(
    () => ({ weddingId: currentWeddingId, weddingLoading: loading, scopeQuery, withWedding }),
    [currentWeddingId, loading, scopeQuery, withWedding]
  );
};

export default useWeddingScope;
