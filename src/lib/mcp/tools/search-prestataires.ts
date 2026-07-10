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
  name: "search_prestataires",
  title: "Rechercher des prestataires",
  description:
    "Rechercher des prestataires de mariage visibles dans l'annuaire Mariable (lieux, traiteurs, photographes, etc.). Retourne nom, catégorie, ville, prix, description, slug.",
  inputSchema: {
    query: z
      .string()
      .optional()
      .describe("Texte libre recherché dans le nom ou la description"),
    categorie: z
      .string()
      .optional()
      .describe("Catégorie exacte (ex: Lieu de réception, Traiteur, Photographe)"),
    ville: z.string().optional().describe("Filtrer par ville"),
    limit: z.number().int().min(1).max(50).default(10),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, categorie, ville, limit }) => {
    const supabase = anonSupabase();
    let q = supabase
      .from("prestataires_rows")
      .select(
        "id,nom,slug,categorie,ville,description,prix_a_partir_de,prix_par_personne,site_web,google_rating",
      )
      .eq("visible", true)
      .limit(limit);

    if (categorie) q = q.eq("categorie", categorie as never);
    if (ville) q = q.ilike("ville", `%${ville}%`);
    if (query) q = q.or(`nom.ilike.%${query}%,description.ilike.%${query}%`);

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { results: data ?? [] },
    };
  },
});
