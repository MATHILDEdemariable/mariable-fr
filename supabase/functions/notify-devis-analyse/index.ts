const RESEND_API_KEY = Deno.env.get("RESEND");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const escape = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) throw new Error("RESEND key missing");

    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 255) : "";
    const categorie = typeof body.categorie === "string" ? body.categorie.trim().slice(0, 100) : "";
    const commentaire = typeof body.commentaire === "string" ? body.commentaire.trim().slice(0, 2000) : "";
    const filePath = typeof body.filePath === "string" ? body.filePath.slice(0, 500) : "";

    if (!email || !email.includes("@") || !categorie) {
      return new Response(JSON.stringify({ error: "email et catégorie requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Lien signé (7 jours) vers le devis déposé
    let signedUrl = "";
    if (filePath && SUPABASE_URL && SERVICE_ROLE_KEY) {
      const res = await fetch(
        `${SUPABASE_URL}/storage/v1/object/sign/devis-analyses/${filePath}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ expiresIn: 60 * 60 * 24 * 7 }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        if (data?.signedURL) signedUrl = `${SUPABASE_URL}/storage/v1${data.signedURL}`;
      } else {
        console.error("Signed URL error:", res.status, await res.text());
      }
    }

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width:600px; margin:0 auto; background:#fff; padding:32px; color:#1a1a1a;">
        <h2 style="font-family:'Playfair Display', Georgia, serif; color:#63745A; margin:0 0 16px;">Nouvelle demande d'analyse de devis</h2>
        <p style="margin:0 0 8px;"><strong>Email :</strong> <a href="mailto:${escape(email)}">${escape(email)}</a></p>
        <p style="margin:0 0 8px;"><strong>Catégorie :</strong> ${escape(categorie)}</p>
        ${commentaire ? `<p style="margin:16px 0 8px;"><strong>Commentaire :</strong></p><p style="white-space:pre-wrap; line-height:1.6;">${escape(commentaire)}</p>` : ""}
        ${signedUrl ? `<p style="margin:16px 0;"><a href="${signedUrl}" style="background:#63745A;color:#fff;padding:12px 20px;text-decoration:none;display:inline-block;">Télécharger le devis</a></p>` : "<p style=\"margin:16px 0;\">Aucun fichier joint.</p>"}
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mariable <mathilde@mariable.fr>",
        to: ["mathilde@mariable.fr"],
        reply_to: email,
        subject: `Analyse de devis — ${categorie}`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify({ error: data }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("notify-devis-analyse failed:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
