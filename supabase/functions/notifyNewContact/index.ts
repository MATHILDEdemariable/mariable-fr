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
    
    const id = record?.id ?? 'inconnu';
    const message = record?.message ?? 'inconnu';
    const emailClient = record?.email_client ?? 'inconnu';
    const emailPresta = record?.email_presta ?? 'inconnu';
    
    console.log('📧 Données reçues:', { id, emailClient, emailPresta });
    
    const bodyContent = JSON.stringify({
      "from": "Mariable <mathilde@mariable.fr>",
      "to": "mathilde@mariable.fr",
      "bcc": [
        emailClient,
        emailPresta
      ],
      "subject": "Nouveau message prestataire",
      "html": `Bonjour, <br/> Un nouveau message vient de vous être envoyé. <br/>
        Message : <br />
        ${message} <br /><br />
        <a href="https://www.mariable.fr/prestataire/contact?id=${id}">Répondre au message</a>`
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