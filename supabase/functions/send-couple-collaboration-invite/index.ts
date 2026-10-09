// Envoie l'invitation « mariés » : to = mariés, cc = wedding planner, bcc = Mariable
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
      .select('invited_email, invited_by, wedding_id, weddings(title)')
      .eq('id', invitationId)
      .maybeSingle();
    if (error || !invitation) return jsonResponse({ error: 'Invitation introuvable' }, 404);
    if (invitation.invited_by !== user.id) return jsonResponse({ error: 'Action non autorisée' }, 403);

    const { data: profile } = await admin.from('profiles').select('first_name, last_name').eq('id', user.id).maybeSingle();
    const plannerName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Votre wedding planner';
    const weddingTitle = (invitation as any).weddings?.title || 'votre mariage';
    const joinLink = `https://mariable.fr/auth?email=${encodeURIComponent(invitation.invited_email)}`;

    const html = `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background:#F8F5EF; color:#1a1a1a;">
  <h1 style="font-size:24px; margin:0 0 16px;">${escapeHtml(plannerName)} vous invite sur Mariable</h1>
  <p style="font-size:16px; line-height:1.6;">Bonjour,</p>
  <p style="font-size:16px; line-height:1.6;">${escapeHtml(plannerName)} vous invite à co-piloter l'organisation de <strong>${escapeHtml(weddingTitle)}</strong> sur l'app Mariable.</p>
  <p style="font-size:16px; line-height:1.6;">Vous pourrez modifier ensemble :</p>
  <ul style="font-size:16px; line-height:1.8;">
    <li>la liste des invités et les réponses RSVP</li>
    <li>le plan de table</li>
    <li>le budget</li>
    <li>les boissons</li>
  </ul>
  <p style="font-size:16px; line-height:1.6;">Le planning du Jour J reste géré par votre wedding planner, en consultation.</p>
  <p style="text-align:center; margin:32px 0;">
    <a href="${joinLink}" style="background:#63745A; color:#fff; padding:14px 28px; text-decoration:none; font-size:16px;">Rejoindre notre mariage</a>
  </p>
  <p style="font-size:14px; line-height:1.6; color:#555;">Connectez-vous ou créez votre compte avec cette adresse email (${escapeHtml(invitation.invited_email)}). Si vous avez déjà un compte, rien n'est effacé : une invitation à accepter s'affichera sur votre tableau de bord.</p>
  <p style="font-size:14px; color:#555;">L'équipe Mariable</p>
</div>`;

    const resend = new Resend(Deno.env.get('RESEND')!);
    const ccEmails = user.email && user.email.toLowerCase() !== invitation.invited_email.toLowerCase() ? [user.email] : [];
    const result = await resend.emails.send({
      from: 'Mariable <noreply@mariable.fr>',
      to: [invitation.invited_email],
      cc: ccEmails,
      bcc: [MARIABLE_BCC_EMAIL],
      reply_to: user.email ?? undefined,
      subject: `${plannerName} vous invite à organiser votre mariage sur Mariable`,
      html,
    });
    if ((result as any).error) {
      console.error('❌ Resend error:', (result as any).error);
      return jsonResponse({ error: 'Envoi de l’email impossible' }, 502);
    }
    console.log('✅ send-couple-collaboration-invite sent', invitationId);
    return jsonResponse({ sent: true });
  } catch (error) {
    console.error('❌ send-couple-collaboration-invite failed:', error);
    return jsonResponse({ error: (error as Error).message }, 500);
  }
});
