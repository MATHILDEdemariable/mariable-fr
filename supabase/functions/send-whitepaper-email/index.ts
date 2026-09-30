import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';

const NOTION_URL = 'https://wary-grease-34e.notion.site/Livre-blanc-l-IA-pour-les-Wedding-Planners-3eb894d36ac481e3a65dde6c3659a78a';
const PDF_URL = 'https://mariable.fr/__l5e/assets-v1/03788ddd-359f-45ef-89cc-34196952ad81/playbook-ia-wedding-planner.pdf';

const BodySchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
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
    const { fullName, email, language } = parsed.data;
    const isEnglish = language === 'en';
    const name = escapeHtml(fullName);
    const button = (href: string, label: string, dark: boolean) =>
      `<a href="${href}" style="display:inline-block;padding:14px 24px;margin:6px 6px 6px 0;text-decoration:none;letter-spacing:1px;font-size:13px;${dark ? 'background:#111;color:#fff' : 'border:1px solid #111;color:#111'}">${label}</a>`;

    const html = `
<div style="background:#F8F5EF;padding:40px 16px;font-family:Arial,sans-serif;color:#111">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:40px">
    <p style="letter-spacing:3px;font-size:11px;color:#63745A;margin:0 0 12px">${isEnglish ? 'WHITE PAPER' : 'LIVRE BLANC'}</p>
    <h1 style="font-family:Georgia,serif;font-weight:400;font-size:28px;margin:0 0 20px">${isEnglish ? `Here is your AI Playbook, ${name}` : `Voici votre Playbook IA, ${name}`}</h1>
    <p style="line-height:1.6">${isEnglish ? 'The AI Playbook for Wedding Planners (in French): a 4-step method, 6 real use cases and 11 ready-to-use prompts.' : "Le Playbook IA du Wedding Planner : une méthode en 4 étapes, 6 cas d'usage réels et 11 prompts prêts à copier-coller."}</p>
    <p style="margin:24px 0">${button(NOTION_URL, isEnglish ? 'READ ONLINE' : 'LIRE EN LIGNE', true)}${button(PDF_URL, isEnglish ? 'DOWNLOAD PDF' : 'TÉLÉCHARGER LE PDF', false)}</p>
    <p style="line-height:1.6">${isEnglish ? 'For the wedding day itself, try Mariable Pro:' : 'Pour le jour J, découvrez Mariable Pro :'} <a href="https://mariable.fr/logiciel-wedding-planner" style="color:#63745A">mariable.fr/logiciel-wedding-planner</a></p>
    <p style="line-height:1.6">${isEnglish ? 'Enjoy,' : 'Bonne lecture,'}<br/><span style="color:#63745A">Mathilde de Mariable</span></p>
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
        subject: isEnglish ? 'Your AI Playbook for Wedding Planners' : 'Votre Playbook IA du Wedding Planner',
        html,
      }),
    });
    const responseText = await response.text();
    if (!response.ok) {
      console.error(`❌ Resend failed [${response.status}]: ${responseText}`);
      return new Response(JSON.stringify({ error: 'Email failed' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log('✅ whitepaper email sent');
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('❌ send-whitepaper-email failed:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
