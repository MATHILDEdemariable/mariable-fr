import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND")!;
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  firstName: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("🚀 send-welcome-couple-email started:", new Date().toISOString());

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName }: WelcomeEmailRequest = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }

    const displayName = firstName || "futur(e) marié(e)";

    console.log("📧 Envoi email de bienvenue à:", email);

    const emailContent = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">
          💍 Bienvenue dans votre espace Mariable, ${displayName} !
        </h1>
        
        <p style="font-size: 18px; color: #333;">
          <strong>Félicitations ${displayName} !</strong> 🎉
        </p>
        
        <p style="color: #555; line-height: 1.6;">
          Vous venez de débloquer l'accès à votre espace Mariable – votre allié pour organiser votre mariage facilement et vivre une belle expérience!
        </p>

        <h2 style="color: #1a1a1a; font-size: 18px; margin-top: 30px;">📱 Comment l'utiliser ?</h2>
        <p style="color: #555; line-height: 1.6;">
          Pour une expérience optimale, on vous conseille l'ordinateur – c'est là que tous les outils donnent leur pleine puissance. Mais tout est mobile-friendly, donc vous pouvez aussi avancer sur votre téléphone.
        </p>
        <p style="color: #555; line-height: 1.6; font-style: italic;">
          (Surtout le module Jour-J spécialement pensé pour le mobile et parfait pour utiliser le jour venu avec vos témoins, prestataires ou autres)
        </p>

        <h2 style="color: #1a1a1a; font-size: 18px; margin-top: 30px;">Ce qui vous attend :</h2>
        <ul style="color: #555; line-height: 1.8; list-style: none; padding-left: 0;">
          <li>✨ <strong>Tableau de bord</strong> – Vue d'ensemble de votre organisation</li>
          <li>✅ <strong>Check-list intelligente</strong> – Pour ne rien oublier</li>
          <li>📅 <strong>Retroplanning</strong> – Savez exactement quoi faire et quand</li>
          <li>💰 <strong>Budget boosté à l'IA</strong> – Gérez vos finances sereinement</li>
          <li>🎯 <strong>Planning Jour-J</strong> – Minute par minute pour le grand jour</li>
          <li>👥 <strong>Gestion des invités & RSVP</strong> – Suivez les confirmations en temps réel</li>
          <li>🪑 <strong>Plan de table</strong> – Créez l'harmonie parfaite</li>
          <li>💎 <strong>Panier de prestataires</strong> – Calculez et comparez les devis</li>
          <li>📋 <strong>Infos & guide</strong> – Pour la cérémonie civile, laïque, catholique</li>
        </ul>

        <div style="background-color: #f5f5f0; padding: 20px; margin: 30px 0; border-left: 3px solid #6B7280;">
          <h3 style="color: #1a1a1a; margin-top: 0;">💬 Petit conseil :</h3>
          <p style="color: #555; line-height: 1.6; margin-bottom: 0;">
            Quand vous contactez des prestataires, utilisez notre messagerie intégrée (ou mentionnez Mariable) – ça nous aide énormément à continuer de développer ces outils gratuits pour vous ! 🙏
          </p>
        </div>

        <p style="color: #555; line-height: 1.6;">
          Des questions ? N'hésitez pas à nous contacter !!
        </p>

        <p style="font-size: 18px; color: #333; margin-top: 30px;">
          Que l'aventure commence ! 🥂
        </p>

        <p style="color: #555;">
          <strong>L'équipe Mariable</strong>
        </p>

        <p style="color: #888; font-size: 14px; margin-top: 30px; font-style: italic;">
          P.S. : Suivez-nous sur Instagram <a href="https://instagram.com/mariable.fr" style="color: #6B7280;">@mariable.fr</a> pour des tips, inspirations et coulisses !
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Mariable <noreply@mariable.fr>",
      to: [email],
      subject: `💍 Bienvenue dans votre espace Mariable, ${displayName} !`,
      html: emailContent,
    });

    if (emailResponse.error) {
      console.error("❌ Email sending error:", emailResponse.error);
      throw new Error(`Erreur envoi email: ${emailResponse.error.message}`);
    }

    console.log("✅ Welcome email sent successfully:", {
      email: email,
      firstName: displayName,
      emailId: emailResponse.data?.id
    });

    return new Response(JSON.stringify({
      success: true,
      email: email,
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
    console.error("❌ Error in send-welcome-couple-email:", error);
    
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
