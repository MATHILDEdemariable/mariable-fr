import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { Resend } from 'npm:resend@2.0.0';

// Relances de fin d'essai Pro (60 jours après inscription) : J-30, J-14, J-7, jour de fin. Lancé chaque jour par pg_cron.
const TRIAL_DAYS = 60;
const CALENDLY_URL = 'https://calendly.com/mathilde-mariable'; // TODO: remplacer par le lien exact
const PRICING_URL = 'https://mariable.fr/pro-solutions#tarifs';

type Step = 'm1' | 'd14' | 'd7' | 'expired';

const button = (url: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td bgcolor="#63745A"><a href="${url}" style="display:inline-block;background:#63745A;color:#ffffff;padding:14px 26px;text-decoration:none;font-family:Georgia,serif;font-weight:bold;">${label}</a></td></tr></table>`;

const wrap = (body: string) =>
  `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px;background:#F8F5EF;color:#1a1a1a;line-height:1.6;">${body}</div>`;

const buildEmail = (step: Step, lang: 'fr' | 'en', name: string) => {
  const hi = lang === 'en' ? `Hello${name ? ' ' + name : ''},` : `Bonjour${name ? ' ' + name : ''},`;
  const t = {
    m1: {
      fr: ['Vos premiers mariages sur Mariable · Déjà 1 mois !', `<p>${hi}</p><p>Cela fait maintenant un mois que vous avez rejoint Mariable pour piloter vos mariages.</p><p>Avez-vous pu tester la feuille de route du Jour J, la collaboration avec vos mariés ou les formulaires de cadrage ?</p><p>Votre avis d'expert nous est précieux : qu'avez-vous pensé de l'outil jusqu'ici ? Une fonctionnalité vous a manqué ? Répondez simplement à cet email.</p><p>Il vous reste encore 30 jours d'essai complet.</p><p>Très belle continuation,<br/><strong>Mathilde de Mariable</strong></p>`],
      en: ['Your first weddings on Mariable · 1 month in!', `<p>${hi}</p><p>It's already been a month since you joined Mariable to coordinate your weddings.</p><p>Have you explored the live wedding day schedule, couple collaboration or client onboarding forms?</p><p>Your feedback means the world to us: what do you think so far? Anything missing? Simply reply to this email.</p><p>You still have 30 days of full complimentary access.</p><p>Warm regards,<br/><strong>Mathilde from Mariable</strong></p>`],
    },
    d14: {
      fr: ['Un point de 15 min sur votre saison mariage ?', `<p>${hi}</p><p>Votre essai gratuit sur Mariable se termine dans deux semaines.</p><p>Je vous propose un court échange de 15 minutes pour adapter Mariable à votre façon de travailler, répondre à vos questions et voir comment nos offres Pro (dès 149 €/an) peuvent vous faire gagner des heures par mariage.</p>${button(CALENDLY_URL, 'Réserver 15 minutes avec Mathilde')}<p>Au plaisir d'échanger,<br/><strong>Mathilde</strong>, fondatrice de Mariable</p>`],
      en: ['Quick 15-minute check-in on your wedding season?', `<p>${hi}</p><p>Your complimentary trial on Mariable ends in two weeks.</p><p>I'd love to offer a short 15-minute call to fit Mariable to your workflow, answer your questions and show how our Pro plans (from 149 €/year) save hours on every wedding.</p>${button(CALENDLY_URL, 'Book 15 minutes with Mathilde')}<p>Looking forward to it,<br/><strong>Mathilde</strong>, founder of Mariable</p>`],
    },
    d7: {
      fr: ["[Important] Plus que 7 jours d'essai gratuit sur Mariable", `<p>${hi}</p><p>Votre essai gratuit de 2 mois prendra fin dans <strong>7 jours</strong>.</p><p>Passé cette date, vos mariages, feuilles de route Jour J et exports seront verrouillés et grisés. <strong>Aucune donnée ne sera supprimée.</strong></p>${button(PRICING_URL, 'Activer mon abonnement Pro (dès 149 €/an)')}<p>Bien à vous,<br/><strong>Mathilde de Mariable</strong></p>`],
      en: ['[Important] Only 7 days left on your Mariable trial', `<p>${hi}</p><p>Your 2-month trial ends in <strong>7 days</strong>.</p><p>After that, your weddings, Day-of timelines and exports will be locked and greyed out. <strong>None of your data will be deleted.</strong></p>${button(PRICING_URL, 'Activate my Pro plan (from 149 €/year)')}<p>Best regards,<br/><strong>Mathilde from Mariable</strong></p>`],
    },
    expired: {
      fr: ["Votre période d'essai Mariable est terminée · Vos données sont préservées", `<p>${hi}</p><p>Votre essai de 2 mois sur Mariable est arrivé à son terme aujourd'hui.</p><p>Votre espace pro est désormais grisé et la modification est suspendue. Vos mariages, rétroplannings et contacts sont <strong>gardés intacts</strong> : dès votre passage Pro, vous retrouvez tout instantanément.</p>${button(PRICING_URL, 'Débloquer mon compte Pro')}<p>Nous espérons vous revoir très vite,<br/><strong>L'équipe Mariable</strong></p>`],
      en: ['Your Mariable trial has ended · Your data is safe', `<p>${hi}</p><p>Your 2-month trial on Mariable ended today.</p><p>Your Pro workspace is now greyed out and editing is paused. All your weddings, timelines and contacts are <strong>kept intact</strong>: activate Pro and everything unlocks instantly.</p>${button(PRICING_URL, 'Unlock my Pro account')}<p>We hope to see you again soon,<br/><strong>The Mariable Team</strong></p>`],
    },
  }[step][lang];
  return { subject: t[0], html: wrap(t[1]) };
};

const stepForDaysLeft = (daysLeft: number): Step | null => {
  if (daysLeft <= 0) return 'expired';
  if (daysLeft <= 7) return 'd7';
  if (daysLeft <= 14) return 'd14';
  if (daysLeft <= 30) return 'm1';
  return null;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  console.log('🚀 pro-trial-reminders started');
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const resend = new Resend(Deno.env.get('RESEND')!);
    // Seuls les pros inscrits depuis moins de 75 jours (au-delà, le dernier email est déjà parti)
    const since = new Date(Date.now() - 75 * 86400000).toISOString();
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, first_name, preferred_language, created_at, subscription_type, subscription_expires_at, pro_trial_reminders')
      .eq('account_type', 'b2b')
      .gte('created_at', since);
    if (error) throw error;

    let sent = 0;
    for (const profile of profiles || []) {
      const isPaid = profile.subscription_type === 'pro_premium' &&
        (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());
      if (isPaid) continue;
      const daysLeft = Math.ceil((new Date(profile.created_at).getTime() + TRIAL_DAYS * 86400000 - Date.now()) / 86400000);
      const step = stepForDaysLeft(daysLeft);
      const reminders = (profile.pro_trial_reminders || {}) as Record<string, string>;
      if (!step || reminders[step]) continue;

      const { data: userData } = await supabase.auth.admin.getUserById(profile.id);
      const email = userData?.user?.email;
      if (!email) continue;
      const lang = profile.preferred_language === 'en' ? 'en' : 'fr';
      const { subject, html } = buildEmail(step, lang, (profile.first_name || '').slice(0, 80));
      const { error: sendError } = await resend.emails.send({ from: 'Mathilde de Mariable <noreply@mariable.fr>', reply_to: 'mathilde@mariable.fr', to: [email], subject, html });
      if (sendError) { console.error('❌ send failed', profile.id, sendError); continue; }
      // Les étapes antérieures non envoyées (inscription ancienne) sont marquées pour ne pas partir en rafale
      const order: Step[] = ['m1', 'd14', 'd7', 'expired'];
      const now = new Date().toISOString();
      const updated = { ...reminders };
      for (const s of order.slice(0, order.indexOf(step) + 1)) updated[s] = updated[s] || now;
      await supabase.from('profiles').update({ pro_trial_reminders: updated }).eq('id', profile.id);
      sent++;
    }
    console.log('✅ pro-trial-reminders done', { sent });
    return new Response(JSON.stringify({ sent }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('❌ pro-trial-reminders failed', error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
