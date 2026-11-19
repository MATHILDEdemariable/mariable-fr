// Copilote IA Mariable : conseils basés sur la méthode Mariable + recherche dans l'annuaire.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { generateResponse, GatewayError } from 'npm:@lovable.dev/ai-gateway';
import { z } from 'npm:zod@3';
import { SYSTEM_PROMPT } from './systemPrompt.ts';

const MODEL = 'openai/gpt-6.1-terra';
const MAX_TOOL_ROUNDS = 3;

const BodySchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(4000),
  })).min(1).max(30),
});

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

const TOOLS = [
  {
    type: 'function' as const,
    name: 'rechercher_prestataires',
    description: "Cherche des prestataires réels dans l'annuaire Mariable. À utiliser dès que l'utilisateur cherche un lieu, traiteur, photographe, wedding planner, etc.",
    strict: false,
    parameters: {
      type: 'object',
      properties: {
        categorie: { type: 'string', description: "Une catégorie exacte parmi : Lieu de réception, Photographe, Traiteur, Vidéaste, Coordination (= wedding planner), Fleuriste, Mise en beauté, Décoration" },
        ville: { type: 'string', description: 'Ville ou région' },
        mot_cle: { type: 'string', description: 'Mot-clé libre (style, ambiance)' },
      },
      additionalProperties: false,
    },
  },
];

type Vendor = { nom: string; slug: string | null; categorie: string | null; ville: string | null; prix_a_partir_de: number | null; prix_par_personne: number | null; google_rating: number | null };

async function searchVendors(args: { categorie?: string; ville?: string; mot_cle?: string }): Promise<Vendor[]> {
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
  const clean = (v?: string) => (v ?? '').replace(/[^\p{L}\p{N}\s'’-]/gu, '').trim().slice(0, 80);
  let query = supabase.from('prestataires_rows')
    .select('nom,slug,categorie,ville,prix_a_partir_de,prix_par_personne,google_rating')
    .eq('visible', true).limit(6);
  const rawCategorie = clean(args.categorie);
  const CATEGORIES = ['Lieu de réception', 'Photographe', 'Traiteur', 'Vidéaste', 'Coordination', 'Fleuriste', 'Mise en beauté', 'Décoration'];
  const normalize = (v: string) => v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const categorie = /planner|coordin/i.test(rawCategorie)
    ? 'Coordination'
    : /lieu|domaine|chateau|salle/i.test(normalize(rawCategorie))
      ? 'Lieu de réception'
      : CATEGORIES.find((c) => normalize(rawCategorie).includes(normalize(c).split(' ')[0])) ?? '';
  const ville = clean(args.ville);
  const motCle = clean(args.mot_cle);
  if (categorie) query = query.eq('categorie', categorie);
  if (ville) query = query.ilike("ville", `%${ville}%`);
  if (motCle) query = query.or(`nom.ilike.%${motCle}%,description.ilike.%${motCle}%`);
  let { data, error } = await query;
  // Aucun résultat dans la ville : on élargit à toute la France pour proposer quand même des prestataires.
  if (!error && (data ?? []).length === 0 && ville) {
    return searchVendors({ categorie: args.categorie, mot_cle: args.mot_cle });
  }
  if (error) {
    console.error('❌ searchVendors failed:', error.message);
    return [];
  }
  return (data ?? []) as Vendor[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: 'Requête invalide' }, 400);

  const input: any[] = parsed.data.messages.map((m) => ({ role: m.role, content: m.content }));
  const foundVendors: Vendor[] = [];

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const response: any = await generateResponse({
        model: MODEL,
        instructions: SYSTEM_PROMPT,
        input,
        tools: round < MAX_TOOL_ROUNDS ? TOOLS : undefined,
        reasoning: { effort: 'low' },
      } as any);

      const output: any[] = response.output ?? [];
      const calls = output.filter((item) => item.type === 'function_call');
      if (calls.length === 0) {
        const reply = output
          .filter((item) => item.type === 'message')
          .flatMap((item) => item.content ?? [])
          .filter((c: any) => c.type === 'output_text')
          .map((c: any) => c.text)
          .join('\n').trim();
        const unique = Array.from(new Map(foundVendors.filter((v) => v.slug).map((v) => [v.slug, v])).values()).slice(0, 6);
        return json({ reply: reply || "Désolé, je n'ai pas de réponse pour le moment.", vendors: unique });
      }

      input.push(...output);
      for (const call of calls) {
        let args = {};
        try { args = JSON.parse(call.arguments || '{}'); } catch { /* arguments invalides */ }
        const vendors = await searchVendors(args);
        foundVendors.push(...vendors);
        input.push({ type: 'function_call_output', call_id: call.call_id, output: JSON.stringify(vendors) });
      }
    }
    return json({ reply: "Désolé, je n'ai pas pu terminer la recherche.", vendors: [] });
  } catch (error) {
    if (error instanceof GatewayError) {
      console.error('❌ copilote-ia gateway error:', error.code, error.httpStatus);
      if (error.httpStatus === 429) return json({ error: 'Trop de demandes, réessayez dans un instant.' }, 429);
      if (error.httpStatus === 402) return json({ error: 'Service IA momentanément indisponible.' }, 402);
    } else {
      console.error('❌ copilote-ia failed:', error);
    }
    return json({ error: "L'assistant est indisponible pour le moment." }, 500);
  }
});
