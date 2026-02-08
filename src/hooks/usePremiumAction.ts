import { useState, useCallback } from 'react';
import { useUserProfile } from './useUserProfile';

interface UsePremiumActionOptions {
  feature: string;
  description?: string;
}

export const usePremiumAction = ({ feature, description }: UsePremiumActionOptions) => {
  const { isPremium, loading } = useUserProfile();
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
