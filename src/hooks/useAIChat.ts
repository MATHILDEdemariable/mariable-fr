import { useState } from 'react';
import { useAuth } from './useAuth';
import { useSessionId } from './useSessionId';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatResponse {
  reply: string;
  onePager?: any;
  vendors?: any[];
  usageInfo?: {
    promptsUsedToday: number;
    maxPrompts: number;
    remaining: number;
    limitReached: boolean;
    requiresAuth: boolean;
    requiresPremium: boolean;
  };
}

export const useAIChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const sessionId = useSessionId();

  const sendMessage = async (
    userMessage: string,
    conversationHistory: Message[],
    shouldGeneratePlan = false
  ): Promise<AIChatResponse> => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-wedding-assistant', {
        body: {
          userMessage,
          conversationHistory,
          userId: user?.id,
          sessionId,
          shouldGeneratePlan
        }
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error in AI chat:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
};