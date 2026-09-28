import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';

const BodySchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  jobTitle: z.string().trim().min(1).max(100),
  language: z.enum(['fr', 'en']).default('fr'),
});

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { fullName, email, jobTitle, language } = parsed.data;
    const isEnglish = language === 'en';
    const name = escapeHtml(fullName);
    const job = escapeHtml(jobTitle);

    const subject = isEnglish
      ? "You're registered! Mariable Pro live demo — Thu Oct 1, 2:30 pm"
      : 'Vous êtes bien inscrit ! Démo live Mariable Pro — jeudi 1er octobre, 14h30';
    const html = `
<div style="background:#F8F5EF;padding:40px 16px;font-family:Arial,sans-serif;color:#111">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:40px">
    <p style="letter-spacing:3px;font-size:11px;color:#63745A;margin:0 0 12px">${isEnglish ? 'LIVE · PRO DEMO' : 'LIVE · DÉMO PRO'}</p>
    <h1 style="font-family:Georgia,serif;font-weight:400;font-size:28px;margin:0 0 20px">${isEnglish ? `You're registered, ${name}!` : `Vous êtes bien inscrit, ${name} !`}</h1>
    <p style="line-height:1.6">${isEnglish ? 'You will receive the link on the day of the event.' : 'Vous recevrez le lien de connexion le jour J.'}</p>
    <div style="border-left:3px solid #63745A;padding:12px 16px;margin:24px 0;background:#F8F5EF">
      <strong>${isEnglish ? 'Thursday, October 1 · 2:30 pm (Paris) · 40 min · online' : 'Jeudi 1er octobre · 14h30 · 40 min · en ligne'}</strong><br/>
      ${isEnglish ? '20 min live demo of the Mariable Pro app + 20 min Q&amp;A between pros' : "20 min de démo de l'appli Mariable Pro + 20 min de questions-réponses entre pros"}
    </div>
    <p style="line-height:1.6">${isEnglish ? 'See you soon,' : 'À très vite,'}<br/><span style="color:#63745A">Mathilde de Mariable</span></p>
  </div>
</div>`;

    const resendApiKey = Deno.env.get('RESEND');
    if (!resendApiKey) throw new Error('RESEND secret missing');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
      body: JSON.stringify({
        from: 'Mariable <mathilde@mariable.fr>',
        to: [email],
        bcc: ['mathilde@mariable.fr'],
        subject,
        html: html + `<p style="display:none">${job}</p>`,
      }),
    });
    const responseText = await response.text();
    if (!response.ok) {
      console.error(`❌ Resend failed [${response.status}]: ${responseText}`);
      return new Response(JSON.stringify({ error: 'Email failed', status: response.status }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log('✅ demo registration email sent');
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ send-demo-registration-email failed:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
