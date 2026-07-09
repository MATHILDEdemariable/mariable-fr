// Temporary one-shot admin function to import PDFs into the 'ebooks' bucket.
// Delete after use.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FILES: Record<string, string> = {
  "catalogue-prix-mariage-2026": "https://tmpfiles.org/dl/wCws3Wzeeddj/catalogue-prix-mariage-2026.pdf",
  "guide-ceremonie-laique": "https://tmpfiles.org/dl/wcwx3QzHecoJ/guide-ceremonie-laique.pdf",
  "guide-debutants-mariage": "https://tmpfiles.org/dl/wkws3QzCeMJd/guide-debutants-mariage.pdf",
  "guide-discours-mariage": "https://tmpfiles.org/dl/w8wd3xzweWW7/guide-discours-mariage.pdf",
  "checklist-temoins": "https://tmpfiles.org/dl/wYws3Iz4e30b/checklist-temoins.pdf",
  "checklist-questions-prestataires": "https://tmpfiles.org/dl/wowe31zMet7H/checklist-questions-prestataires.pdf",
  "checklist-mariee": "https://tmpfiles.org/dl/wGwf37zHekXe/checklist-mariee.pdf",
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const results: Array<{ slug: string; ok: boolean; error?: string }> = [];

  for (const [slug, url] of Object.entries(FILES)) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
      const buf = new Uint8Array(await res.arrayBuffer());
      const { error } = await supabase.storage
        .from('ebooks')
        .upload(`${slug}.pdf`, buf, { contentType: 'application/pdf', upsert: true });
      if (error) throw error;
      results.push({ slug, ok: true });
    } catch (e) {
      results.push({ slug, ok: false, error: (e as Error).message });
    }
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
