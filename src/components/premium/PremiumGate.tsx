import React from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Lock } from 'lucide-react';
import StripeButton from './StripeButton';

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
}

const PremiumGate: React.FC<PremiumGateProps> = ({ 
  children, 
  feature, 
  description 
}) => {
  const { isPremium, loading } = useUserProfile();

  if (loading) {
    return <div className="animate-pulse bg-muted h-20 rounded-lg" />;
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Crown className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
          <Lock className="h-4 w-4" />
          Fonctionnalité Premium
        </h3>
        
        <p className="text-muted-foreground mb-4">
          {description || `Accédez à ${feature} avec notre abonnement premium`}
        </p>
        
        <StripeButton />
        
        <p className="text-xs text-muted-foreground mt-4">
          Paiement sécurisé via Stripe
        </p>
      </CardContent>
    </Card>
  );
};

export default PremiumGate;