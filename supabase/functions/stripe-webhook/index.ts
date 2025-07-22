
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
    logStep("ERROR: Method not allowed", { method: req.method });
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
      logStep("ERROR: Missing Stripe keys", { 
        hasStripeKey: !!stripeKey, 
        hasWebhookSecret: !!webhookSecret 
      });
      return new Response("Configuration error", { status: 500 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Vérifier la signature du webhook
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
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

    // Fonction pour logger les audits
    const logAudit = async (status: string, errorMessage?: string) => {
      const auditData: any = {
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        status,
        error_message: errorMessage || null,
      };

      // Ajouter des données spécifiques selon le type d'événement
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        auditData.customer_email = session.customer_details?.email;
        auditData.session_id = session.id;
        auditData.payment_intent_id = session.payment_intent;
        auditData.amount = session.amount_total;
        auditData.currency = session.currency;
      } else if (event.type.startsWith('payment_intent.')) {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        auditData.payment_intent_id = paymentIntent.id;
        auditData.amount = paymentIntent.amount;
        auditData.currency = paymentIntent.currency;
      }

      const { error: auditError } = await supabaseClient
        .from('payment_audit')
        .insert(auditData);

      if (auditError) {
        logStep("ERROR: Failed to log audit", { error: auditError });
      } else {
        logStep("Audit logged", { type: auditData.stripe_event_type, status });
      }
    };

    // Traiter les différents types d'événements
    try {
      if (event.type === "checkout.session.completed") {
        await handleCheckoutCompleted(event, supabaseClient);
        await logAudit('success');
      } else if (event.type === "payment_intent.succeeded") {
        await handlePaymentSucceeded(event, supabaseClient);
        await logAudit('success');
      } else if (event.type === "payment_intent.payment_failed") {
        await handlePaymentFailed(event, supabaseClient);
        await logAudit('payment_failed');
      } else if (event.type === "invoice.payment_succeeded") {
        await handleInvoicePaymentSucceeded(event, supabaseClient);
        await logAudit('success');
      } else {
        logStep("Unhandled event type", { type: event.type });
        await logAudit('unhandled');
      }

      return new Response(
        JSON.stringify({ received: true, processed: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } catch (error) {
      logStep("ERROR: Processing webhook event", { error: error.message });
      await logAudit('error', error.message);
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Failed to process webhook event" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

  } catch (error) {
    logStep("ERROR: Webhook processing failed", { error: error.message });
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Webhook processing failed" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Gestionnaire pour checkout.session.completed
async function handleCheckoutCompleted(event: Stripe.Event, supabaseClient: any) {
  const session = event.data.object as Stripe.Checkout.Session;
  logStep("Checkout session completed", { 
    sessionId: session.id, 
    customerEmail: session.customer_details?.email,
    paymentStatus: session.payment_status
  });

  if (!session.customer_details?.email) {
    throw new Error('No customer email found in session');
  }

  if (session.payment_status !== 'paid') {
    throw new Error(`Payment not completed. Status: ${session.payment_status}`);
  }

  // Trouver l'utilisateur par email
  const { data: userData, error: userError } = await supabaseClient.auth.admin.listUsers();
  
  if (userError) {
    logStep("ERROR: Failed to list users", { error: userError });
    throw userError;
  }

  const user = userData.users.find(u => u.email === session.customer_details?.email);
  
  if (!user) {
    logStep("ERROR: User not found", { email: session.customer_details?.email });
    throw new Error(`User not found with email: ${session.customer_details?.email}`);
  }

  logStep("User found", { userId: user.id, email: user.email });

  // Mettre à jour le profil pour le rendre premium
  const { data: updatedProfile, error: updateError } = await supabaseClient
    .from('profiles')
    .update({
      subscription_type: 'premium',
      subscription_expires_at: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single();

  if (updateError) {
    logStep("ERROR: Failed to update profile", { error: updateError });
    throw updateError;
  }

  logStep("Profile updated to premium successfully", { 
    userId: user.id,
    updatedProfile: updatedProfile
  });
}

// Gestionnaire pour payment_intent.succeeded
async function handlePaymentSucceeded(event: Stripe.Event, supabaseClient: any) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  logStep("Payment succeeded", { paymentIntentId: paymentIntent.id, amount: paymentIntent.amount });
  
  // Logique supplémentaire pour les paiements réussis si nécessaire
  // Par exemple, envoyer une notification ou mettre à jour des métriques
}

// Gestionnaire pour payment_intent.payment_failed
async function handlePaymentFailed(event: Stripe.Event, supabaseClient: any) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  logStep("Payment failed", { 
    paymentIntentId: paymentIntent.id, 
    error: paymentIntent.last_payment_error?.message 
  });
  
  // Logique pour gérer les échecs de paiement
  // Par exemple, notifier l'utilisateur ou l'admin
}

// Gestionnaire pour invoice.payment_succeeded
async function handleInvoicePaymentSucceeded(event: Stripe.Event, supabaseClient: any) {
  const invoice = event.data.object as Stripe.Invoice;
  logStep("Invoice payment succeeded", { invoiceId: invoice.id });
  
  // Logique pour les abonnements récurrents si nécessaire
}
