
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// Helper pour les logs détaillés
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    logStep("Webhook received");

    // Récupérer la signature Stripe
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      logStep("ERROR: No Stripe signature found");
      return new Response("No signature", { status: 400 });
    }

    // Récupérer le body brut
    const body = await req.text();
    logStep("Body received", { length: body.length });

    // Initialiser Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey || !webhookSecret) {
      logStep("ERROR: Missing Stripe keys");
      return new Response("Configuration error", { status: 500 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Vérifier la signature du webhook
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook signature verified", { type: event.type, id: event.id });
    } catch (err) {
      logStep("ERROR: Webhook signature verification failed", { error: err.message });
      return new Response("Webhook signature verification failed", { status: 400 });
    }

    // Initialiser le client Supabase avec service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Traiter les événements de paiement réussi
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Checkout session completed", { 
        sessionId: session.id, 
        customerEmail: session.customer_email 
      });

      if (session.customer_email) {
        try {
          // Trouver l'utilisateur par email
          const { data: userData, error: userError } = await supabaseClient.auth.admin.listUsers();
          
          if (userError) {
            logStep("ERROR: Failed to list users", { error: userError });
            throw userError;
          }

          const user = userData.users.find(u => u.email === session.customer_email);
          
          if (!user) {
            logStep("ERROR: User not found", { email: session.customer_email });
            return new Response("User not found", { status: 404 });
          }

          logStep("User found", { userId: user.id, email: user.email });

          // Mettre à jour le profil pour le rendre premium
          const { error: updateError } = await supabaseClient
            .from('profiles')
            .upsert({
              id: user.id,
              subscription_type: 'premium',
              subscription_expires_at: null, // Premium à vie pour l'instant
              updated_at: new Date().toISOString()
            });

          if (updateError) {
            logStep("ERROR: Failed to update profile", { error: updateError });
            throw updateError;
          }

          logStep("Profile updated to premium successfully", { userId: user.id });

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "User upgraded to premium successfully",
              userId: user.id 
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );

        } catch (error) {
          logStep("ERROR: Processing checkout session", { error: error.message });
          return new Response(
            JSON.stringify({ error: "Failed to process payment" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }
      }
    }

    // Traiter les événements d'abonnement (si besoin futur)
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      logStep("Invoice payment succeeded", { invoiceId: invoice.id });
      
      // Logique pour les abonnements récurrents si nécessaire
    }

    // Événement non traité mais valide
    logStep("Webhook event received but not processed", { type: event.type });
    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    logStep("ERROR: Webhook processing failed", { error: error.message });
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
