import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const customStyles = `body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}
h1 { font-size: 2.5em; margin-bottom: 0.5em; }
h2 { font-size: 2em; margin-top: 1.5em; }
h3 { font-size: 1.5em; margin-top: 1.2em; }
p { margin: 1em 0; }
ul { margin: 1em 0; padding-left: 2em; }
a { color: #0066cc; text-decoration: underline; }
a:hover { color: #0052a3; }`;

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Mettre à jour les 2 articles
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ custom_styles: customStyles })
      .in('slug', [
        'styles-photo-mariage-trouvez-l-inspiration-parfaite-pour-votre-grand-jour',
        'coordination-jour-j-mariage-votre-guide-ultime-pour-un-jour-parfait'
      ])
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Articles mis à jour avec succès',
        updatedArticles: data 
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour des articles:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
});
