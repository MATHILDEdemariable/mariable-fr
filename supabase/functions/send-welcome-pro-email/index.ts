import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND")!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));

/** Accroche adaptée au métier du pro (FR / EN) */
const getCategoryLine = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes("lieu") || normalized.includes("venue"))
    return { fr: "Vos mariages au domaine, coordonnés de la visite au dernier slow.", en: "Your venue weddings, coordinated from the first visit to the last dance." };
  if (normalized.includes("traiteur") || normalized.includes("cater"))
    return { fr: "Vos services traiteur, synchronisés avec le déroulé du jour J.", en: "Your catering, synced with the wedding-day schedule." };
  if (normalized.includes("photo") || normalized.includes("vid"))
    return { fr: "Vos reportages, calés sur le déroulé partagé avec les mariés.", en: "Your shoots, aligned with the schedule shared with the couple." };
  return { fr: "Tous vos mariages, coordonnés au même endroit.", en: "All your weddings, coordinated in one place." };
};

Deno.serve(async (req) => {
  console.log("🚀 send-welcome-pro-email started");
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    if (!EMAIL_PATTERN.test(email)) {
      return new Response(JSON.stringify({ error: "Email invalide" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const firstName = escapeHtml(String(body?.firstName ?? "").slice(0, 80));
    const categoryLine = getCategoryLine(String(body?.category ?? "").slice(0, 80));
    const proUrl = "https://mariable.fr/pro";

    const button = (label: string) =>
      `<p style="margin:28px 0;"><a href="${proUrl}" style="background:#63745A;color:#ffffff;padding:14px 26px;text-decoration:none;font-family:Georgia,serif;">${label}</a></p>`;

    const html = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px;background:#F8F5EF;color:#1a1a1a;">
  <h1 style="font-size:24px;font-weight:normal;">Bienvenue sur Mariable${firstName ? `, ${firstName}` : ""}</h1>
  <p style="line-height:1.6;">On est ravis de vous compter parmi nous. On espère que l'outil va vous aider à créer de merveilleux événements.</p>
  <p style="line-height:1.6;font-style:italic;">${categoryLine.fr}</p>
  <ul style="line-height:1.8;padding-left:18px;">
    <li>Multi-mariages et feuille de route du jour</li>
    <li>Planning Jour J collaboratif, partagé par lien</li>
    <li>Rétroplanning, budget, invités &amp; RSVP, plan de table</li>
    <li>Collaboration avec vos mariés et exports PDF soignés</li>
  </ul>
  <p style="line-height:1.6;">L'offre gratuite est limitée à un mariage. Pour aller plus loin et débloquer l'offre payante, écrivez à <a href="mailto:mathilde@mariable.fr" style="color:#63745A;">mathilde@mariable.fr</a>.</p>
  <p style="line-height:1.6;">On vous laisse découvrir l'app : cliquez ici pour accéder à votre espace pro.</p>
  ${button("Accéder à mon espace pro")}
  <hr style="border:none;border-top:1px solid #d8d2c4;margin:32px 0;" />
  <h2 style="font-size:20px;font-weight:normal;">Welcome to Mariable${firstName ? `, ${firstName}` : ""}</h2>
  <p style="line-height:1.6;">We are delighted to have you with us. We hope the tool helps you create wonderful events.</p>
  <p style="line-height:1.6;font-style:italic;">${categoryLine.en}</p>
  <ul style="line-height:1.8;padding-left:18px;">
    <li>Multiple weddings and a daily roadmap</li>
    <li>Collaborative wedding-day schedule, shared by link</li>
    <li>Timeline, budget, guests &amp; RSVP, seating plan</li>
    <li>Collaboration with your couples and polished PDF exports</li>
  </ul>
  <p style="line-height:1.6;">The free plan is limited to one wedding. To go further and unlock the paid plan, email <a href="mailto:mathilde@mariable.fr" style="color:#63745A;">mathilde@mariable.fr</a>.</p>
  <p style="line-height:1.6;">Enjoy exploring the app: click below to open your pro space.</p>
  ${button("Open my pro space")}
  <p style="font-size:13px;color:#666;">L'équipe Mariable · The Mariable team</p>
</div>`;

    const { error } = await resend.emails.send({
      from: "Mariable <noreply@mariable.fr>",
      to: [email],
      subject: "Bienvenue sur Mariable Pro · Welcome to Mariable Pro",
      html,
    });
    if (error) throw error;

    console.log("✅ send-welcome-pro-email sent");
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("❌ send-welcome-pro-email failed:", error);
    return new Response(JSON.stringify({ error: "Envoi impossible" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
