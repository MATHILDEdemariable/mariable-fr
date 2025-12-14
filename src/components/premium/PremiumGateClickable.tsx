import React from 'react';

interface PremiumGateClickableProps {
  children: React.ReactNode;
  feature?: string;
  description?: string;
}

// Toutes les fonctionnalités sont désormais gratuites - on affiche directement le contenu
const PremiumGateClickable: React.FC<PremiumGateClickableProps> = ({ children }) => {
  return <>{children}</>;
};

export default PremiumGateClickable;
