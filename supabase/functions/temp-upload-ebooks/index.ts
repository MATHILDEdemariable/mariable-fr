import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { slug, contentBase64 } = await req.json();
    
    if (!slug || !contentBase64) {
      return new Response(JSON.stringify({ error: "Missing slug or content" }), { status: 400, headers: corsHeaders });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const binary = Uint8Array.from(atob(contentBase64), c => c.charCodeAt(0));

    const { error } = await supabase.storage
      .from("ebooks")
      .upload(`${slug}.pdf`, binary, {
        contentType: "application/pdf",
        upsert: true
      });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
