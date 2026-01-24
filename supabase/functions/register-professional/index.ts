import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 register-professional: Démarrage de la fonction');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log('📝 Données reçues:', { nom: body.nom, categorie: body.categorie, email: body.email });
    
    // Validation basique
    if (!body.nom || !body.email || !body.siret || !body.categorie) {
      throw new Error('Champs obligatoires manquants')
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw new Error('Email invalide')
    }

    // Générer le slug
    const slug = await generateUniqueSlug(body.nom, supabase)
    console.log('🔗 Slug généré:', slug);

    // Insérer le prestataire
    const { data, error } = await supabase
      .from('prestataires_rows')
      .insert({
        nom: body.nom,
        categorie: body.categorie,
        regions: body.region ? [body.region] : null,
        email: body.email,
        telephone: body.telephone || null,
        site_web: body.site_web || null,
        siret: body.siret,
        assurance_nom: body.assurance_nom,
        prix_minimum: body.prix_minimum,
        description: body.description || null,
        avantage_propose: body.avantage_propose || null,
        accord_referencement: body.accord_referencement,
        accord_cgv: body.accord_cgv,
        visible: false,
        featured: false,
        slug: slug,
        source_inscription: 'formulaire'
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur insertion:', error);
      throw error;
    }

    console.log('✅ Prestataire créé avec succès:', data.id);

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('❌ Erreur dans register-professional:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function generateUniqueSlug(nom: string, supabase: any): Promise<string> {
  let baseSlug = nom
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!baseSlug) baseSlug = 'prestataire';

  let slug = baseSlug
  let counter = 1

  while (true) {
    const { data } = await supabase
      .from('prestataires_rows')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (!data) break
    
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}
