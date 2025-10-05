import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map city names to French regions
const cityToRegionMap: Record<string, string> = {
  'paris': 'Île-de-France',
  'lyon': 'Auvergne-Rhône-Alpes',
  'marseille': 'Provence-Alpes-Côte d\'Azur',
  'bordeaux': 'Nouvelle-Aquitaine',
  'toulouse': 'Occitanie',
  'nantes': 'Pays de la Loire',
  'strasbourg': 'Grand Est',
  'lille': 'Hauts-de-France',
  'rennes': 'Bretagne',
  'montpellier': 'Occitanie',
  'nice': 'Provence-Alpes-Côte d\'Azur',
  'dijon': 'Bourgogne-Franche-Comté',
  'reims': 'Grand Est',
  'tours': 'Centre-Val de Loire',
  'angers': 'Pays de la Loire',
  'grenoble': 'Auvergne-Rhône-Alpes',
  'rouen': 'Normandie',
  'caen': 'Normandie',
  'ajaccio': 'Corse',
  'bastia': 'Corse'
};

function detectVendorCategory(message: string): string | null {
  const messageLower = message.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    'Traiteur': ['traiteur', 'restauration', 'buffet', 'repas', 'menu', 'nourriture', 'cuisine'],
    'Photographe': ['photographe', 'photo', 'photographie', 'shooting', 'cliché'],
    'Vidéaste': ['vidéaste', 'vidéo', 'film', 'cinéma', 'caméra'],
    'DJ': ['dj', 'musique', 'animation musicale', 'soirée', 'ambiance'],
    'Fleuriste': ['fleuriste', 'fleur', 'bouquet', 'décoration florale', 'centre de table'],
    'Salle de réception': ['salle', 'lieu', 'réception', 'domaine', 'château', 'espace', 'endroit'],
    'Wedding planner': ['wedding planner', 'organisateur', 'coordination', 'planificateur'],
    'Coiffeur': ['coiffeur', 'coiffure', 'maquillage', 'beauté', 'esthétique'],
    'Robe de mariée': ['robe', 'mariée', 'couture', 'costume', 'tenue'],
    'Officiant': ['officiant', 'cérémonie', 'célébrant'],
    'Location': ['location', 'mobilier', 'vaisselle', 'matériel'],
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => messageLower.includes(keyword))) {
      console.log(`✅ Catégorie détectée: ${category} (mot-clé: ${keywords.find(k => messageLower.includes(k))})`);
      return category;
    }
  }
  
  console.log('❌ Aucune catégorie détectée dans:', message);
  return null;
}

function extractLocationFromMessage(message: string): string | null {
  const messageLower = message.toLowerCase();
  
  // Check for city names and convert to regions
  for (const [city, region] of Object.entries(cityToRegionMap)) {
    if (messageLower.includes(city)) {
      console.log(`✅ City detected: ${city} → ${region}`);
      return region;
    }
  }
  
  // Check for direct region names
  const frenchRegions = [
    'Île-de-France', 'Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur',
    'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', 'Grand Est',
    'Hauts-de-France', 'Bretagne', 'Normandie', 'Bourgogne-Franche-Comté',
    'Centre-Val de Loire', 'Corse'
  ];
  
  for (const region of frenchRegions) {
    if (messageLower.includes(region.toLowerCase())) {
      return region;
    }
  }
  
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, region, conversationId, sessionId, currentProject } = await req.json();
    
    console.log("📨 Vendor Search AI - Request:", {
      conversationId,
      sessionId,
      messageLength: message?.length,
      providedRegion: region,
      hasCurrentProject: !!currentProject
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Detect vendor category
    const detectedCategory = detectVendorCategory(message);
    const locationFromMessage = extractLocationFromMessage(message);
    
    console.log("🔍 Detection:", { 
      detectedCategory, 
      locationFromMessage,
      providedRegion: region 
    });

    // Determine search region
    let searchRegion = region || locationFromMessage || currentProject?.weddingData?.location;

    // If no region and category detected, ask for region
    if (detectedCategory && !searchRegion) {
      console.log("❓ Category detected but no region - asking user");
      return new Response(
        JSON.stringify({
          mode: "ask_location",
          message: `Pour vous proposer des ${detectedCategory.toLowerCase()}s, dans quelle région de France se déroulera votre mariage ?`,
          detectedCategory,
          askLocation: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If we have both category and region, perform search
    if (detectedCategory && searchRegion) {
      console.log(`🔍 Searching: ${detectedCategory} in region "${searchRegion}"`);

      const { data: vendors, error: vendorError } = await supabase
        .from('prestataires_rows')
        .select('*')
        .eq('categorie', detectedCategory)
        .eq('region', searchRegion)
        .limit(10);

      if (vendorError) {
        console.error("❌ Error fetching vendors:", vendorError);
      }

      console.log(`✅ Found ${vendors?.length || 0} vendors`);

      // Generate AI message with vendor results
      const systemPrompt = `Tu es un assistant de recherche de prestataires de mariage.
L'utilisateur recherche : ${detectedCategory}
Région : ${searchRegion}
Nombre de résultats trouvés : ${vendors?.length || 0}

Présente les résultats de manière chaleureuse et professionnelle.
Si aucun prestataire n'est trouvé, propose de chercher dans une région voisine ou une autre catégorie.`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ]
        }),
      });

      const aiData = await aiResponse.json();
      const aiMessage = aiData.choices[0]?.message?.content || 
        `J'ai trouvé ${vendors?.length || 0} ${detectedCategory.toLowerCase()}(s) dans la région ${searchRegion}.`;

      return new Response(
        JSON.stringify({
          mode: "vendor_results",
          message: aiMessage,
          vendors: vendors || [],
          searchedCategory: detectedCategory,
          searchedRegion: searchRegion
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no category detected, use AI to help
    const systemPrompt = `Tu es un assistant de recherche de prestataires de mariage.
Aide l'utilisateur à trouver des prestataires en :
1. Identifiant le type de prestataire recherché
2. Demandant la région si nécessaire
3. Proposant des suggestions

Tu NE MODIFIES PAS le projet de mariage, tu aides uniquement à la recherche de prestataires.

Sois chaleureux et professionnel.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      }),
    });

    const aiData = await aiResponse.json();
    const aiMessage = aiData.choices[0]?.message?.content || 
      "Je peux vous aider à trouver des prestataires pour votre mariage. Que recherchez-vous ?";

    return new Response(
      JSON.stringify({
        mode: "conversational",
        message: aiMessage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Vendor Search AI Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        mode: "conversational",
        message: "Désolé, une erreur s'est produite. Pouvez-vous reformuler votre recherche ?"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
