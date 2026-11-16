import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { Resend } from 'npm:resend@2.0.0';

// Séquence d'emails d'onboarding Pro (FR + EN dans chaque mail), lancée chaque jour par pg_cron.
// Chaque étape part une seule fois, suivie dans profiles.pro_onboarding_sequence.
const SITE = 'https://mariable.fr';
type Email = { day: number; key: string; subjectFr: string; subjectEn: string; fr: string; en: string; tipFr?: string; tipEn?: string; ctaFr: string; ctaEn: string; url: string; skipIfPaid?: boolean };

const SEQUENCE: Email[] = [
  { day: 3, key: 'm1', subjectFr: 'Vos premiers pas sur Mariable Pro : 4 courtes vidéos pour démarrer', subjectEn: 'Getting started with Mariable Pro: 4 short videos',
    fr: "<p>Nous espérons que vous prenez bien vos marques dans votre espace pro.</p><p>Pour vous faire gagner du temps dès cette semaine, nous vous avons préparé <strong>4 courtes vidéos de 5 minutes</strong> : création d'un mariage, rétroplanning, collaboration avec vos couples et conduite du Jour J.</p>",
    en: "<p>We hope you are settling into your Pro workspace.</p><p>To save you time this week, we prepared <strong>4 short 5-minute videos</strong>: creating a wedding, the timeline, collaborating with couples and running the wedding day.</p>",
    ctaFr: 'Voir les 4 vidéos', ctaEn: 'Watch the 4 videos', url: `${SITE}/pro` },
  { day: 7, key: 'm2', subjectFr: 'Structurer votre saison sans y passer vos soirées', subjectEn: 'Organise your wedding season effortlessly',
    fr: "<p>Chaque mariage dispose d'un rétroplanning prérempli selon sa date. Assignez des responsables, masquez certaines tâches à vos mariés et suivez l'avancement d'un coup d'œil.</p>",
    en: "<p>Every wedding comes with a timeline prefilled from its date. Assign owners, hide some tasks from couples and track progress at a glance.</p>",
    tipFr: "La vue Kanban (par colonne, en statut) pour mieux visualiser les tâches à faire (ou celles déjà faites : oui, ça fait du bien).",
    tipEn: "The Kanban view (columns by status) to better see what's left to do (or what's already done: yes, it feels good).",
    ctaFr: 'Ouvrir mon rétroplanning', ctaEn: 'Open my timeline', url: `${SITE}/pro` },
  { day: 15, key: 'mid', skipIfPaid: true, subjectFr: 'Déjà 2 semaines : qu\'avez-vous pensé de Mariable ?', subjectEn: '2 weeks in: what do you think of Mariable?',
    fr: "<p>Cela fait deux semaines que vous avez rejoint Mariable. Votre avis d'expert nous est précieux : qu'avez-vous pensé de l'outil jusqu'ici ? Une fonctionnalité vous a manqué ? Répondez simplement à cet email.</p><p>Il vous reste encore 15 jours d'essai complet.</p>",
    en: "<p>It's been two weeks since you joined Mariable. Your expert feedback matters: what do you think so far? Anything missing? Just reply to this email.</p><p>You still have 15 days of full trial access.</p>",
    ctaFr: 'Me connecter', ctaEn: 'Log in', url: `${SITE}/pro` },
  { day: 18, key: 'm3', subjectFr: 'Collaborez avec vos mariés, sans échanges interminables', subjectEn: 'Collaborate with your couples, without endless back-and-forth',
    fr: "<p>Invitez vos mariés sur leur mariage : ils complètent eux-mêmes invités, RSVP, budget et hébergements, et vous gardez la main sur le reste.</p>",
    en: "<p>Invite your couples to their wedding: they fill in guests, RSVPs, budget and accommodation themselves, while you keep control of the rest.</p>",
    ctaFr: 'Inviter mes mariés', ctaEn: 'Invite my couple', url: `${SITE}/pro` },
  { day: 23, key: 'm4', subjectFr: 'Plan de table & régimes alimentaires : gagnez des heures', subjectEn: 'Seating plan & dietary needs: save hours',
    fr: "<p>Le plan de table est souvent un moment long dans les préparatifs. Sur Mariable, vous créez votre plan de table facilement directement sur la plateforme : les régimes de vos invités apparaissent avec des pastilles de couleur sur chaque table.</p>",
    en: "<p>The seating plan is often a long part of wedding prep. On Mariable, you build it easily right on the platform: guests' dietary needs show up as colour badges on each table.</p>",
    tipFr: "N'oubliez pas l'export 3 en 1 du plan de table (plan visuel, liste alphabétique des invités et récapitulatif traiteur).",
    tipEn: "Don't forget the 3-in-1 seating plan export (visual map, alphabetical guest list and caterer summary).",
    ctaFr: 'Essayer le plan de table', ctaEn: 'Try the seating plan', url: `${SITE}/pro` },
  { day: 27, key: 'm5', subjectFr: 'Le Jour J dans votre poche (et partagé à toute votre équipe)', subjectEn: 'The wedding day in your pocket (shared with your whole team)',
    fr: "<p>Le Cockpit Jour J rassemble le conducteur heure par heure, les contacts prestataires, les boissons et le trombinoscope. Partagez un lien à chaque membre de l'équipe, sans compte ni application à installer.</p>",
    en: "<p>The Day-of Cockpit gathers the hour-by-hour run sheet, vendor contacts, drinks and key people. Share a link with each team member, no account or app needed.</p>",
    tipFr: "L'export PDF pour conserver une version papier si jamais (plus de batterie, pas internet).",
    tipEn: "The PDF export to keep a paper copy just in case (dead battery, no internet).",
    ctaFr: 'Découvrir le Cockpit Jour J', ctaEn: 'Discover the Day-of Cockpit', url: `${SITE}/pro` },
  { day: 30, key: 'end', skipIfPaid: true, subjectFr: 'Votre période d\'essai est terminée · Vos données sont préservées', subjectEn: 'Your trial has ended · Your data is safe',
    fr: "<p>Votre essai d'1 mois sur Mariable est arrivé à son terme. Vos mariages, rétroplannings et contacts sont <strong>gardés intacts</strong> : souscrivez pour tout retrouver instantanément (dès 16 €/mois, sans engagement).</p>",
    en: "<p>Your 1-month Mariable trial has ended. Your weddings, timelines and contacts are <strong>kept intact</strong>: subscribe to unlock everything instantly (from 16 €/month, no commitment).</p>",
    ctaFr: 'Débloquer mon compte Pro', ctaEn: 'Unlock my Pro account', url: `${SITE}/pro-solutions#tarifs` },
  { day: 35, key: 'm6', skipIfPaid: true, subjectFr: 'Votre avis compte : 30 secondes pour nous aider', subjectEn: 'Your opinion matters: 30 seconds to help us',
    fr: "<p>Votre période d'essai est terminée. Vous n'avez pas souscrit, mais nous serions très curieux d'avoir votre avis, dans un souci d'amélioration continue.</p><p>Une note en étoiles, un commentaire si vous le souhaitez : c'est tout.</p>",
    en: "<p>Your trial has ended. You haven't subscribed, but we'd love to hear your thoughts to keep improving.</p><p>A star rating, and a comment if you wish: that's all.</p>",
    ctaFr: 'Donner mon avis', ctaEn: 'Give my feedback', url: `${SITE}/pro-feedback` },
];

const button = (url: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;"><tr><td bgcolor="#63745A"><a href="${url}" style="display:inline-block;background:#63745A;color:#ffffff !important;padding:14px 28px;text-decoration:none;font-family:'Playfair Display',Georgia,serif;font-size:15px;"><span style="color:#ffffff;">${label}</span></a></td></tr></table>`;
const tipBlock = (label: string, tip?: string) => tip
  ? `<div style="background:#F8F5EF;border-left:3px solid #63745A;padding:14px 16px;margin:20px 0;font-size:14px;">💡 <strong>${label}</strong> ${tip}</div>` : '';

const escapeHtml = (v: string) => v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export const buildOnboardingEmail = (email: Email, firstName: string) => {
  const name = escapeHtml(firstName);
  const html = `<div style="background:#F8F5EF;padding:32px 12px;font-family:'Playfair Display',Georgia,serif;color:#1a1a1a;">
<div style="max-width:580px;margin:0 auto;background:#ffffff;border:1px solid #e8e2d5;padding:36px 28px;line-height:1.7;font-size:15px;">
<div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#63745A;margin-bottom:20px;">Mariable Pro</div>
<h1 style="font-size:22px;font-weight:normal;margin:0 0 16px;">${email.subjectFr}</h1>
<p>Bonjour${name ? ' ' + name : ''},</p>${email.fr}${tipBlock('Le tip du jour :', email.tipFr)}${button(`${email.url}`, email.ctaFr)}
<p>Une question ? Répondez simplement à cet email.<br/><strong>Mathilde de Mariable</strong></p>
<hr style="border:none;border-top:1px solid #d8d2c4;margin:32px 0;"/>
<div style="color:#444;font-size:14px;"><h2 style="font-size:18px;font-weight:normal;margin:0 0 12px;">${email.subjectEn}</h2>
<p>Hello${name ? ' ' + name : ''},</p>${email.en}${tipBlock('Tip of the day:', email.tipEn)}${button(`${email.url}${email.url.includes('pro-feedback') ? '?lang=en' : ''}`, email.ctaEn)}
<p>Any question? Just reply to this email.<br/><strong>Mathilde from Mariable</strong></p></div>
</div></div>`;
  return { subject: `${email.subjectFr} · ${email.subjectEn}`, html };
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  console.log('🚀 pro-onboarding-sequence started');
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const resend = new Resend(Deno.env.get('RESEND')!);
    const since = new Date(Date.now() - 40 * 86400000).toISOString();
    const { data: profiles, error } = await supabase.from('profiles')
      .select('id, first_name, created_at, subscription_type, subscription_expires_at, pro_onboarding_sequence, pro_trial_reminders')
      .eq('account_type', 'b2b').gte('created_at', since);
    if (error) throw error;

    let sent = 0;
    for (const profile of profiles || []) {
      const days = Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 86400000);
      const history = { ...((profile.pro_onboarding_sequence || {}) as Record<string, string>) };
      // Ne pas renvoyer ce que l'ancien système d'essai a déjà envoyé
      const trial = (profile.pro_trial_reminders || {}) as Record<string, string>;
      if (trial.m1 && !history.mid) history.mid = trial.m1;
      if (trial.expired && !history.end) history.end = trial.expired;
      // Dernière étape due et pas encore envoyée (les étapes plus anciennes sont sautées, pas de rafale)
      const due = [...SEQUENCE].reverse().find((e) => days >= e.day);
      if (!due || history[due.key]) continue;
      const isPaid = ['pro_premium', 'pro_jour_j'].includes(profile.subscription_type || '') &&
        (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());
      const now = new Date().toISOString();
      const updated = { ...history };
      for (const e of SEQUENCE) if (e.day <= due.day) updated[e.key] = updated[e.key] || now;
      if (!(due.skipIfPaid && isPaid)) {
        const { data: userData } = await supabase.auth.admin.getUserById(profile.id);
        const to = userData?.user?.email;
        if (!to) continue;
        const { subject, html } = buildOnboardingEmail(due, (profile.first_name || '').slice(0, 80));
        const { error: sendError } = await resend.emails.send({ from: 'Mathilde de Mariable <noreply@mariable.fr>', reply_to: 'mathilde@mariable.fr', to: [to], bcc: ['mathilde@mariable.fr'], subject, html });
        if (sendError) { console.error('❌ send failed', profile.id, sendError); continue; }
        sent++;
      }
      await supabase.from('profiles').update({ pro_onboarding_sequence: updated }).eq('id', profile.id);
    }
    console.log('✅ pro-onboarding-sequence done', { sent });
    return new Response(JSON.stringify({ sent }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('❌ pro-onboarding-sequence failed', error);
    return new Response(JSON.stringify({ error: 'Échec de la séquence' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
