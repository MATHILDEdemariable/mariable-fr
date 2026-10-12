// Envoie une invitation de collaboration (bilingue FR/EN)
// - role 'couple'  : le wedding planner invite les mariés (to = mariés, cc = planner, bcc = Mariable)
// - role 'planner' : les mariés invitent leur wedding planner (to = planner, cc = mariés, bcc = Mariable)
import { createClient } from 'npm:@supabase/supabase-js@2';
import { Resend } from 'npm:resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const MARIABLE_BCC_EMAIL = 'mathilde@mariable.fr';
const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

const paragraph = (text: string) => `<p style="font-size:16px; line-height:1.6;">${text}</p>`;
const box = (title: string, text: string, color = '#63745A') =>
  `<div style="border-left:4px solid ${color}; background:#fff; padding:12px 16px; margin:16px 0;"><p style="margin:0 0 6px; font-weight:bold;">${title}</p><p style="margin:0; font-size:15px; line-height:1.6;">${text}</p></div>`;

const buildCoupleInviteHtml = (inviter: string, wedding: string, email: string, link: string) => `
  <h1 style="font-size:24px; margin:0 0 16px;">${inviter} vous invite sur Mariable</h1>
  ${paragraph('Bonjour,')}
  ${paragraph(`${inviter}, votre wedding planner, vous invite à co-piloter l'organisation de <strong>${wedding}</strong> sur l'app Mariable : invités et RSVP, plan de table, budget et boissons. Le planning du Jour J reste géré par votre wedding planner, en consultation.`)}
  ${box('Vous n’avez pas encore de compte Mariable ?', `Cliquez sur le bouton ci-dessous et créez votre compte gratuitement avec cette adresse email (${email}). Vous arriverez directement dans l'espace préparé par votre wedding planner.`)}
  ${box('Vous avez déjà un compte avec des informations saisies ?', `<strong>N’acceptez pas cette invitation</strong> : votre tableau de bord basculerait sur le mariage de votre wedding planner, sans vos données (budget, planning Jour J, invités). Connectez-vous plutôt à votre compte et <strong>invitez vous-même votre wedding planner</strong> depuis votre tableau de bord : il aura accès à tout ce que vous avez déjà saisi.`, '#B45309')}
  <p style="text-align:center; margin:32px 0;"><a href="${link}" style="background:#63745A; color:#fff; padding:14px 28px; text-decoration:none; font-size:16px;">Créer mon compte / me connecter</a></p>
  <hr style="border:none; border-top:1px solid #ddd; margin:32px 0;" />
  <h2 style="font-size:20px; margin:0 0 12px;">${inviter} invites you to Mariable</h2>
  ${paragraph(`${inviter}, your wedding planner, invites you to co-organise <strong>${wedding}</strong> on the Mariable app: guests and RSVP, seating plan, budget and drinks. The wedding-day schedule stays managed by your planner, view-only for you.`)}
  ${box('No Mariable account yet?', `Click the button and create your free account with this email address (${email}). You will land directly in the space prepared by your planner.`)}
  ${box('Already have an account with your own data?', `<strong>Please do not accept this invitation</strong>: your dashboard would switch to your planner's wedding, without your data. Instead, log in and <strong>invite your wedding planner yourself</strong> from your dashboard so they can access everything you have already entered.`, '#B45309')}
  <p style="text-align:center; margin:32px 0;"><a href="${link}" style="background:#63745A; color:#fff; padding:14px 28px; text-decoration:none; font-size:16px;">Create my account / log in</a></p>`;

const buildPlannerInviteHtml = (inviter: string, wedding: string, email: string, link: string) => `
  <h1 style="font-size:24px; margin:0 0 16px;">${inviter} vous invite à coordonner leur mariage sur Mariable</h1>
  ${paragraph('Bonjour,')}
  ${paragraph(`${inviter} vous donne accès à <strong>${wedding}</strong> sur l'app Mariable, avec tout ce qu'ils ont déjà préparé : budget, planning du Jour J, invités, plan de table.`)}
  ${paragraph(`Connectez-vous à votre compte professionnel avec cette adresse email (${email}) : une invitation à accepter s'affichera sur votre tableau de bord. Pas encore de compte ? Créez-le gratuitement.`)}
  <p style="text-align:center; margin:32px 0;"><a href="${link}" style="background:#63745A; color:#fff; padding:14px 28px; text-decoration:none; font-size:16px;">Accéder au mariage</a></p>
  <hr style="border:none; border-top:1px solid #ddd; margin:32px 0;" />
  <h2 style="font-size:20px; margin:0 0 12px;">${inviter} invites you to coordinate their wedding on Mariable</h2>
  ${paragraph(`${inviter} gives you access to <strong>${wedding}</strong> on the Mariable app, with everything they have already prepared: budget, wedding-day schedule, guests, seating plan.`)}
  ${paragraph(`Log in to your professional account with this email address (${email}): an invitation to accept will appear on your dashboard. No account yet? Create one for free.`)}
  <p style="text-align:center; margin:32px 0;"><a href="${link}" style="background:#63745A; color:#fff; padding:14px 28px; text-decoration:none; font-size:16px;">Open the wedding</a></p>`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return jsonResponse({ error: 'Non authentifié' }, 401);

    const { invitationId } = await req.json();
    if (typeof invitationId !== 'string' || !/^[0-9a-f-]{36}$/i.test(invitationId)) {
      return jsonResponse({ error: 'invitationId invalide' }, 400);
    }

    const admin = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: invitation, error } = await admin
      .from('wedding_collaborators')
      .select('invited_email, invited_by, role, wedding_id, weddings(title)')
      .eq('id', invitationId)
      .maybeSingle();
    if (error || !invitation) return jsonResponse({ error: 'Invitation introuvable' }, 404);
    if (invitation.invited_by !== user.id) return jsonResponse({ error: 'Action non autorisée' }, 403);

    const isPlannerInvite = invitation.role === 'planner';
    const { data: profile } = await admin.from('profiles').select('first_name, last_name').eq('id', user.id).maybeSingle();
    const inviterName = escapeHtml(
      [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || (isPlannerInvite ? 'Vos mariés' : 'Votre wedding planner')
    );
    const weddingTitle = escapeHtml((invitation as any).weddings?.title || 'votre mariage');
    const invitedEmail = escapeHtml(invitation.invited_email);
    const joinLink = `https://mariable.fr/auth?email=${encodeURIComponent(invitation.invited_email)}`;

    const body = isPlannerInvite
      ? buildPlannerInviteHtml(inviterName, weddingTitle, invitedEmail, joinLink)
      : buildCoupleInviteHtml(inviterName, weddingTitle, invitedEmail, joinLink);
    const html = `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background:#F8F5EF; color:#1a1a1a;">${body}<p style="font-size:14px; color:#555;">L'équipe Mariable · The Mariable team</p></div>`;

    const resend = new Resend(Deno.env.get('RESEND')!);
    const ccEmails = user.email && user.email.toLowerCase() !== invitation.invited_email.toLowerCase() ? [user.email] : [];
    const plainName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ');
    const subject = isPlannerInvite
      ? `${plainName || 'Vos mariés'} vous invitent à coordonner leur mariage sur Mariable`
      : `${plainName || 'Votre wedding planner'} vous invite à organiser votre mariage sur Mariable`;
    const result = await resend.emails.send({
      from: 'Mariable <noreply@mariable.fr>',
      to: [invitation.invited_email],
      cc: ccEmails,
      bcc: [MARIABLE_BCC_EMAIL],
      reply_to: user.email ?? undefined,
      subject,
      html,
    });
    if ((result as any).error) {
      console.error('❌ Resend error:', (result as any).error);
      return jsonResponse({ error: 'Envoi de l’email impossible' }, 502);
    }
    console.log('✅ send-couple-collaboration-invite sent', invitationId, invitation.role);
    return jsonResponse({ sent: true });
  } catch (error) {
    console.error('❌ send-couple-collaboration-invite failed:', error);
    return jsonResponse({ error: (error as Error).message }, 500);
  }
});
