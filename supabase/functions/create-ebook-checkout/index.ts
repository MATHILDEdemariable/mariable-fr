import Stripe from "https://esm.sh/stripe@14.21.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHARED_EBOOK_PRICE_ID = "price_1Tqv7UKHghqBzkgj4mOMVYty";

// Slugs autorisés (source unique côté frontend: src/data/guides.ts)
const ALLOWED_GUIDES: Record<string, string> = {
  "catalogue-prix-mariage-2026": "Catalogue Prix Mariage 2026 en France",
  "guide-ceremonie-laique": "Guide Ultime — Organiser la Cérémonie Laïque",
  "guide-debutants-mariage": "Guide Ultime — Débutants Mariage",
  "guide-discours-mariage": "Do & Don't du Discours de Mariage",
  "checklist-temoins": "Checklist pour les Témoins",
  "checklist-questions-prestataires": "Sélection des prestataires — Checklist questions",
  "checklist-mariee": "Checklist pour la Mariée",
};

const BodySchema = z.object({
  guideSlug: z.string().min(1).max(100),
  email: z.string().email().max(255),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Requête invalide", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { guideSlug, email } = parsed.data;
    const guideTitle = ALLOWED_GUIDES[guideSlug];
    if (!guideTitle) {
      return new Response(JSON.stringify({ error: "Guide inconnu" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Stripe non configuré" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const origin = "https://www.mariable.fr";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [{ price: SHARED_EBOOK_PRICE_ID, quantity: 1 }],
      allow_promotion_codes: false,
      success_url: `${origin}/mes-guides/pending?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/guides?payment=cancelled`,
      metadata: {
        type: "ebook",
        guide_slug: guideSlug,
        guide_title: guideTitle,
      },
      custom_text: {
        submit: { message: `Vous achetez : ${guideTitle}` },
      },
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("create-ebook-checkout error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
