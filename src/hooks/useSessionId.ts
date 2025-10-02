import { useMemo } from 'react';

export const useSessionId = (): string => {
  return useMemo(() => {
    const stored = localStorage.getItem('ai_session_id');
    if (stored) return stored;
    
    const newId = crypto.randomUUID();
    localStorage.setItem('ai_session_id', newId);
    return newId;
  }, []);
};