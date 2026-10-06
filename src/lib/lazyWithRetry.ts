import { lazy as reactLazy, ComponentType } from 'react';

const RELOAD_KEY = 'chunk-reload-attempt';

/**
 * Remplace React.lazy : si le chunk n'est plus disponible (nouveau déploiement),
 * on recharge la page une seule fois pour récupérer le nouveau manifeste.
 */
export const lazyWithRetry = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) =>
  reactLazy(async () => {
    try {
      const module = await factory();
      sessionStorage.removeItem(RELOAD_KEY);
      return module;
    } catch (error) {
      const message = (error as Error)?.message || '';
      const isChunkError = /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
        message
      );

      const lastReloadAt = Number(sessionStorage.getItem(RELOAD_KEY)) || 0;
      if (isChunkError && Date.now() - lastReloadAt > 10000) {
        console.warn('⚠️ Chunk obsolète détecté, rechargement de la page');
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
        window.location.reload();
        // Promesse jamais résolue : la page se recharge
        return new Promise<{ default: T }>(() => {});
      }

      console.error('❌ lazyWithRetry failed:', error);
      throw error;
    }
  });
