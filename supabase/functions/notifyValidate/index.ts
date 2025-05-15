const RESEND_API_KEY = Deno.env.get('re_iTejhpzK_32MDo5p1C7vrrc8P8qtfXbNX');
const handler = async (_request)=>{
  const { record } = await _request.json().catch(()=>({
      record: {
        id: 'inconnu',
        status: 'inconnu',
        email_presta: 'inconnu',
        email_client: 'inconnu'
      }
    }));
  const id = record?.id ?? 'inconnu';
  const status = record?.status ?? 'inconnu';
  const emailPresta = record?.email_presta ?? 'inconnu';
  const emailClient = record?.email_client ?? 'inconnu';
  let bodyContent = JSON.stringify({
    "from": "contact@mariable.fr",
    "to": "jordan.morand@gmail.com",
    "subject": "Erreur mariable.fr",
    "html": `Une erreur est apparue sur la edge function notifyValidate`
  });
  if (status === 'à valider') {
    bodyContent = JSON.stringify({
      "from": "Mariable <contact@mariable.fr>",
      "to": emailClient,
      "bcc": "jordan.morand@gmail.com",
      "subject": "Proposition de date avec un prestataire",
      "html": `Hello,<br/>
    Le prestataire vient de valider l'une de vos dates pour votre rendez-vous.<br/>
    <a href="https://www.mariable.fr/prestataire/tracking?id=${id}&edit=user">Cliquez-ici</a>
    `
    });
  }
  if (status === 'réponse reçue') {
    bodyContent = JSON.stringify({
      "from": "Mariable <contact@mariable.fr>",
      "to": emailPresta,
      "bcc": "jordan.morand@gmail.com",
      "subject": "Validation du rendez-vous",
      "html": `Bonjour,<br/>
    Votre rendez-vous, vient d'etre validé.<br/>
    <a href="https://www.mariable.fr/prestataire/tracking?id=${id}">Cliquez-ici</a>
    `
    });
  }
  if (status === 'annuler') {
    bodyContent = JSON.stringify({
      "from": "Mariable <contact@mariable.fr>",
      "to": "dev@mariable.fr",
      "bcc": [
        "jordan.morand@gmail.com",
        emailClient,
        emailPresta
      ],
      "subject": "Annulation du rdv",
      "html": `Bonjour,<br/>
    Votre rendez-vous, vient d'etre annulé.
    <a href="https://www.mariable.fr/prestataire/tracking?id=${id}">Cliquez-ici pour plus d'informations</a>
    `
    });
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer re_iTejhpzK_32MDo5p1C7vrrc8P8qtfXbNX'
    },
    body: bodyContent
  });
  const data = await res.json();
  bodyContent = JSON.stringify({});
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
Deno.serve(handler);
