import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

// Relance manuelle « 1 clic » d'un acompte : envoie le message (pré-rédigé, modifiable) aux personnes invitées sur le mariage.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authHeader = req.headers.get('Authorization') || '';
    const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: 'unauthorized' }, 401);

    const { weddingId, subject, message } = await req.json();
    if (typeof weddingId !== 'string' || typeof message !== 'string' || !message.trim() || message.length > 5000) return json({ error: 'invalid_input' }, 400);
    const safeSubject = String(subject || 'Rappel acompte').slice(0, 200);

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: wedding } = await admin.from('weddings').select('owner_id').eq('id', weddingId).maybeSingle();
    if (!wedding) return json({ error: 'not_found' }, 404);
    const { data: collaborators } = await admin.from('wedding_collaborators').select('user_id, invited_email').eq('wedding_id', weddingId).eq('status', 'accepted');
    const isOwner = wedding.owner_id === user.id;
    const isCollaborator = (collaborators || []).some((c: any) => c.user_id === user.id);
    if (!isOwner && !isCollaborator) return json({ error: 'forbidden' }, 403);

    const recipients = new Set<string>();
    (collaborators || []).forEach((c: any) => c.invited_email && c.user_id !== user.id && recipients.add(c.invited_email.toLowerCase()));
    if (!isOwner) {
      const { data: owner } = await admin.auth.admin.getUserById(wedding.owner_id);
      if (owner?.user?.email) recipients.add(owner.user.email.toLowerCase());
    }
    if (recipients.size === 0) return json({ error: 'no_recipients' }, 400);

    const resendKey = Deno.env.get('RESEND');
    if (!resendKey) return json({ error: 'email_not_configured' }, 500);
    const html = `<div style="font-family:Georgia,serif;background:#F8F5EF;padding:24px;color:#1a1a1a;white-space:pre-line">${escapeHtml(message)}<p style="color:#666;font-size:13px;margin-top:24px">Envoyé via Mariable</p></div>`;
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Mariable <noreply@mariable.fr>', to: [...recipients], reply_to: user.email, subject: safeSubject, html }),
    });
    if (!response.ok) {
      console.error('❌ resend failed', await response.text());
      return json({ error: 'send_failed' }, 502);
    }
    return json({ sent: recipients.size });
  } catch (error) {
    console.error('❌ send-deposit-reminder failed:', error);
    return json({ error: 'server_error' }, 500);
  }
});
