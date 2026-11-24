import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Crown, MessageCircle, Mail } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProPricingPlans from '@/components/pro/ProPricingPlans';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getProTrialDaysLeft } from '@/lib/proTrial';

const Abonnement: React.FC = () => {
  const { i18n } = useTranslation('pro');
  const isEnglish = !!i18n.language?.startsWith('en');
  const tr = (frText: string, enText: string) => (isEnglish ? enText : frText);
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ created_at: string | null; subscription_type: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('created_at, subscription_type').eq('id', user.id).maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('❌ Abonnement: profile load failed', error);
        setProfile((data as any) ?? null);
      });
  }, [user]);

  const subscriptionType = profile?.subscription_type ?? '';
  const isSubscribed = subscriptionType === 'pro_premium' || subscriptionType === 'pro_jour_j';
  const daysLeft = profile?.created_at ? getProTrialDaysLeft(profile.created_at) : null;

  let statusText = '';
  if (isSubscribed) statusText = subscriptionType === 'pro_premium' ? tr('Formule active : Organisation complète', 'Active plan: Full organisation') : tr('Formule active : Coordination Jour J', 'Active plan: Wedding-day coordination');
  else if (daysLeft !== null && daysLeft > 0) statusText = tr(`Période d'essai active — encore ${daysLeft} jour(s)`, `Trial active — ${daysLeft} day(s) left`);
  else if (daysLeft !== null) statusText = tr("Votre période d'essai est terminée", 'Your trial has ended');

  const mailSubject = encodeURIComponent(tr('Abonnement Mariable Pro sur facture', 'Mariable Pro subscription by invoice'));
  const mailBody = encodeURIComponent(tr(`Bonjour Mathilde,\n\nJe souhaite souscrire à l'abonnement Mariable Pro avec règlement sur facture / virement.\nCompte : ${user?.email ?? ''}\nFormule souhaitée : \n\nMerci !`, `Hello Mathilde,\n\nI'd like to subscribe to Mariable Pro and pay by invoice / bank transfer.\nAccount: ${user?.email ?? ''}\nPlan: \n\nThanks!`));

  return (
    <DashboardLayout>
      <Helmet><title>{tr('Mon abonnement Pro | Mariable', 'My Pro subscription | Mariable')}</title><meta name="robots" content="noindex" /></Helmet>
      <section className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="font-serif text-3xl flex items-center gap-2"><Crown className="h-6 w-6 text-wedding-olive" />{tr('Mon abonnement', 'My subscription')}</h1>
          {statusText && <p className="mt-3 inline-block border border-wedding-olive bg-wedding-olive/10 px-3 py-1 text-sm">{statusText}</p>}
        </div>

        <ProPricingPlans isEnglish={isEnglish} />

        <div className="border border-border bg-card p-6 space-y-3">
          <h2 className="font-serif text-xl">{tr('Vous préférez régler sur facture ou par virement ?', 'Prefer to pay by invoice or bank transfer?')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tr("Pour l'abonnement annuel avec facture d'entreprise et règlement par virement, contactez directement Mathilde. Nous générons votre facture et activons votre compte rapidement.", 'For an annual plan with a company invoice and bank-transfer payment, contact Mathilde directly. We issue your invoice and activate your account quickly.')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-none"><a href={`mailto:mathilde@mariable.fr?subject=${mailSubject}&body=${mailBody}`}><Mail className="h-4 w-4 mr-2" />{tr('Demander une facture', 'Request an invoice')}</a></Button>
            <Button asChild variant="outline" className="rounded-none"><a href="https://wa.me/33760108189" target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4 mr-2" />WhatsApp · 07 60 10 81 89</a></Button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Abonnement;
