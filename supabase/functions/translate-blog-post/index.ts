// Traduit UN article FR non encore traduit en anglais et l'insère (idempotent).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

const callModel = async (system: string, user: string, json = false) => {
  const response = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'google/gemini-3.8-flash',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  if (!response.ok) throw new Error(`AI ${response.status}: ${await response.text()}`);
  const data = await response.json();
  return String(data.choices?.[0]?.message?.content ?? '').trim();
};

const slugify = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const reply = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: translated } = await supabase.from('blog_posts').select('translation_of').not('translation_of', 'is', null);
    const doneIds = new Set((translated ?? []).map((row) => row.translation_of));
    const { data: sources, error } = await supabase.from('blog_posts').select('*').eq('language', 'fr').order('created_at');
    if (error) throw error;
    const remaining = (sources ?? []).filter((post) => !doneIds.has(post.id));
    const source = remaining[0];
    if (!source) return reply({ done: true, remaining: 0 });

    console.log('🚀 translating', source.slug);
    const meta = JSON.parse(await callModel(
      'You translate French wedding-planning blog metadata into natural, SEO-optimised British/International English. Keep the brand name "Mariable". Return JSON only.',
      `Return JSON with keys: title, subtitle, meta_title (max 60 chars), meta_description (max 160 chars), h1_title, h2_titles (array, same order), slug (short english seo slug), category (english), tags (array).\n\n${JSON.stringify({
        title: source.title, subtitle: source.subtitle, meta_title: source.meta_title, meta_description: source.meta_description,
        h1_title: source.h1_title, h2_titles: source.h2_titles, category: source.category, tags: source.tags,
      })}`,
      true,
    ));

    let content = source.content
      ? await callModel(
          'You are a professional translator. Translate the French HTML article into fluent, natural English. Keep EVERY HTML tag, attribute, class, table, link href and image src exactly as is; translate only visible text and alt/title attributes. Do not summarise, do not add or remove content. Keep "Mariable" and mariable.fr. Output raw HTML only, no markdown fences.',
          source.content,
        )
      : source.content;
    content = content?.replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/i, '');

    let slug = slugify(meta.slug || meta.title || `${source.slug}-en`) || `${source.slug}-en`;
    const { data: clash } = await supabase.from('blog_posts').select('id').eq('slug', slug).maybeSingle();
    if (clash) slug = `${slug}-en`;

    const { error: insertError } = await supabase.from('blog_posts').insert({
      title: meta.title, subtitle: meta.subtitle ?? null, slug, content,
      background_image_url: source.background_image_url, meta_title: meta.meta_title, meta_description: meta.meta_description,
      h1_title: meta.h1_title, h2_titles: meta.h2_titles ?? source.h2_titles, status: source.status, featured: source.featured,
      order_index: source.order_index, tags: meta.tags ?? source.tags, category: meta.category ?? source.category,
      custom_styles: source.custom_styles, language: 'en', audience: source.audience, published_at: source.published_at,
      translation_of: source.id,
    });
    if (insertError) throw insertError;
    console.log('✅ translated', source.slug, '->', slug);
    return reply({ done: false, from: source.slug, to: slug, remaining: remaining.length - 1 });
  } catch (error) {
    console.error('❌ translate-blog-post failed:', error);
    return reply({ error: String((error as Error)?.message ?? error) }, 500);
  }
});
