import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction pour détecter la catégorie de prestataire
function detectCategory(message: string): string | null {
  const messageNormalized = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const categoryKeywords: { [key: string]: string[] } = {
    "Lieu de réception": ["lieu", "salle", "reception", "domaine", "chateau", "manoir", "grange"],
    "Photographe": ["photographe", "photo", "photographie"],
    "Vidéaste": ["videaste", "video", "film", "cinematographe"],
    "Traiteur": ["traiteur", "catering", "repas", "buffet", "cocktail"],
    "DJ": ["dj", "musique", "sono", "sonorisation"],
    "Fleuriste": ["fleuriste", "fleur", "bouquet", "decoration florale"],
    "Wedding planner": ["wedding planner", "organisateur", "planificateur", "coordination"],
    "Coiffure": ["coiffeur", "coiffure", "cheveux"],
    "Maquillage": ["maquilleur", "maquillage", "beaute"],
    "Robe de mariée": ["robe", "mariee", "couturier", "couture"],
    "Costume": ["costume", "marie", "smoking", "tailleur"],
    "Pâtissier": ["patissier", "gateau", "piece montee", "dessert"],
    "Décorateur": ["decorateur", "decoration", "scenographie"],
    "Animation": ["animation", "animateur", "jeux", "spectacle"],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => messageNormalized.includes(keyword))) {
      return category;
    }
  }
  
  return null;
}

// Fonction pour extraire la région
function extractRegion(message: string): string | null {
  const messageNormalized = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const regionMapping: { [key: string]: string } = {
    "ile-de-france": "Île-de-France",
    "paris": "Île-de-France",
    "provence": "Provence-Alpes-Côte d'Azur",
    "paca": "Provence-Alpes-Côte d'Azur",
    "cote d'azur": "Provence-Alpes-Côte d'Azur",
    "auvergne-rhone-alpes": "Auvergne-Rhône-Alpes",
    "bretagne": "Bretagne",
    "nouvelle-aquitaine": "Nouvelle-Aquitaine",
    "occitanie": "Occitanie",
    "grand est": "Grand Est",
    "hauts-de-france": "Hauts-de-France",
    "normandie": "Normandie",
    "centre-val de loire": "Centre-Val de Loire",
    "bourgogne-franche-comte": "Bourgogne-Franche-Comté",
    "pays de la loire": "Pays de la Loire",
  };

  for (const [key, region] of Object.entries(regionMapping)) {
    if (messageNormalized.includes(key)) {
      return region;
    }
  }
  
  return null;
}

// Fonction pour extraire le budget
function extractBudget(message: string): { min?: number; max?: number } | null {
  const budgetMatch = message.match(/(\d+)\s*k?\s*(euros?|€)/i);
  if (budgetMatch) {
    const amount = parseInt(budgetMatch[1]);
    const budget = amount > 1000 ? amount : amount * 1000;
    return { max: budget };
  }
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, category, region } = await req.json();
    
    console.log('📨 Matching request:', { message, category, region });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Détecter la catégorie et la région si non fournies
    const detectedCategory = category || detectCategory(message);
    const detectedRegion = region || extractRegion(message);
    const budget = extractBudget(message);

    console.log('🔍 Detection:', { detectedCategory, detectedRegion, budget });

    // Si pas de catégorie détectée, retourner un message conversationnel
    if (!detectedCategory) {
      return new Response(
        JSON.stringify({
          conversationalResponse: "Je peux vous aider à trouver des prestataires ! Dites-moi ce que vous cherchez : un photographe, un lieu de réception, un traiteur... ?",
          vendors: [],
          needsRegion: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Si catégorie mais pas de région, demander la région
    if (!detectedRegion) {
      return new Response(
        JSON.stringify({
          conversationalResponse: `D'accord ! Je peux vous proposer des ${detectedCategory.toLowerCase()}. Dans quelle région cherchez-vous ?`,
          vendors: [],
          needsRegion: true,
          detectedCategory
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Recherche dans prestataires_rows
    let query = supabase
      .from('prestataires_rows')
      .select('*')
      .eq('categorie', detectedCategory)
      .eq('region', detectedRegion)
      .limit(10);

    // Filtrer par budget si spécifié
    if (budget?.max) {
      query = query.lte('prix_a_partir_de', budget.max);
    }

    const { data: vendors, error } = await query;

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log(`✅ Found ${vendors?.length || 0} vendors`);

    // Calculer un score de match pour chaque prestataire
    const vendorsWithScore = (vendors || []).map(vendor => ({
      ...vendor,
      matchScore: calculateMatchScore(vendor, message, budget)
    })).sort((a, b) => b.matchScore - a.matchScore);

    const response = {
      conversationalResponse: `J'ai trouvé ${vendorsWithScore.length} ${detectedCategory.toLowerCase()} en ${detectedRegion} qui correspondent à vos critères !`,
      vendors: vendorsWithScore.slice(0, 8),
      category: detectedCategory,
      region: detectedRegion,
      needsRegion: false
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        conversationalResponse: "Désolé, une erreur s'est produite. Pouvez-vous reformuler votre demande ?"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Fonction pour calculer un score de match (0-100)
function calculateMatchScore(vendor: any, message: string, budget: any): number {
  let score = 60; // Score de base

  const messageNormalized = message.toLowerCase();

  // Bonus si le style correspond
  const styles = ['champetre', 'moderne', 'classique', 'boheme', 'vintage', 'romantique'];
  styles.forEach(style => {
    if (messageNormalized.includes(style) && 
        vendor.sous_categorie?.toLowerCase().includes(style)) {
      score += 15;
    }
  });

  // Bonus si dans le budget
  if (budget?.max && vendor.prix_a_partir_de) {
    const priceRatio = vendor.prix_a_partir_de / budget.max;
    if (priceRatio <= 0.8) score += 10; // Bien dans le budget
    else if (priceRatio <= 1.0) score += 5; // Juste dans le budget
  }

  // Bonus si a des photos
  if (vendor.photo_principale_url) score += 5;

  // Bonus si a Instagram
  if (vendor.instagram_url) score += 5;

  // Bonus si description détaillée
  if (vendor.description_courte && vendor.description_courte.length > 100) score += 5;

  return Math.min(score, 100);
}
