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
    console.log('🚀 notify-new-professional:', record?.email);

    const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height:1.6; color:#000; background:#f8f6f0; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:8px;">
    <h2 style="color:#7F9474; font-family: Georgia, serif;">🎉 Nouvelle inscription professionnelle</h2>
    <p>Un nouveau prestataire vient de s'inscrire sur Mariable :</p>
    <table style="width:100%; border-collapse:collapse; margin:20px 0;">
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Nom :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${record?.nom ?? 'N/A'}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Catégorie :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${record?.categorie ?? 'N/A'}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Email :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${record?.email ?? 'N/A'}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Téléphone :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${record?.telephone ?? 'N/A'}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>SIRET :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${record?.siret ?? 'N/A'}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Région :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${Array.isArray(record?.regions) ? record.regions.join(', ') : (record?.regions ?? 'N/A')}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Site web :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${record?.site_web ?? 'N/A'}</td></tr>
      <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Description :</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${record?.description ?? 'N/A'}</td></tr>
    </table>
    <p style="margin-top:20px;">
      <a href="https://mariable.fr/admin/professional-registrations" style="background:#7F9474; color:#fff; padding:12px 24px; text-decoration:none; border-radius:4px;">Voir dans l'admin</a>
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
        subject: `🎉 Nouvelle inscription pro : ${record?.nom ?? 'sans nom'}`,
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
    console.error('❌ notify-new-professional:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
