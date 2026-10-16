import { useState, useCallback } from 'react';
import { useUserProfile } from './useUserProfile';

interface UsePremiumActionOptions {
  feature: string;
  description?: string;
  /** Module ouvert à tous (ex. plan de table) : jamais bloqué par le Premium */
  alwaysAllow?: boolean;
}

export const usePremiumAction = ({ feature, description, alwaysAllow = false }: UsePremiumActionOptions) => {
  const { isPremium: isPremiumProfile, loading } = useUserProfile();
  const isPremium = isPremiumProfile || alwaysAllow;
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const executeAction = useCallback((action: () => void) => {
    if (isPremium) {
      // User is premium, execute action directly
      action();
    } else {
      // User is not premium, show premium modal
      setShowPremiumModal(true);
    }
  }, [isPremium]);

  const closePremiumModal = useCallback(() => {
    setShowPremiumModal(false);
  }, []);

  return {
    executeAction,
    showPremiumModal,
    closePremiumModal,
    isPremium,
    loading,
    feature,
    description
  };
};
