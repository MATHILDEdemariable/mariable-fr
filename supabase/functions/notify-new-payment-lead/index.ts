const RESEND_API_KEY = Deno.env.get('RESEND');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { record } = await req.json();
    console.log('🚀 notify-new-payment-lead:', record?.email);

    const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height:1.6; color:#000; background:#f8f6f0; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:8px;">
    <h2 style="color:#7F9474; font-family: Georgia, serif;">💼 Nouvelle demande de démo professionnelle</h2>
    <p>Un professionnel vient de demander une démo via /partenariat :</p>
    <table style="width:100%; border-collapse:collapse; margin:20px 0;">
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Nom :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${record?.full_name ?? 'N/A'}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Email :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${record?.email ?? 'N/A'}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Téléphone :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${record?.phone ?? 'N/A'}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Catégorie :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${record?.category ?? 'N/A'}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Message :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${(record?.message ?? 'Aucun').replace(/\n/g, '<br>')}</td></tr>
    </table>
    <p>👉 À recontacter sous 24h.</p>
    <p style="margin-top:20px;">
      <a href="https://mariable.fr/admin/payment-leads" style="background:#7F9474; color:#fff; padding:12px 24px; text-decoration:none; border-radius:4px;">Voir dans l'admin</a>
    </p>
  </div>
</body></html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Mariable <mathilde@mariable.fr>',
        to: ['mathilde@mariable.fr'],
        subject: `💼 Demande de démo pro : ${record?.full_name ?? 'sans nom'}`,
        html,
      }),
    });

    const data = await res.json();
    console.log('✅ Resend:', data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ notify-new-payment-lead:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
