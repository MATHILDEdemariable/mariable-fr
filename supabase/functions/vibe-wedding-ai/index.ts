import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Système de détection de catégorie
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
      const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';
      extractedData = {
        categorie: detectVendorCategory(lastUserMessage),
        region: extractLocationFromMessage(lastUserMessage),
        conversationalResponse: "Je vais vous aider à trouver le prestataire idéal ! Pouvez-vous préciser ce que vous recherchez ?"
      };
    }

    console.log('🔍 Données extraites:', extractedData);

    // Si pas de catégorie, demander plus de détails
    if (!extractedData.categorie) {
      return new Response(
        JSON.stringify({
          conversationalResponse: extractedData.conversationalResponse || "Je peux vous aider à trouver des prestataires ! Dites-moi ce que vous cherchez : un photographe, un lieu de réception, un traiteur... ?",
          vendors: [],
          needsRegion: false,
          detectedCategory: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Si catégorie mais pas de région, demander la région
    if (!extractedData.region) {
      return new Response(
        JSON.stringify({
          conversationalResponse: `Super ! Je peux vous proposer des ${extractedData.categorie.toLowerCase()}. Dans quelle région organisez-vous votre mariage ?`,
          vendors: [],
          needsRegion: true,
          detectedCategory: extractedData.categorie
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Recherche dans la base de données avec JOIN sur les photos
    console.log(`🔎 Recherche: ${extractedData.categorie} en ${extractedData.region}`);
    
    let query = supabase
      .from('prestataires_rows')
      .select(`
        id,
        nom,
        categorie,
        description,
        region,
        ville,
        prix_a_partir_de,
        styles,
        featured,
        partner,
        email,
        telephone,
        site_web,
        prestataires_photos(url, principale)
      `)
      .eq('categorie', extractedData.categorie)
      .eq('region', extractedData.region)
      .eq('visible', true)
      .order('featured', { ascending: false })
      .limit(20);

    // Filtrer par budget si spécifié
    if (extractedData.budget_max && extractedData.budget_max > 0) {
      query = query.lte('prix_a_partir_de', extractedData.budget_max);
    }

    const { data: vendors, error } = await query;

    if (error) {
      console.error('❌ Erreur DB:', error);
      throw error;
    }

    console.log(`✅ ${vendors?.length || 0} prestataires trouvés`);

    // Calculer un score de match intelligent pour chaque prestataire
    const vendorsWithScore = (vendors || []).map(vendor => {
      let matchScore = 70; // Score de base

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

      // Extraire la photo principale
      const principalePhoto = photos.find((p: any) => p.principale);
      const photoUrl = principalePhoto?.url || photos[0]?.url || null;

      return {
        ...vendor,
        matchScore: Math.min(matchScore, 100),
        photo_url: photoUrl,
        all_photos: photos
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    const topVendors = vendorsWithScore.slice(0, 8);

    const response = {
      conversationalResponse: extractedData.conversationalResponse || 
        `J'ai trouvé ${topVendors.length} ${extractedData.categorie.toLowerCase()} en ${extractedData.region} qui correspondent à vos critères ! 🎉`,
      vendors: topVendors,
      category: extractedData.categorie,
      region: extractedData.region,
      needsRegion: false
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
