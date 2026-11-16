import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { requireUser } from '../_shared/requireUser.ts';
import { escapeEmailHtml } from '../_shared/emailSecurity.ts';
const RESEND_API_KEY = Deno.env.get('RESEND');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (_request) => {
  console.log('🚀 notifyNewContact déclenchée');
  
  // Handle CORS preflight requests
  if (_request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = await _request.json().catch(() => ({
      record: {
        id: 'inconnu',
        message: 'inconnu',
        email_client: 'inconnu',
        email_presta: 'inconnu'
      }
    }));
    
    // Destinataire et contenu relus en base : demande de l'appelant, email officiel du prestataire
    const auth = await requireUser(_request);
    if ('response' in auth) return auth.response;
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: contactRow } = await admin.from('vendors_contact_preprod')
      .select('id, message, email_client, prestataire_id').eq('id', record?.id ?? '').eq('client_id', auth.user.id).maybeSingle();
    const { data: vendor } = contactRow?.prestataire_id
      ? await admin.from('prestataires_rows').select('email').eq('id', contactRow.prestataire_id).maybeSingle()
      : { data: null };
    if (!contactRow || !vendor?.email) {
      return new Response(JSON.stringify({ error: 'Demande introuvable' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const id = contactRow.id;
    const message = contactRow.message ?? '';
    const emailClient = contactRow.email_client ?? auth.user.email ?? '';
    const emailPresta = vendor.email;
    
    console.log('Contact notification received');
    
    const bodyContent = JSON.stringify({
      "from": "Mariable <mathilde@mariable.fr>",
      "to": emailPresta,
      "bcc": [
        "mathilde@mariable.fr",
        "contact.mariable@gmail.com"
      ],
      "subject": "Demande de contact sur mariable.fr",
      "html": `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demande de contact sur mariable.fr</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@400;500&display=swap');
    
    body { 
      font-family: 'Inter', Arial, sans-serif; 
      line-height: 1.6; 
      color: #000000; 
      margin: 0; 
      padding: 0; 
      background-color: #f8f6f0; 
    }
    
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff; 
      padding: 40px; 
      border-radius: 8px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
    }
    
    .header { 
      text-align: center; 
      margin-bottom: 30px; 
    }
    
    .logo { 
      font-family: 'Playfair Display', serif; 
      font-size: 28px; 
      font-weight: 600; 
      color: #7F9474; 
      margin-bottom: 10px; 
    }
    
    .message-block { 
      background-color: #f8f6f0; 
      border-left: 4px solid #7F9474; 
      padding: 20px; 
      margin: 25px 0; 
      border-radius: 4px; 
    }
    
    .message-content { 
      background-color: #ffffff; 
      padding: 15px; 
      border-radius: 4px; 
      margin-bottom: 15px; 
      border: 1px solid #e5e5e5; 
    }
    
    .client-info { 
      color: #7F9474; 
      font-weight: 500; 
      font-size: 14px; 
    }
    
    .cta-section { 
      background-color: #7F9474; 
      color: white; 
      padding: 20px; 
      border-radius: 6px; 
      text-align: center; 
      margin: 25px 0; 
    }
    
    .cta-text { 
      font-weight: 500; 
      font-size: 16px; 
      margin: 0; 
    }
    
    .signature { 
      margin-top: 30px; 
      padding-top: 20px; 
      border-top: 1px solid #e5e5e5; 
    }
    
    .signature-name { 
      color: #7F9474; 
      font-weight: 500; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Mariable</div>
    </div>
    
    <p>Bonjour,</p>
    
    <p>Vous avez reçu le message suivant via notre site. Vous trouverez les coordonnées du client ci-dessous.</p>
    
    <div class="message-block">
      <div class="message-content">
        <strong>Message :</strong><br/>
        ${escapeEmailHtml(message)}
      </div>
      
      <div class="client-info">
        <strong>Email du Client :</strong> ${escapeEmailHtml(emailClient)}
      </div>
    </div>
    
    <div class="cta-section">
      <p class="cta-text">📧 Recontactez directement le client par email - idéalement dans les 24H</p>
    </div>
    
    <div class="signature">
      <p>N'hésitez pas si vous avez besoin d'aide!</p>
      <p>Bonne journée,</p>
      <p class="signature-name">Mathilde de Mariable</p>
    </div>
  </div>
</body>
</html>`
    });
    
    console.log('📬 Envoi email vers:', 'mathilde@mariable.fr');
    
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: bodyContent
    });
    
    const data = await res.json();
    console.log('✅ Réponse Resend:', data);
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('❌ Erreur dans notifyNewContact:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
};
Deno.serve(handler);