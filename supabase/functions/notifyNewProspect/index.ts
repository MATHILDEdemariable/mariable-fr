const RESEND_API_KEY = Deno.env.get('RESEND');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (_request) => {
  console.log('🚀 notifyNewProspect déclenchée');
  
  // Handle CORS preflight requests
  if (_request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = await _request.json().catch(() => ({
      record: {
        id: 'inconnu',
        email_presta: '',
        status: ''
      }
    }));
    
    const idTracking = record?.id ?? 'inconnu';
    const emailPresta = record?.email_presta ?? '';
    const status = record?.status ?? '';
    
    console.log('📧 Données reçues:', { idTracking, emailPresta, status });
    
    if (!emailPresta) {
      console.log('❌ Email prestataire manquant');
      return new Response(JSON.stringify({ error: 'Email prestataire requis' }), {
        status: 400,
        headers: { ...corsHeaders }
      });
    }
    
    console.log('📬 Envoi email vers prestataire:', emailPresta);
    
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        "from": "Mariable <mathilde@mariable.fr>",
        "to": emailPresta,
        "bcc": "mathilde@mariable.fr",
        "subject": "[PRESTA] - Demande de rendez-vous",
        "html": `Bonjour,<br/>
        Vous venez de recevoir une nouvelle demande de rendez-vous<br/>
        <a href="https://www.mariable.fr/prestataire/tracking?id=${idTracking}">Cliquez ici pour voir les détails</a>
        `
      })
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
    console.error('❌ Erreur dans notifyNewProspect:', error);
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
