import { supabase } from '@/integrations/supabase/client';

const UPGRADE_EMAIL = 'mathilde@mariable.fr';

/** Ouvre la messagerie avec une demande de passage à Mariable Pro préremplie. */
export const openProUpgradeMail = async (isEnglish: boolean) => {
  let accountEmail = '';
  let fullName = '';
  let companyName = '';
  try {
    const { data: { user } } = await supabase.auth.getUser();
    accountEmail = user?.email ?? '';
    if (user) {
      const { data } = await (supabase as any)
        .from('profiles')
        .select('first_name, last_name, company_name')
        .eq('id', user.id)
        .maybeSingle();
      fullName = [data?.first_name, data?.last_name].filter(Boolean).join(' ');
      companyName = data?.company_name ?? '';
    }
  } catch (error) {
    console.error('❌ openProUpgradeMail: profil illisible', error);
  }

  const subject = isEnglish
    ? `Mariable Pro activation request (€149/year)${companyName ? ` — ${companyName}` : ''}`
    : `Demande d'activation Mariable Pro (149€/an)${companyName ? ` — ${companyName}` : ''}`;
  const body = isEnglish
    ? `Hello Mathilde,\n\nI would like to upgrade my account to Mariable Pro (€149/year).\n\nName: ${fullName}\nCompany: ${companyName}\nAccount email: ${accountEmail}\n\nThank you!`
    : `Bonjour Mathilde,\n\nJe souhaite passer mon compte en Mariable Pro (149€/an).\n\nNom : ${fullName}\nSociété : ${companyName}\nEmail du compte : ${accountEmail}\n\nMerci !`;

  window.location.href = `mailto:${UPGRADE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
