import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND") as string);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomePremiumEmailRequest {
  userEmail: string;
  firstName?: string;
  lastName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📧 Sending welcome premium email...');

    const { userEmail, firstName, lastName }: WelcomePremiumEmailRequest = await req.json();

    if (!userEmail) {
      throw new Error("Email requis");
    }

    const userName = firstName && lastName 
      ? `${firstName} ${lastName}` 
      : firstName || "Membre premium";

    console.log('✅ Sending to:', userEmail, 'Name:', userName);

    const emailResponse = await resend.emails.send({
      from: "Mariable <mathilde@mariable.fr>",
      to: [userEmail],
      subject: "🎉 Bienvenue dans Mariable Premium !",
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #f9fafb;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header {
              background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              color: #1a1a1a;
              margin-bottom: 20px;
            }
            .message {
              font-size: 16px;
              line-height: 1.6;
              color: #4b5563;
              margin-bottom: 30px;
            }
            .features {
              background-color: #f9fafb;
              border-radius: 12px;
              padding: 30px;
              margin: 30px 0;
            }
            .features h2 {
              color: #1a1a1a;
              font-size: 20px;
              margin-top: 0;
              margin-bottom: 20px;
            }
            .feature-item {
              display: flex;
              align-items: start;
              margin-bottom: 15px;
              font-size: 15px;
              line-height: 1.5;
            }
            .feature-item:last-child {
              margin-bottom: 0;
            }
            .feature-icon {
              color: #000000;
              font-size: 20px;
              margin-right: 12px;
              flex-shrink: 0;
            }
            .feature-text {
              color: #4b5563;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
              color: #ffffff;
              text-decoration: none;
              padding: 16px 32px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              text-align: center;
            }
            .footer {
              background-color: #f9fafb;
              padding: 30px;
              text-align: center;
              font-size: 14px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
            }
            .footer a {
              color: #1a1a1a;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Bienvenue dans Mariable Premium !</h1>
            </div>
            
            <div class="content">
              <p class="greeting">Bonjour ${userName},</p>
              
              <p class="message">
                Félicitations ! Vous faites désormais partie de la communauté Premium Mariable. 
                Nous sommes ravis de vous accompagner dans l'organisation de votre mariage avec 
                tous nos outils avancés.
              </p>

              <div class="features">
                <h2>✨ Vos nouvelles fonctionnalités débloquées :</h2>
                
                <div class="feature-item">
                  <span class="feature-icon">🤖</span>
                  <span class="feature-text"><strong>Assistant IA illimité</strong> - Générez votre planning de mariage personnalisé avec l'intelligence artificielle</span>
                </div>
                
                <div class="feature-item">
                  <span class="feature-icon">📋</span>
                  <span class="feature-text"><strong>Coordination Jour-J</strong> - Gérez tous les détails de votre grand jour avec notre outil de coordination avancé</span>
                </div>
                
                <div class="feature-item">
                  <span class="feature-icon">📊</span>
                  <span class="feature-text"><strong>Budget détaillé</strong> - Suivez vos dépenses avec précision catégorie par catégorie</span>
                </div>
                
                <div class="feature-item">
                  <span class="feature-icon">👥</span>
                  <span class="feature-text"><strong>Plan de table illimité</strong> - Créez et modifiez votre plan de table sans restriction</span>
                </div>
                
                <div class="feature-item">
                  <span class="feature-icon">📧</span>
                  <span class="feature-text"><strong>Invitations personnalisées</strong> - Envoyez des invitations élégantes directement depuis la plateforme</span>
                </div>
                
                <div class="feature-item">
                  <span class="feature-icon">🎯</span>
                  <span class="feature-text"><strong>Liste des tâches avancée</strong> - Planifiez chaque étape avec nos checklists complètes</span>
                </div>
              </div>

              <center>
                <a href="https://mariable.fr/dashboard" class="cta-button">
                  Accéder à mon dashboard Premium
                </a>
              </center>

              <p class="message" style="margin-top: 30px;">
                Besoin d'aide pour démarrer ? N'hésitez pas à me contacter directement à 
                <a href="mailto:mathilde@mariable.fr" style="color: #1a1a1a; text-decoration: none; font-weight: 600;">mathilde@mariable.fr</a>
              </p>

              <p class="message">
                Encore merci pour votre confiance et bon mariage ! 💍
              </p>

              <p class="message" style="margin-top: 30px; font-style: italic;">
                Mathilde<br>
                Fondatrice de Mariable
              </p>
            </div>

            <div class="footer">
              <p>
                <strong>Mariable</strong><br>
                Votre assistant intelligent pour organiser votre mariage
              </p>
              <p style="margin-top: 15px;">
                <a href="https://mariable.fr">mariable.fr</a> • 
                <a href="mailto:mathilde@mariable.fr">mathilde@mariable.fr</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Email sent successfully:', emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('❌ Error sending welcome premium email:', error);
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
