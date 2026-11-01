// Import ponctuel de 7 articles de blog (à supprimer après usage).
import { createClient } from 'npm:@supabase/supabase-js@2';
import rows from './rows.json' with { type: 'json' };
Deno.serve(async (req) => {
  if (req.headers.get('x-import-key') !== 'mariable-blog-2026-11-01') return new Response('forbidden', { status: 403 });
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data, error } = await supabase.from('blog_posts').upsert(rows, { onConflict: 'slug' }).select('slug');
  if (error) { console.error('❌ import failed', error); return new Response(JSON.stringify(error), { status: 500 }); }
  return new Response(JSON.stringify(data));
});
