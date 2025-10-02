import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useSessionId } from './useSessionId';
import { supabase } from '@/integrations/supabase/client';

interface UsageInfo {
  promptsUsedToday: number;
  maxPrompts: number;
  remaining: number;
  limitReached: boolean;
  requiresAuth: boolean;
  requiresPremium: boolean;
}

export const useUsageLimits = () => {
  const { user, profile } = useAuth();
  const sessionId = useSessionId();
  const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null);

  const fetchUsage = async () => {
    const today = new Date().toISOString().split('T')[0];
    const identifier = user?.id || sessionId;

    const { data } = await supabase
      .from('ai_usage_tracking')
      .select('*')
      .eq(user ? 'user_id' : 'session_id', identifier)
      .eq('last_prompt_date', today)
      .maybeSingle();

    const isAnonymous = !user;
    const isPremium = profile?.subscription_type === 'premium';
    
    const maxPrompts = isAnonymous ? 1 : isPremium ? 999 : 3;
    const used = data?.prompts_used_today || 0;

    setUsageInfo({
      promptsUsedToday: used,
      maxPrompts: maxPrompts,
      remaining: Math.max(0, maxPrompts - used),
      limitReached: used >= maxPrompts,
      requiresAuth: isAnonymous && used >= 1,
      requiresPremium: !isAnonymous && !isPremium && used >= 3
    });
  };

  useEffect(() => {
    fetchUsage();
  }, [user, profile, sessionId]);

  return { usageInfo, refreshUsage: fetchUsage };
};