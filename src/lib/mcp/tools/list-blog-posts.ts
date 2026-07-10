import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

function anonSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export default defineTool({
  name: "list_blog_posts",
  title: "Lister les articles de blog",
  description:
    "Lister les articles de conseils mariage publiés sur Mariable. Retourne titre, slug, catégorie, extrait.",
  inputSchema: {
    category: z.string().optional().describe("Filtrer par catégorie"),
    limit: z.number().int().min(1).max(50).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, limit }) => {
    const supabase = anonSupabase();
    let q = supabase
      .from("blog_posts")
      .select("id,slug,title,subtitle,category,meta_description,published_at")
      .eq("status", "published" as never)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (category) q = q.eq("category", category);

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { posts: data ?? [] },
    };
  },
});
