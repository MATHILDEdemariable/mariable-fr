import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND"));
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const ADMIN_EMAIL = "mathilde@mariable.fr";

const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 255;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const lead = {
      vendorName: String(body.vendorName ?? "").slice(0, 200),
      vendorEmail: String(body.vendorEmail ?? "").trim(),
      firstName: String(body.firstName ?? "").slice(0, 100),
      lastName: String(body.lastName ?? "").slice(0, 100),
      email: String(body.email ?? "").trim(),
      phone: String(body.phone ?? "").slice(0, 40),
      weddingDate: String(body.weddingDate ?? "").slice(0, 20),
      weddingLocation: String(body.weddingLocation ?? "").slice(0, 200),
      message: String(body.message ?? "").slice(0, 2000),
      wantsQuote: body.wantsQuote === true,
    };
    if (!lead.vendorName || !lead.firstName || !isValidEmail(lead.email)) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    console.log("🚀 notify-immersion-lead started:", { vendor: lead.vendorName });

    const details = `
      <p><strong>Prestataire :</strong> ${escapeHtml(lead.vendorName)}</p>
      <p><strong>Couple :</strong> ${escapeHtml(lead.firstName)} ${escapeHtml(lead.lastName)}</p>
      <p><strong>Email :</strong> ${escapeHtml(lead.email)}</p>
      <p><strong>Téléphone :</strong> ${escapeHtml(lead.phone || "—")}</p>
      <p><strong>Date du mariage :</strong> ${escapeHtml(lead.weddingDate || "—")}</p>
      <p><strong>Lieu :</strong> ${escapeHtml(lead.weddingLocation || "—")}</p>
      <p><strong>Devis personnalisé :</strong> ${lead.wantsQuote ? "Oui" : "Non"}</p>
      <p style="white-space:pre-wrap"><strong>Message :</strong><br/>${escapeHtml(lead.message || "—")}</p>`;
    const wrap = (inner: string) => `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">${inner}<p style="color:#888;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:12px"><strong>Mariable</strong> : l'appli de wedding planning boostée à l'IA, partenaire d'Immersion Mariage<br/>Plus d'informations sur <a href="https://mariable.fr" style="color:#63745A">mariable.fr</a> et <a href="https://immersion-mariage.fr" style="color:#63745A">immersion-mariage.fr</a></p></div>`;

    // Mail prestataire (si email connu) avec Mathilde en copie, sinon Mathilde seule
    const hasVendorEmail = isValidEmail(lead.vendorEmail);
    await resend.emails.send({
      from: "Mariable <noreply@mariable.fr>",
      to: hasVendorEmail ? [lead.vendorEmail] : [ADMIN_EMAIL, "contact@immersion-mariage.fr"],
      cc: hasVendorEmail ? [ADMIN_EMAIL, "contact@immersion-mariage.fr"] : undefined,
      reply_to: lead.email,
      subject: `[Immersion Mariage] Nouvelle demande pour ${lead.vendorName}`,
      html: wrap(`<h2 style="color:#63745A">Nouvelle demande de contact</h2>${hasVendorEmail ? "" : `<p style="color:#a33"><em>Email du prestataire non renseigné : à transférer manuellement.</em></p>`}${details}<p style="margin-top:20px;padding:12px;background:#f4f6f2">Pour répondre à cette demande, contactez directement le couple avec les coordonnées ci-dessus, ou répondez simplement à cet email (« Répondre à tous »).</p>`),
    });

    // Accusé de réception au couple
    await resend.emails.send({
      from: "Mariable <noreply@mariable.fr>",
      to: [lead.email],
      reply_to: ADMIN_EMAIL,
      subject: `Votre demande à ${lead.vendorName} est bien transmise`,
      html: wrap(`<h2 style="color:#63745A">Merci ${escapeHtml(lead.firstName)} !</h2>
        <p>Votre demande de contact auprès de <strong>${escapeHtml(lead.vendorName)}</strong>, rencontré(e) à Immersion Mariage, a bien été transmise.</p>
        <p>Récapitulatif :</p>${details}
        <p style="margin-top:24px">Et pour préparer votre mariage sereinement : <a href="https://mariable.fr" style="color:#63745A">découvrez Mariable</a>.</p>`),
    });

    console.log("✅ notify-immersion-lead completed");
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("❌ notify-immersion-lead failed:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
