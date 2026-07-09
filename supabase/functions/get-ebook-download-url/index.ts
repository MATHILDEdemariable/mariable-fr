import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EBOOK_URLS: Record<string, string> = {
  "catalogue-prix-mariage-2026": "https://id-preview--a37bea4b-6ff4-4b13-ab2a-e05df741ab69.lovable.app/__l5e/assets-v1/8168466e-d535-419a-9dfe-9bb2ad8850f6/catalogue-prix-mariage-2026.pdf",
  "guide-ceremonie-laique": "https://id-preview--a37bea4b-6ff4-4b13-ab2a-e05df741ab69.lovable.app/__l5e/assets-v1/37b519d4-e379-4b4c-b7ee-c599207d9d3a/guide-ceremonie-laique.pdf",
  "guide-debutants-mariage": "https://id-preview--a37bea4b-6ff4-4b13-ab2a-e05df741ab69.lovable.app/__l5e/assets-v1/bf239344-da79-4b1d-9b3f-213500b26fc6/guide-debutants-mariage.pdf",
  "guide-discours-mariage": "https://id-preview--a37bea4b-6ff4-4b13-ab2a-e05df741ab69.lovable.app/__l5e/assets-v1/c22b963c-e311-4e7b-a42b-b68134afacea/guide-discours-mariage.pdf",
  "checklist-temoins": "https://id-preview--a37bea4b-6ff4-4b13-ab2a-e05df741ab69.lovable.app/__l5e/assets-v1/a1eb200d-c7dd-46f8-af18-4c537c6da042/checklist-temoins.pdf",
  "checklist-questions-prestataires": "https://id-preview--a37bea4b-6ff4-4b13-ab2a-e05df741ab69.lovable.app/__l5e/assets-v1/82238ac8-ccf9-4358-9818-5cb63baf626a/checklist-questions-prestataires.pdf",
  "checklist-mariee": "https://id-preview--a37bea4b-6ff4-4b13-ab2a-e05df741ab69.lovable.app/__l5e/assets-v1/9a3bae33-0a8d-4ce9-8eac-b9e8f4c87c17/checklist-mariee.pdf",
};

const ALLOWED_SLUGS = new Set(Object.keys(EBOOK_URLS));

const BodySchema = z.object({
  slug: z.string().min(1).max(100),
  token: z.string().min(10).max(200).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Requête invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { slug, token } = parsed.data;
    if (!ALLOWED_SLUGS.has(slug)) {
      return new Response(JSON.stringify({ error: "Guide inconnu" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    let authorized = false;

    // Mode 1: token public (marketplace)
    if (token) {
      const anonClient = createClient(SUPABASE_URL, ANON_KEY);
      const { data, error } = await anonClient.rpc("get_purchases_by_token", {
        token_value: token,
      });
      if (error) {
        console.error("RPC error:", error);
        return new Response(JSON.stringify({ error: "Vérification impossible" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const purchases = (data as Array<{ guide_slug: string }>) || [];
      authorized = purchases.some((p) => p.guide_slug === slug);
    } else {
      // Mode 2: user Premium authentifié
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Authentification requise" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const jwt = authHeader.replace("Bearer ", "");
      const userClient = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${jwt}` } },
      });
      const { data: userData, error: userError } = await userClient.auth.getUser(jwt);
      if (userError || !userData?.user) {
        return new Response(JSON.stringify({ error: "Session invalide" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);
      const { data: profile } = await adminClient
        .from("profiles")
        .select("subscription_type, subscription_expires_at")
        .eq("id", userData.user.id)
        .single();

      const isPremium =
        profile?.subscription_type === "premium" &&
        (!profile.subscription_expires_at ||
          new Date(profile.subscription_expires_at) > new Date());

      authorized = !!isPremium;
    }

    if (!authorized) {
      return new Response(JSON.stringify({ error: "Accès non autorisé" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Retourner l'URL directe (CDN Lovable)
    const ebookUrl = EBOOK_URLS[slug];

    if (!ebookUrl) {
      return new Response(JSON.stringify({ error: "Fichier introuvable" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: ebookUrl }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("get-ebook-download-url error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
