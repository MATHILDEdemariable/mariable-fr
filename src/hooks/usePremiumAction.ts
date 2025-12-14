interface UsePremiumActionOptions {
  feature: string;
  description?: string;
}

// Toutes les fonctionnalités sont désormais gratuites - on exécute toujours l'action
export const usePremiumAction = ({ feature, description }: UsePremiumActionOptions) => {
  const executeAction = (action: () => void) => {
    action();
  };

  return {
    executeAction,
    showPremiumModal: false,
    closePremiumModal: () => {},
    isPremium: true,
    loading: false,
    feature,
    description
  };
};
