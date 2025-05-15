const RESEND_API_KEY = Deno.env.get('re_iTejhpzK_32MDo5p1C7vrrc8P8qtfXbNX');
const handler = async (_request)=>{
  const { record } = await _request.json().catch(()=>({
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
  let bodyContent = JSON.stringify({
    "from": "Mariable <contact@mariable.fr>",
    "to": "dev@mariable.fr",
    "bcc": [
      emailClient,
      emailPresta
    ],
    "subject": "Nouveau message",
    "html": `Bonjour, <br/> Un nouveau message vient de vous être envoyé. <br/>
      Message : <br />
      ${message} <br /><br />
      <a href="https://www.mariable.fr/prestataire/contact?id=${id}">Répondre au message</a>`
  });
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer re_iTejhpzK_32MDo5p1C7vrrc8P8qtfXbNX`
    },
    body: bodyContent
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
Deno.serve(handler);
