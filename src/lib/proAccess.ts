// Droits d'accès Premium : qui peut utiliser les outils payants (budget, exports, IA, etc.)
// Source unique de vérité pour le calcul de isPremium, utilisé par useUserProfile.
import { isProTrialExpired } from './proTrial';

export type PremiumAccessProfile = {
  subscription_type?: string | null;
  account_type?: string | null;
  subscription_expires_at?: string | null;
  created_at?: string | null;
};

export type PremiumAccess = {
  isSubscriptionActive: boolean;
  isProAccount: boolean;
  isProOrganisation: boolean;
  isProJourJ: boolean;
  isProPremium: boolean;
  isProTrialActive: boolean;
  isPremium: boolean;
};

// Abonnés Pro : 'pro_premium' = Organisation complète, 'pro_jour_j' = Coordination Jour J
// isProPremium = pro abonné (l'une ou l'autre formule)
// Essai Pro de 30 jours : mêmes droits qu'un abonné tant que l'essai court
export const getPremiumAccess = (
  profile: PremiumAccessProfile | null | undefined,
  now: Date = new Date(),
): PremiumAccess => {
  const isSubscriptionActive = (() => {
    if (!profile) return false;
    if (profile.subscription_expires_at === null) return true;
    return new Date(profile.subscription_expires_at as string) > now;
  })();

  const isProAccount = profile?.account_type === 'b2b';
  const isProOrganisation = profile?.subscription_type === 'pro_premium' && isSubscriptionActive;
  const isProJourJ = profile?.subscription_type === 'pro_jour_j' && isSubscriptionActive;
  const isProPremium = isProOrganisation || isProJourJ;
  const isProTrialActive =
    isProAccount && !!profile?.created_at && !isProTrialExpired(profile.created_at as string, now);

  const isPremium =
    (profile?.subscription_type === 'premium' && isSubscriptionActive) || isProPremium || isProTrialActive;

  return {
    isSubscriptionActive,
    isProAccount,
    isProOrganisation,
    isProJourJ,
    isProPremium,
    isProTrialActive,
    isPremium,
  };
};
