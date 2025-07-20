
import React, { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Crown } from 'lucide-react';
import PremiumModal from './PremiumModal';

interface PremiumGateClickableProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
}

const PremiumGateClickable: React.FC<PremiumGateClickableProps> = ({ 
  children, 
  feature, 
  description 
}) => {
  const { isPremium, loading } = useUserProfile();
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return <div className="animate-pulse bg-muted h-10 rounded-lg" />;
  }

  if (isPremium) {
    return <>{children}</>;
  }

  // Pour les utilisateurs non-premium, intercepter les clics
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div 
        className="relative cursor-pointer"
        onClick={handleClick}
      >
        {/* Overlay premium indicator */}
        <div className="absolute -top-1 -right-1 z-10">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full p-1">
            <Crown className="h-3 w-3" />
          </div>
        </div>
        
        {/* Content désaturé pour les non-premium */}
        <div className="opacity-60 saturate-50 pointer-events-none">
          {children}
        </div>
        
        {/* Overlay clickable transparent */}
        <div className="absolute inset-0 bg-transparent" />
      </div>
      
      <PremiumModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feature={feature}
        description={description}
      />
    </>
  );
};

export default PremiumGateClickable;
