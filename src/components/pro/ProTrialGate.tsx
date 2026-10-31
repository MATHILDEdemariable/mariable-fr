import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getProTrialDaysLeft } from '@/lib/proTrial';

/** Grise l'espace pro quand l'essai de 2 mois est terminé sans abonnement Pro. Les données restent intactes. */
const ProTrialGate = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const { user } = useAuth();
  const { isProPremium, isProAccount, loading } = useUserProfile();
  const [signupDate, setSignupDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('created_at').eq('id', user.id).maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('❌ ProTrialGate: profile load failed', error);
        setSignupDate(data?.created_at ?? null);
      });
  }, [user]);

  if (loading || !signupDate || !isProAccount || isProPremium) return <>{children}</>;

  const daysLeft = getProTrialDaysLeft(signupDate);
  const pricingUrl = '/pro-solutions#tarifs';

  if (daysLeft > 0) {
    if (daysLeft > 14) return <>{children}</>;
    return (
      <>
        <div className="max-w-5xl mx-auto mb-6 border border-wedding-olive bg-wedding-olive/10 p-4 text-sm flex flex-wrap items-center justify-between gap-3" role="status">
          <span>{isEnglish ? `Your free Pro trial ends in ${daysLeft} day(s).` : `Votre essai Pro gratuit se termine dans ${daysLeft} jour(s).`}</span>
          <Button asChild size="sm" className="rounded-none"><a href={pricingUrl}>{isEnglish ? 'Choose my plan' : 'Choisir ma formule'}</a></Button>
        </div>
        {children}
      </>
    );
  }

  return (
    <div className="relative">
      <div className="max-w-5xl mx-auto mb-6 border border-foreground bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" role="alert">
        <div className="flex gap-3">
          <Lock className="h-5 w-5 mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm leading-relaxed">
            {isEnglish
              ? 'Your 2-month trial has ended. Your data is safely kept. Choose a Pro plan (149 € or 259 €/year) to unlock your weddings.'
              : "Votre période d'essai de 2 mois a pris fin. Vos données sont conservées en toute sécurité. Choisissez votre formule Pro (149 € ou 259 €/an) pour réactiver vos mariages."}
          </p>
        </div>
        <Button asChild className="rounded-none shrink-0"><a href={pricingUrl}>{isEnglish ? 'Unlock my account' : 'Débloquer mon compte'}</a></Button>
      </div>
      <div className="opacity-40 grayscale pointer-events-none select-none" aria-hidden="true">{children}</div>
    </div>
  );
};

export default ProTrialGate;
