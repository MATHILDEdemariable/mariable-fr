
import { useMemo } from 'react';

export type UserStatus = 'premium' | 'expired' | 'free';

interface UserProfile {
  subscription_type?: string;
  subscription_expires_at?: string;
}

export const useUserStatus = (profile: UserProfile | null | undefined) => {
  return useMemo(() => {
    if (!profile) return 'free';
    
    const subscriptionType = profile.subscription_type;
    const expiresAt = profile.subscription_expires_at;
    
    if (subscriptionType === 'premium') {
      if (!expiresAt) return 'premium'; // No expiration = permanent premium
      
      const expirationDate = new Date(expiresAt);
      const now = new Date();
      
      if (expirationDate > now) {
        return 'premium';
      } else {
        return 'expired';
      }
    }
    
    return 'free';
  }, [profile]);
};

export const getStatusBadgeProps = (status: UserStatus) => {
  switch (status) {
    case 'premium':
      return {
        variant: 'default' as const,
        className: 'bg-green-500 text-white hover:bg-green-600',
        text: 'Premium'
      };
    case 'expired':
      return {
        variant: 'secondary' as const,
        className: 'bg-orange-500 text-white hover:bg-orange-600',
        text: 'Expiré'
      };
    case 'free':
    default:
      return {
        variant: 'secondary' as const,
        className: 'bg-gray-500 text-white hover:bg-gray-600',
        text: 'Gratuit'
      };
  }
};
