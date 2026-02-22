import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND")!;
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("🚀 notify-vendor-message started:", new Date().toISOString());

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = await req.json();
    console.log("📧 Nouveau message prestataire:", record);

    const vendorName = record.vendor_name || "Non spécifié";
    const userEmail = record.user_email || "Non renseigné";
    const message = record.message || "";
    const createdAt = record.created_at
      ? new Date(record.created_at).toLocaleString("fr-FR")
      : new Date().toLocaleString("fr-FR");

    const emailContent = `
      <h1>💬 Nouveau message pour un prestataire</h1>
      
      <h2>📋 Détails</h2>
      <ul>
        <li><strong>Prestataire :</strong> ${vendorName}</li>
        <li><strong>Email utilisateur :</strong> ${userEmail}</li>
        <li><strong>Date :</strong> ${createdAt}</li>
      </ul>

      <h2>📝 Message</h2>
      <blockquote style="border-left: 3px solid #ccc; padding-left: 12px; margin: 12px 0; color: #333;">
        ${message.replace(/\n/g, "<br>")}
      </blockquote>

      <p>
        <a href="https://www.mariable.fr/admin/prestataires" target="_blank" style="color: #6B7280; text-decoration: underline;">
          → Voir dans l'admin
        </a>
      </p>
      
      <p><em>Notification automatique – ${new Date().toLocaleString("fr-FR")}</em></p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Mariable <noreply@mariable.fr>",
      to: ["mathilde@mariable.fr"],
      subject: `💬 Nouveau message pour ${vendorName} (de ${userEmail})`,
      html: emailContent,
    });

    if (emailResponse.error) {
      console.error("❌ Email error:", emailResponse.error);
      throw new Error(`Erreur envoi email: ${emailResponse.error.message}`);
    }

    console.log("✅ Email notification sent:", emailResponse.data?.id);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("❌ Error in notify-vendor-message:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
