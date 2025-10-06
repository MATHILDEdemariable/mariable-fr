import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapping des régions limitrophes
const REGIONS_LIMITROPHES: Record<string, string[]> = {
  'Île-de-France': ['Hauts-de-France', 'Normandie', 'Centre-Val de Loire', 'Bourgogne-Franche-Comté'],
  'Provence-Alpes-Côte d\'Azur': ['Auvergne-Rhône-Alpes', 'Occitanie', 'Corse'],
  'Auvergne-Rhône-Alpes': ['Bourgogne-Franche-Comté', 'Provence-Alpes-Côte d\'Azur', 'Occitanie'],
  'Nouvelle-Aquitaine': ['Pays de la Loire', 'Centre-Val de Loire', 'Occitanie'],
  'Occitanie': ['Nouvelle-Aquitaine', 'Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur'],
  'Hauts-de-France': ['Île-de-France', 'Normandie', 'Grand Est'],
  'Normandie': ['Hauts-de-France', 'Île-de-France', 'Centre-Val de Loire', 'Pays de la Loire', 'Bretagne'],
  'Grand Est': ['Hauts-de-France', 'Bourgogne-Franche-Comté'],
  'Bretagne': ['Normandie', 'Pays de la Loire'],
  'Pays de la Loire': ['Bretagne', 'Normandie', 'Centre-Val de Loire', 'Nouvelle-Aquitaine'],
  'Centre-Val de Loire': ['Île-de-France', 'Normandie', 'Pays de la Loire', 'Nouvelle-Aquitaine', 'Bourgogne-Franche-Comté'],
  'Bourgogne-Franche-Comté': ['Grand Est', 'Île-de-France', 'Centre-Val de Loire', 'Auvergne-Rhône-Alpes'],
  'Corse': ['Provence-Alpes-Côte d\'Azur']
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
    const systemPrompt = `Tu es un assistant spécialisé dans le matching de prestataires de mariage français.
    
    🎯 TON RÔLE:
    - Extraire la catégorie de prestataire (Photographe, Lieu de réception, Traiteur, DJ/Musicien, Fleuriste, etc.)
    - Extraire la région en France
    - Extraire le budget si mentionné
    - Extraire le style si mentionné
    
    📊 FONCTIONNALITÉS DASHBOARD MARIABLE:
    Si l'utilisateur pose une question sur ces sujets, TOUJOURS inclure le lien dans ta réponse:
    - **Budget**: "Gérez votre budget sur votre [Dashboard Budget](/dashboard/budget)"
    - **Check-list**: "Organisez vos tâches sur votre [Check-list](/dashboard/checklist-mariage)"
    - **Prestataires**: "Suivez vos contacts sur [Mes Prestataires](/dashboard/prestataires)"
    - **Planning Jour-J**: "Créez votre planning sur [Jour-J](/dashboard/jour-j)"
    
    🔍 EXEMPLES DE DÉTECTION:
    - "Je cherche un photographe à Paris" → {categorie: "Photographe", region: "Île-de-France"}
    - "Traiteur en Provence" → {categorie: "Traiteur", region: "Provence-Alpes-Côte d'Azur"}
    - "Château pour mariage Lyon" → {categorie: "Lieu de réception", region: "Auvergne-Rhône-Alpes"}
    
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
    - GARDE EN MÉMOIRE les informations des messages précédents
    - Si la catégorie n'est pas claire, mets "categorie": null
    - Si la région n'est pas mentionnée, mets "region": null
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

    const mappedCategorie = extractedData.categorie;
    const mappedRegion = extractedData.region;

    // 3. Si catégorie détectée → Recherche prestataires avec filtrage régional strict
    if (extractedData.categorie && mappedCategorie) {
      console.log('🔍 Recherche:', { categorie: mappedCategorie, region: mappedRegion });

      let vendors: any[] = [];
      let searchScope = 'exact'; // 'exact', 'limitrophe', 'national'

      // 1️⃣ RECHERCHE STRICTE PAR RÉGION (si région détectée)
      if (mappedRegion) {
        const { data: exactVendors } = await supabase
          .from('prestataires_rows')
          .select('*')
          .eq('categorie::text', mappedCategorie)
          .eq('region::text', mappedRegion)
          .eq('visible', true)
          .limit(8);

        vendors = exactVendors || [];
        console.log(`✅ Recherche exacte: ${vendors.length} résultats en ${mappedRegion}`);

        // 2️⃣ FALLBACK 1: Régions limitrophes (si < 4 résultats)
        if (vendors.length < 4) {
          const voisines = REGIONS_LIMITROPHES[mappedRegion] || [];
          console.log(`🔄 Élargissement aux régions limitrophes:`, voisines);

          if (voisines.length > 0) {
            const { data: neighborVendors } = await supabase
              .from('prestataires_rows')
              .select('*')
              .eq('categorie::text', mappedCategorie)
              .in('region::text', voisines)
              .eq('visible', true)
              .limit(4 - vendors.length);

            if (neighborVendors) {
              vendors = [
                ...vendors,
                ...neighborVendors.map(v => ({ ...v, _searchScope: 'limitrophe' }))
              ];
              searchScope = 'limitrophe';
            }
          }
        }

        // 3️⃣ FALLBACK 2: National (si toujours < 4 résultats)
        if (vendors.length < 4) {
          console.log(`🌍 Élargissement national`);

          const { data: nationalVendors } = await supabase
            .from('prestataires_rows')
            .select('*')
            .eq('categorie::text', mappedCategorie)
            .eq('visible', true)
            .neq('region::text', mappedRegion)
            .limit(4 - vendors.length);

          if (nationalVendors) {
            vendors = [
              ...vendors,
              ...nationalVendors.map(v => ({ ...v, _searchScope: 'national' }))
            ];
            searchScope = 'national';
          }
        }
      } else {
        // Si AUCUNE région détectée → Recherche nationale d'office
        const { data: nationalVendors } = await supabase
          .from('prestataires_rows')
          .select('*')
          .eq('categorie::text', mappedCategorie)
          .eq('visible', true)
          .limit(8);

        vendors = (nationalVendors || []).map(v => ({ ...v, _searchScope: 'national' }));
        searchScope = 'national';
      }

      console.log(`📦 ${vendors.length} prestataires trouvés`);

      // Récupération des photos
      const vendorIds = vendors.map(v => v.id);
      const { data: photos } = await supabase
        .from('prestataires_photos_preprod')
        .select('*')
        .in('prestataire_id', vendorIds);

      console.log(`📸 ${photos?.length || 0} photos récupérées`);

      // Calcul des matchScores avec bonus selon la portée géographique
      const vendorsWithScore = vendors.map(vendor => {
        const vendorPhotos = photos?.filter(p => p.prestataire_id === vendor.id) || [];
        
        let baseScore = 60;
        
        // Bonus selon la portée de recherche
        if (vendor._searchScope === 'exact') {
          baseScore = 80; // Région exacte
        } else if (vendor._searchScope === 'limitrophe') {
          baseScore = 40; // Région voisine
        } else {
          baseScore = 30; // National
        }

        // Bonus additionnels
        if (vendorPhotos.length > 0) baseScore += 10;
        if (vendor.featured) baseScore += 5;
        if (vendor.instagram) baseScore += 5;

        return {
          ...vendor,
          matchScore: Math.min(baseScore, 100),
          photo_url: vendorPhotos[0]?.url || null,
          isOutOfScope: vendor._searchScope !== 'exact' // Pour le badge
        };
      });

      // Limiter à 4 cartes
      const topVendors = vendorsWithScore
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 4);

      // Message conversationnel adaptatif
      let conversationalResponse = '';
      if (searchScope === 'exact') {
        conversationalResponse = `Voici ${topVendors.length} ${mappedCategorie} en ${mappedRegion} 🎯`;
      } else if (searchScope === 'limitrophe') {
        conversationalResponse = `Voici ${topVendors.length} ${mappedCategorie} en ${mappedRegion} et régions voisines 📍`;
      } else {
        conversationalResponse = mappedRegion 
          ? `Voici ${topVendors.length} ${mappedCategorie} recommandés (dont certains hors ${mappedRegion}) 🌍`
          : `Voici ${topVendors.length} ${mappedCategorie} recommandés. Précisez votre région pour affiner 🗺️`;
      }

      console.log('📤 Envoi de la réponse avec', topVendors.length, 'prestataires');

      return new Response(
        JSON.stringify({
          conversationalResponse,
          vendors: topVendors,
          needsRegion: !mappedRegion,
          detectedCategory: mappedCategorie
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
