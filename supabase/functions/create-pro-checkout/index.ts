import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Produits Stripe Mariable Pro (plan + intervalle -> produit + statut accordé)
const PRO_PRODUCTS: Record<string, { product: string; proPlan: "pro_jour_j" | "pro_premium" }> = {
  "jour-j:year": { product: "prod_VYnvYRSuoVXTQ0", proPlan: "pro_jour_j" },
  "jour-j:month": { product: "prod_VYnzzqvG2B2FX9", proPlan: "pro_jour_j" },
  "organisation:year": { product: "prod_VYnxWjGO1TNOcK", proPlan: "pro_premium" },
  "organisation:month": { product: "prod_VYnys1BafiQCyF", proPlan: "pro_premium" },
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return jsonResponse({ error: "Unauthorized" }, 401);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    const userId = claimsData?.claims?.sub;
    const userEmail = claimsData?.claims?.email as string | undefined;
    if (claimsError || !userId || !userEmail) return jsonResponse({ error: "Unauthorized" }, 401);

    const { planId, interval } = await req.json().catch(() => ({}));
    const offer = PRO_PRODUCTS[`${planId}:${interval}`];
    if (!offer) return jsonResponse({ error: "Formule invalide" }, 400);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });
    const prices = await stripe.prices.list({ product: offer.product, active: true, type: "recurring", limit: 1 });
    const price = prices.data[0];
    if (!price) {
      console.error("❌ create-pro-checkout: aucun tarif actif pour", offer.product);
      return jsonResponse({ error: "Tarif introuvable" }, 500);
    }

    const metadata = { userId, userEmail, type: "pro_subscription", proPlan: offer.proPlan, planId, interval };
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: userEmail,
      client_reference_id: userId,
      line_items: [{ price: price.id, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: "https://www.mariable.fr/pro?payment=success&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://www.mariable.fr/pro-solutions?payment=cancelled#tarifs",
      metadata,
      subscription_data: { metadata },
    });

    console.log("✅ create-pro-checkout: session créée", { sessionId: session.id, proPlan: offer.proPlan });
    return jsonResponse({ url: session.url });
  } catch (error) {
    console.error("❌ create-pro-checkout failed:", error);
    return jsonResponse({ error: (error as Error).message }, 500);
  }
});
