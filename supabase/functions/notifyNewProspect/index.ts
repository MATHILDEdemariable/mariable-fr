const RESEND_API_KEY = Deno.env.get('re_iTejhpzK_32MDo5p1C7vrrc8P8qtfXbNX');
const handler = async (_request)=>{
  const { record } = await _request.json().catch(()=>({
      record: {
        id: 'inconnu',
        email_presta: ''
      }
    }));
  const idTracking = record?.id ?? 'inconnu';
  const emailPresta = record?.email_presta ?? '';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer re_iTejhpzK_32MDo5p1C7vrrc8P8qtfXbNX'
    },
    body: JSON.stringify({
      "from": "Mariable <contact@mariable.fr>",
      "to": emailPresta,
      "bcc": "jordan.morand@gmail.com",
      "subject": "[PRESTA] - Demande de rendez-vous ",
      "html": `Hello,<br/>
      Vous venez de recevoir une nouvelle demande de rendez-vous<br/>
      <a href="https://www.mariable.fr/prestataire/tracking?id=${idTracking}">Cliquez-ici</a>
      `
    })
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
