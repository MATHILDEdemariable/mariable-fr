import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from './useUserProfile';

interface AiUsageData {
  checklist: boolean;
  retroplanning: boolean;
}

export const useAiUsageLimit = () => {
  const { user } = useAuth();
  const { isPremium } = useUserProfile();
  const [usageData, setUsageData] = useState<AiUsageData>({
    checklist: false,
    retroplanning: false
  });
  const [loading, setLoading] = useState(true);

  // Charger l'usage existant
  useEffect(() => {
    const loadUsage = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Vérifier si une checklist existe
        const { data: checklistData } = await supabase
          .from('planning_avant_jour_j')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        // Vérifier si un retroplanning existe
        const { data: retroplanningData } = await supabase
          .from('wedding_retroplanning')
          .select('id')
          .eq('user_id', user.id)
          .eq('mode', 'ai')
          .limit(1);

        setUsageData({
          checklist: (checklistData && checklistData.length > 0) || false,
          retroplanning: (retroplanningData && retroplanningData.length > 0) || false
        });
      } catch (error) {
        console.error('Error loading AI usage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsage();
  }, [user]);

  // Vérifier si l'utilisateur peut utiliser une feature IA
  const canUseFeature = useCallback((featureName: 'checklist' | 'retroplanning'): boolean => {
    // Les utilisateurs premium ont accès illimité
    if (isPremium) return true;
    
    // Les utilisateurs free ont droit à 1 utilisation par feature
    return !usageData[featureName];
  }, [isPremium, usageData]);

  // Vérifier si la feature a déjà été utilisée
  const hasUsedFeature = useCallback((featureName: 'checklist' | 'retroplanning'): boolean => {
    return usageData[featureName];
  }, [usageData]);

  // Enregistrer l'utilisation d'une feature
  const recordUsage = useCallback(async (featureName: 'checklist' | 'retroplanning') => {
    setUsageData(prev => ({
      ...prev,
      [featureName]: true
    }));
  }, []);

  // Rafraîchir les données d'usage
  const refreshUsage = useCallback(async () => {
    if (!user) return;

    try {
      const { data: checklistData } = await supabase
        .from('planning_avant_jour_j')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      const { data: retroplanningData } = await supabase
        .from('wedding_retroplanning')
        .select('id')
        .eq('user_id', user.id)
          .eq('mode', 'ai')
        .limit(1);

      setUsageData(prev => ({
        ...prev,
        checklist: (checklistData && checklistData.length > 0) || false,
        retroplanning: (retroplanningData && retroplanningData.length > 0) || false
      }));
    } catch (error) {
      console.error('Error refreshing AI usage:', error);
    }
  }, [user]);

  return {
    usageData,
    loading,
    canUseFeature,
    hasUsedFeature,
    recordUsage,
    refreshUsage,
    isPremium
  };
};
