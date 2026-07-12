import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({
  email: z.string().email().max(255),
  guideTitle: z.string().min(1).max(255),
  accessToken: z.string().min(10).max(200),
});

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Requête invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, guideTitle, accessToken } = parsed.data;

    const RESEND_API_KEY = Deno.env.get("RESEND");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service non configuré" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const link = `https://www.mariable.fr/mes-guides/${accessToken}`;
    const safeTitle = escapeHtml(guideTitle);

    const html = `
<!doctype html><html><body style="font-family:Georgia,serif;background:#f7f5f0;padding:32px;color:#1a1a1a">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:40px;border:1px solid #e5e0d5">
    <p style="letter-spacing:.3em;text-transform:uppercase;color:#63745A;font-size:11px;margin:0 0 24px">Mariable · Guides</p>
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:26px;margin:0 0 16px">Merci pour votre achat ✨</h1>
    <p style="line-height:1.6">Votre guide <strong>${safeTitle}</strong> est prêt à télécharger.</p>
    <p style="margin:32px 0">
      <a href="${link}" style="background:#63745A;color:#fff;padding:14px 28px;text-decoration:none;display:inline-block;font-weight:500">Accéder à mon guide</a>
    </p>
    <p style="font-size:13px;color:#666;line-height:1.6">
      Ce lien est personnel. Conservez-le : vous pourrez re-télécharger votre guide à tout moment depuis :<br>
      <a href="${link}" style="color:#63745A;word-break:break-all">${link}</a>
    </p>
    <hr style="border:none;border-top:1px solid #e5e0d5;margin:32px 0">
    <p style="font-size:12px;color:#999">Une question ? Répondez à cet email — <a href="mailto:mathilde@mariable.fr" style="color:#63745A">mathilde@mariable.fr</a></p>
  </div>
</body></html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mariable <mathilde@mariable.fr>",
        to: [email],
        subject: `Votre guide : ${guideTitle}`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify({ error: "Envoi email échoué", details: data }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-ebook-email error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
