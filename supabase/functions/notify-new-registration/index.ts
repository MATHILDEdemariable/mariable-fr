import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("🚀 notify-new-registration started:", new Date().toISOString());

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log("📧 Nouvelle inscription détectée:", requestData);

    const { user_id, email, created_at, raw_user_meta_data } = requestData;

    // Récupérer les infos profile si disponibles
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    // Formater les données utilisateur
    const firstName = profile?.first_name || raw_user_meta_data?.first_name || '';
    const lastName = profile?.last_name || raw_user_meta_data?.last_name || '';
    const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Non renseigné';
    const phone = profile?.phone || raw_user_meta_data?.phone || 'Non renseigné';
    const weddingDate = profile?.wedding_date ? new Date(profile.wedding_date).toLocaleDateString('fr-FR') : 'Non renseigné';

    // Préparer le contenu de l'email
    const emailContent = `
      <h1>🎉 Nouvelle inscription sur Mariable !</h1>
      
      <h2>📋 Informations utilisateur</h2>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Nom complet:</strong> ${fullName}</li>
        <li><strong>Téléphone:</strong> ${phone}</li>
        <li><strong>Date de mariage:</strong> ${weddingDate}</li>
        <li><strong>Date d'inscription:</strong> ${new Date(created_at).toLocaleString('fr-FR')}</li>
        <li><strong>ID utilisateur:</strong> ${user_id}</li>
      </ul>

      <h2>🔍 Actions recommandées</h2>
      <p>
        <a href="https://www.mariable.fr/admin/dashboard" target="_blank" style="color: #6B7280; text-decoration: underline;">
          → Voir dans le dashboard admin
        </a>
      </p>
      
      <p><em>Notification automatique générée le ${new Date().toLocaleString('fr-FR')}</em></p>
    `;

    // Envoyer l'email de notification
    console.log("📧 Envoi email notification...");

    const emailResponse = await resend.emails.send({
      from: "Mariable <noreply@mariable.fr>",
      to: ["mathilde@mariable.fr"],
      subject: `🎉 Nouvelle inscription: ${fullName} (${email})`,
      html: emailContent,
    });

    if (emailResponse.error) {
      console.error("❌ Email sending error:", emailResponse.error);
      throw new Error(`Erreur envoi email: ${emailResponse.error.message}`);
    }

    console.log("✅ Notification email sent successfully:", {
      email: email,
      fullName: fullName,
      emailId: emailResponse.data?.id
    });

    return new Response(JSON.stringify({
      success: true,
      user_id: user_id,
      email: email,
      fullName: fullName,
      emailSent: true,
      emailId: emailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("❌ Error in notify-new-registration:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json", 
        ...corsHeaders
      },
    });
  }
};

serve(handler);