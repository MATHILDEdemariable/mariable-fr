import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction de mapping intelligent via table wedding_synonyms
async function mapToDbValue(supabase: any, inputValue: string, type: 'categorie' | 'region'): Promise<string | null> {
  if (!inputValue) return null;
  
  console.log(`🔍 Mapping "${inputValue}" (type: ${type})`);
  
  // Requête à la table wedding_synonyms
  const { data, error } = await supabase
    .from('wedding_synonyms')
    .select('db_value, priority')
    .eq('type', type)
    .ilike('input_value', inputValue)
    .order('priority', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error) {
    console.error(`❌ Erreur mapping ${type}:`, error);
    return null;
  }
  
  if (data) {
    console.log(`✅ Mapping trouvé: "${inputValue}" → "${data.db_value}"`);
    return data.db_value;
  }
  
  console.log(`⚠️ Aucun mapping trouvé pour "${inputValue}"`);
  return null;
}

// Système de détection de catégorie (FALLBACK - non utilisé maintenant)
function detectVendorCategory(message: string): string | null {
  const messageNormalized = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const categoryKeywords: { [key: string]: string[] } = {
    "Lieu de réception": ["lieu", "salle", "reception", "domaine", "chateau", "manoir", "grange", "espace"],
    "Photographe": ["photographe", "photo", "photographie", "shooter"],
    "Vidéaste": ["videaste", "video", "film", "cinematographe", "cameraman"],
    "Traiteur": ["traiteur", "catering", "repas", "buffet", "cocktail", "cuisine"],
    "DJ": ["dj", "musique", "sono", "sonorisation", "sound"],
    "Fleuriste": ["fleuriste", "fleur", "bouquet", "decoration florale", "composition florale"],
    "Wedding planner": ["wedding planner", "organisateur", "planificateur", "coordination", "wedding designer"],
    "Coiffure": ["coiffeur", "coiffure", "cheveux", "hair"],
    "Maquillage": ["maquilleur", "maquillage", "beaute", "makeup"],
    "Robe de mariée": ["robe", "mariee", "couturier", "couture", "dress"],
    "Costume": ["costume", "marie", "smoking", "tailleur", "suit"],
    "Pâtissier": ["patissier", "gateau", "piece montee", "dessert", "wedding cake"],
    "Décorateur": ["decorateur", "decoration", "scenographie", "deco"],
    "Animation": ["animation", "animateur", "jeux", "spectacle", "entertainment"],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => messageNormalized.includes(keyword))) {
      return category;
    }
  }
  
  return null;
}

// Extraction et normalisation de la région
function extractLocationFromMessage(message: string): string | null {
  const messageNormalized = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const regionMapping: { [key: string]: string } = {
    "ile-de-france": "Île-de-France",
    "ile de france": "Île-de-France",
    "paris": "Île-de-France",
    "provence": "Provence-Alpes-Côte d'Azur",
    "paca": "Provence-Alpes-Côte d'Azur",
    "cote d'azur": "Provence-Alpes-Côte d'Azur",
    "cote dazur": "Provence-Alpes-Côte d'Azur",
    "auvergne-rhone-alpes": "Auvergne-Rhône-Alpes",
    "auvergne rhone alpes": "Auvergne-Rhône-Alpes",
    "bretagne": "Bretagne",
    "nouvelle-aquitaine": "Nouvelle-Aquitaine",
    "nouvelle aquitaine": "Nouvelle-Aquitaine",
    "occitanie": "Occitanie",
    "grand est": "Grand Est",
    "hauts-de-france": "Hauts-de-France",
    "hauts de france": "Hauts-de-France",
    "normandie": "Normandie",
    "centre-val de loire": "Centre-Val de Loire",
    "centre val de loire": "Centre-Val de Loire",
    "bourgogne-franche-comte": "Bourgogne-Franche-Comté",
    "bourgogne franche comte": "Bourgogne-Franche-Comté",
    "pays de la loire": "Pays de la Loire",
  };

  for (const [key, region] of Object.entries(regionMapping)) {
    if (messageNormalized.includes(key)) {
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
    const { messages } = await req.json();
    
    console.log('🚀 Vibe Wedding AI - Historique reçu:', messages.length, 'messages');

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY non configurée');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Appel à Lovable AI pour extraction des critères avec TOUT l'historique
    const systemPrompt = `Tu es un assistant spécialisé dans le matching de prestataires de mariage.
Analyse TOUTE la conversation avec le couple et extrais les informations suivantes en JSON STRICT (AUCUN texte en dehors du JSON) :
{
  "categorie": "Photographe|Lieu de réception|Traiteur|DJ|Fleuriste|Wedding planner|Coiffure|Maquillage|Robe de mariée|Costume|Pâtissier|Décorateur|Vidéaste|Animation",
  "region": "Île-de-France|Provence-Alpes-Côte d'Azur|Auvergne-Rhône-Alpes|Bretagne|Nouvelle-Aquitaine|Occitanie|Grand Est|Hauts-de-France|Normandie|Centre-Val de Loire|Bourgogne-Franche-Comté|Pays de la Loire",
  "style": ["champetre", "moderne", "boheme", "classique", "vintage", "romantique", "industriel", "chic"],
  "budget_max": 5000,
  "nombre_invites": 100,
  "conversationalResponse": "Message naturel et encourageant pour le couple"
}

IMPORTANT:
- GARDE EN MÉMOIRE les informations des messages précédents (ex: si "traiteur" est mentionné dans un message et "Île-de-France" dans un autre, combine les deux)
- Si la catégorie n'est pas claire dans TOUTE la conversation, mets "categorie": null
- Si la région n'est pas mentionnée dans TOUTE la conversation, mets "region": null
- Le conversationalResponse doit être chaleureux et professionnel
- RÉPONDS UNIQUEMENT EN JSON, PAS DE TEXTE AVANT OU APRÈS`;

    console.log('🤖 Appel à Lovable AI...');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('❌ Erreur Lovable AI:', aiResponse.status, errorText);
      throw new Error(`Lovable AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('✅ Réponse Lovable AI reçue');
    
    let extractedData;
    try {
      const aiContent = aiData.choices[0].message.content;
      console.log('📦 Contenu AI:', aiContent);
      
      // Extraire le JSON de la réponse
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        extractedData = JSON.parse(aiContent);
      }
    } catch (parseError) {
      console.error('❌ Erreur parsing JSON:', parseError);
      // Fallback: détection manuelle sur le dernier message
      const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content;
      
      if (!lastUserMessage) {
        extractedData = {
          categorie: null,
          region: null,
          conversationalResponse: "Je vais vous aider à trouver le prestataire idéal ! Pouvez-vous préciser ce que vous recherchez ?"
        };
      } else {
        extractedData = {
          categorie: detectVendorCategory(lastUserMessage),
          region: extractLocationFromMessage(lastUserMessage),
          conversationalResponse: "Je vais vous aider à trouver le prestataire idéal ! Pouvez-vous préciser ce que vous recherchez ?"
        };
      }
    }

    console.log('🔍 Données extraites (brutes):', extractedData);
    
    // Mapper les valeurs via wedding_synonyms
    if (extractedData.categorie) {
      const mappedCategorie = await mapToDbValue(supabase, extractedData.categorie, 'categorie');
      extractedData.categorie = mappedCategorie || extractedData.categorie;
    }
    
    if (extractedData.region) {
      const mappedRegion = await mapToDbValue(supabase, extractedData.region, 'region');
      extractedData.region = mappedRegion || extractedData.region;
    }

    console.log('🔍 Données extraites (après mapping):', extractedData);

    // Si pas de catégorie, demander de sélectionner
    if (!extractedData.categorie) {
      return new Response(
        JSON.stringify({
          conversationalResponse: extractedData.conversationalResponse || "Je peux vous aider à trouver des prestataires ! Sélectionnez le type de prestataire que vous recherchez :",
          vendors: [],
          needsRegion: false,
          needsCategory: true,
          detectedCategory: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Recherche NATIONALE (pas de filtre région strict)
    console.log(`🔎 Recherche NATIONALE: ${extractedData.categorie}${extractedData.region ? ' (boost pour ' + extractedData.region + ')' : ''}`);
    
    let query = supabase
      .from('prestataires_rows')
      .select('id, nom, categorie, ville, region, description, prix_a_partir_de, partner, featured, site_web, email, telephone, styles')
      .eq('categorie::text', extractedData.categorie)
      .eq('visible', true)
      .order('featured', { ascending: false });

    // Filtrer par budget si spécifié
    if (extractedData.budget_max && extractedData.budget_max > 0) {
      query = query.lte('prix_a_partir_de', extractedData.budget_max);
    }

    const { data: vendors, error: dbError } = await query.limit(20);

    if (dbError) {
      console.error('❌ Erreur DB:', dbError);
      throw dbError;
    }

    console.log(`📦 ${vendors?.length || 0} prestataires trouvés`);

    // ÉTAPE 2: Récupérer les photos pour ces prestataires (requête séparée)
    let vendorsWithPhotos = vendors || [];
    
    if (vendors && vendors.length > 0) {
      const vendorIds = vendors.map(v => v.id);
      
      const { data: photos, error: photosError } = await supabase
        .from('prestataires_photos_preprod')
        .select('prestataire_id, url, principale')
        .in('prestataire_id', vendorIds);

      if (!photosError && photos) {
        console.log(`📸 ${photos.length} photos récupérées`);
        
        // Fusionner les photos avec les prestataires
        vendorsWithPhotos = vendors.map(vendor => {
          const vendorPhotos = photos.filter(p => p.prestataire_id === vendor.id);
          const mainPhoto = vendorPhotos.find(p => p.principale);
          const photo_url = mainPhoto?.url || vendorPhotos[0]?.url || null;
          
          return {
            ...vendor,
            photo_url,
            prestataires_photos: vendorPhotos
          };
        });
      } else {
        console.log('⚠️ Aucune photo trouvée ou erreur:', photosError);
        // Ajouter photo_url null par défaut
        vendorsWithPhotos = vendors.map(v => ({ ...v, photo_url: null, prestataires_photos: [] }));
      }
    }

    // ÉTAPE 3: Calculer un score de match intelligent pour chaque prestataire
    const vendorsWithScore = vendorsWithPhotos.map(vendor => {
      let matchScore = 60; // Score de base pour tous (nationaux)

      // BOOST RÉGIONAL +20 points si région correspond
      if (extractedData.region && vendor.region === extractedData.region) {
        matchScore += 20;
      }

      // Bonus pour les styles correspondants
      if (extractedData.style && Array.isArray(extractedData.style)) {
        const vendorStyles = vendor.styles || [];
        const matchingStyles = extractedData.style.filter((style: string) => 
          vendorStyles.some((vs: string) => vs.toLowerCase().includes(style.toLowerCase()))
        );
        matchScore += matchingStyles.length * 5;
      }

      // Bonus budget
      if (extractedData.budget_max && vendor.prix_a_partir_de) {
        const priceRatio = vendor.prix_a_partir_de / extractedData.budget_max;
        if (priceRatio <= 0.7) matchScore += 10;
        else if (priceRatio <= 1.0) matchScore += 5;
      }

      // Bonus photos
      const photos = vendor.prestataires_photos || [];
      if (photos.length > 0) matchScore += 5;
      if (photos.length > 3) matchScore += 5;

      // Bonus featured/partner
      if (vendor.featured) matchScore += 10;
      if (vendor.partner) matchScore += 5;

      // Bonus description détaillée
      if (vendor.description && vendor.description.length > 200) matchScore += 5;

      return {
        ...vendor,
        matchScore: Math.min(matchScore, 100)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    const topVendors = vendorsWithScore.slice(0, 8);

    const response = {
      conversationalResponse: extractedData.conversationalResponse || 
        (extractedData.region 
          ? `J'ai trouvé ${topVendors.length} ${extractedData.categorie.toLowerCase()} qui correspondent à vos critères ! Les prestataires en ${extractedData.region} sont mis en avant. 🎉`
          : `Voici ${topVendors.length} ${extractedData.categorie.toLowerCase()} recommandés. Précisez votre région pour affiner les résultats ! 🎉`),
      vendors: topVendors,
      category: extractedData.categorie,
      region: extractedData.region,
      needsRegion: !extractedData.region
    };

    console.log('📤 Envoi de la réponse avec', topVendors.length, 'prestataires');

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Erreur globale:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        conversationalResponse: "Désolé, une erreur s'est produite. Pouvez-vous reformuler votre demande ?",
        vendors: []
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
