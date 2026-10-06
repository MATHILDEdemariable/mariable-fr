import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const UPGRADE_EMAIL = 'mathilde@mariable.fr';

/** Envoie en 1 clic une demande de passage à Mariable Pro (base + email à Mathilde). */
export const openProUpgradeMail = async (isEnglish: boolean) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const accountEmail = user?.email ?? '';
    let fullName = '';
    let companyName = '';
    if (user) {
      const { data } = await (supabase as any)
        .from('profiles')
        .select('first_name, last_name, company_name')
        .eq('id', user.id)
        .maybeSingle();
      fullName = [data?.first_name, data?.last_name].filter(Boolean).join(' ');
      companyName = data?.company_name ?? '';
    }

    const message = `Demande d'activation Mariable Pro (149€/an)\n\nNom : ${fullName}\nSociété : ${companyName}\nEmail du compte : ${accountEmail}`;

    const { error: dbError } = await supabase
      .from('contact_requests')
      .insert({ email: accountEmail || UPGRADE_EMAIL, type: 'prestataire', message, status: 'pending' } as any);
    if (dbError) throw dbError;

    const { error: emailError } = await supabase.functions.invoke('send-problem-report', {
      body: { email: accountEmail, subject: `Demande Mariable Pro${companyName ? ` — ${companyName}` : ''}`, message },
    });
    if (emailError) console.error('❌ openProUpgradeMail: email non envoyé', emailError);

    toast({
      title: isEnglish ? 'Request sent to Mathilde!' : 'Demande transmise à Mathilde !',
      description: isEnglish
        ? 'We will get back to you within 24h to activate your account.'
        : 'Nous vous recontactons sous 24h pour finaliser votre activation.',
    });
  } catch (error) {
    console.error('❌ openProUpgradeMail failed:', error);
    toast({
      title: isEnglish ? 'Sending failed' : "L'envoi a échoué",
      description: isEnglish ? `Please write to ${UPGRADE_EMAIL}` : `Écrivez-nous à ${UPGRADE_EMAIL}`,
      variant: 'destructive',
    });
  }
};
