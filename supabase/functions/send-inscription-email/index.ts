
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailPayload {
  to: string;
  subject: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  date: string;
}

serve(async (req) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const { to, subject, firstName, lastName, email, userType, date } = payload;

    // Configuration du client SMTP
    const client = new SmtpClient();

    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOSTNAME') || '',
      port: Number(Deno.env.get('SMTP_PORT')) || 587,
      username: Deno.env.get('SMTP_USERNAME') || '',
      password: Deno.env.get('SMTP_PASSWORD') || '',
    });

    // Construction du contenu de l'email
    const content = `
      <h2>Nouvelle inscription sur Mariable</h2>
      <p>Un nouvel utilisateur vient de s'inscrire :</p>
      <ul>
        <li><strong>Nom :</strong> ${lastName}</li>
        <li><strong>Prénom :</strong> ${firstName}</li>
        <li><strong>Email :</strong> ${email}</li>
        <li><strong>Type d'utilisateur :</strong> ${userType}</li>
        <li><strong>Date d'inscription :</strong> ${date}</li>
      </ul>
    `;

    // Envoi de l'email
    await client.send({
      from: Deno.env.get('EMAIL_FROM') || 'notifications@mariable.fr',
      to: to,
      subject: subject,
      html: content,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
