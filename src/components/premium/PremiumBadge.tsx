import React from 'react';
import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';

const PremiumBadge: React.FC = () => {
  const { isPremium, loading } = useUserProfile();

  if (loading || !isPremium) {
    return null;
  }

  return (
    <Badge variant="secondary" className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <Crown className="h-3 w-3 mr-1" />
      Premium
    </Badge>
  );
};

export default PremiumBadge;