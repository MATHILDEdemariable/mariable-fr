const RESEND_API_KEY = Deno.env.get('re_iTejhpzK_32MDo5p1C7vrrc8P8qtfXbNX');
const handler = async (_request)=>{
  const { record } = await _request.json().catch(()=>({
      record: {
        nom: 'inconnu'
      }
    }));
  const name = record?.nom ?? 'inconnu';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer re_iTejhpzK_32MDo5p1C7vrrc8P8qtfXbNX'
    },
    body: JSON.stringify({
      "from": "[BO] Mariable <contact@mariable.fr>",
      "to": [
        "jordan.morand@gmail.com",
        "mathildelambert.contact@gmail.com "
      ],
      "subject": "Nouveau prestataire en attente de validation",
      "html": `Hello,<br/>
      Le nouveau prestataire ${name} à fait une demande.<br/>
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
