import React from 'react';

interface PremiumGateProps {
  children: React.ReactNode;
  feature?: string;
  description?: string;
}

// Toutes les fonctionnalités sont désormais gratuites - on affiche directement le contenu
const PremiumGate: React.FC<PremiumGateProps> = ({ children }) => {
  return <>{children}</>;
};

export default PremiumGate;
