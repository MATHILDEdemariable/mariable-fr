
import { useState } from 'react';
import { useUserProfile } from './useUserProfile';

interface UsePremiumActionOptions {
  feature: string;
  description?: string;
}

export const usePremiumAction = ({ feature, description }: UsePremiumActionOptions) => {
  const { isPremium, loading } = useUserProfile();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const executeAction = (action: () => void) => {
    if (loading) return;
    
    if (isPremium) {
      action();
    } else {
      setShowPremiumModal(true);
    }
  };

  const closePremiumModal = () => {
    setShowPremiumModal(false);
  };

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
