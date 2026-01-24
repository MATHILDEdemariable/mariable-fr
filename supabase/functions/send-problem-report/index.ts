import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ProblemReportRequest {
  email: string;
  subject: string;
  message: string;
}

const getSubjectLabel = (subject: string): string => {
  const labels: Record<string, string> = {
    'bug': 'Bug technique',
    'feature': 'Question fonctionnalité',
    'account': 'Problème de compte',
    'suggestion': 'Suggestion',
    'other': 'Autre'
  };
  return labels[subject] || subject;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, subject, message }: ProblemReportRequest = await req.json();

    console.log('📧 Sending problem report from:', email, 'subject:', subject);

    const subjectLabel = getSubjectLabel(subject);

    // Envoyer l'email à mathilde@mariable.fr
    const emailResponse = await resend.emails.send({
      from: "Mariable <noreply@mariable.fr>",
      to: ["mathilde@mariable.fr"],
      subject: `[Problème Dashboard] ${subjectLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a5d4a;">Nouveau signalement de problème</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email de l'utilisateur :</strong> ${email}</p>
            <p><strong>Catégorie :</strong> ${subjectLabel}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #333;">Message :</h3>
            <p style="white-space: pre-wrap; color: #555;">${message}</p>
          </div>
          
          <p style="color: #888; font-size: 12px; margin-top: 20px;">
            Ce message a été envoyé depuis le dashboard Mariable.
          </p>
        </div>
      `,
    });

    console.log("✅ Email sent to mathilde@mariable.fr:", emailResponse);

    // Envoyer un email de confirmation à l'utilisateur
    const confirmationResponse = await resend.emails.send({
      from: "Mariable <noreply@mariable.fr>",
      to: [email],
      subject: "Nous avons bien reçu votre message - Mariable",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a5d4a;">Merci de nous avoir contactés !</h2>
          
          <p>Nous avons bien reçu votre message concernant : <strong>${subjectLabel}</strong></p>
          
          <p>Notre équipe reviendra vers vous dans les plus brefs délais.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Votre message :</h3>
            <p style="white-space: pre-wrap; color: #555;">${message}</p>
          </div>
          
          <p>À très bientôt,<br>L'équipe Mariable</p>
        </div>
      `,
    });

    console.log("✅ Confirmation email sent to user:", confirmationResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error in send-problem-report function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
