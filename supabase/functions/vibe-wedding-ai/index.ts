import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to detect vendor categories from message (ENRICHED)
const detectVendorCategory = (message: string): string | null => {
  const messageLower = message.toLowerCase();
  
  const categoryKeywords: { [key: string]: string[] } = {
    'Lieu de réception': ['lieu', 'salle', 'château', 'domaine', 'réception', 'propriété', 'venue', 'reception'],
    'Traiteur': ['traiteur', 'repas', 'buffet', 'menu', 'catering', 'nourriture', 'cuisine', 'restauration'],
    'Photographe': ['photographe', 'photo', 'photos', 'photographie', 'shooting'],
    'Vidéaste': ['vidéaste', 'vidéo', 'film', 'cinéma', 'vidéographie', 'videaste', 'filmeur'],
    'Fleuriste': ['fleuriste', 'fleur', 'fleurs', 'bouquet', 'composition florale', 'floral'],
    'DJ & Animation': ['dj', 'musique', 'musicien', 'orchestre', 'animation musicale', 'sono', 'sound', 'animation', 'animateur'],
    'Wedding Planner': ['wedding planner', 'organisateur', 'coordination', 'planificateur', 'organisatrice'],
    'Coiffure & Maquillage': ['coiffeur', 'coiffure', 'cheveux', 'coiffage', 'maquilleur', 'maquillage', 'beauté', 'make-up'],
    'Décoration': ['décorateur', 'décoration', 'déco', 'scénographie', 'decoration'],
    'Voiture de mariage': ['voiture', 'transport', 'limousine', 'véhicule', 'auto', 'automobile']
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (messageLower.includes(keyword)) {
        return category;
      }
    }
  }
  
  return null;
};

// Helper function to extract location from message and return EXACT ENUM value
function extractLocationFromMessage(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  // Map des régions avec leurs variations → VALEURS EXACTES DE L'ENUM
  const regionMap: { [key: string]: { variations: string[], exactValue: string } } = {
    'ile-de-france': {
      variations: ['île-de-france', 'ile-de-france', 'ile de france', 'idf', 'paris'],
      exactValue: 'Île-de-France'
    },
    'provence': {
      variations: ['provence-alpes-côte d\'azur', 'provence', 'paca', 'côte d\'azur', 'cote d\'azur', 'cote d azur', 'nice', 'marseille', 'aix'],
      exactValue: 'Provence-Alpes-Côte d\'Azur'
    },
    'auvergne': {
      variations: ['auvergne-rhône-alpes', 'auvergne rhône alpes', 'auvergne', 'rhône-alpes', 'rhone alpes', 'lyon', 'grenoble', 'annecy'],
      exactValue: 'Auvergne-Rhône-Alpes'
    },
    'nouvelle-aquitaine': {
      variations: ['nouvelle-aquitaine', 'nouvelle aquitaine', 'aquitaine', 'bordeaux', 'biarritz'],
      exactValue: 'Nouvelle-Aquitaine'
    },
    'occitanie': {
      variations: ['occitanie', 'midi-pyrénées', 'midi pyrenees', 'languedoc', 'toulouse', 'montpellier'],
      exactValue: 'Occitanie'
    },
    'hauts-de-france': {
      variations: ['hauts-de-france', 'hauts de france', 'nord', 'lille', 'amiens'],
      exactValue: 'Hauts-de-France'
    },
    'normandie': {
      variations: ['normandie', 'normandy', 'rouen', 'caen'],
      exactValue: 'Normandie'
    },
    'grand-est': {
      variations: ['grand est', 'alsace', 'lorraine', 'champagne', 'strasbourg', 'reims', 'metz', 'nancy'],
      exactValue: 'Grand Est'
    },
    'bretagne': {
      variations: ['bretagne', 'brittany', 'rennes', 'brest'],
      exactValue: 'Bretagne'
    },
    'pays-de-la-loire': {
      variations: ['pays de la loire', 'pays-de-la-loire', 'angers', 'le mans'],
      exactValue: 'Pays de la Loire'
    },
    'centre-val-de-loire': {
      variations: ['centre-val de loire', 'centre val de loire', 'centre', 'tours', 'orléans', 'orleans'],
      exactValue: 'Centre-Val de Loire'
    },
    'bourgogne': {
      variations: ['bourgogne-franche-comté', 'bourgogne franche comté', 'bourgogne', 'franche-comté', 'franche comté', 'dijon', 'besançon'],
      exactValue: 'Bourgogne-Franche-Comté'
    },
    'corse': {
      variations: ['corse', 'corsica', 'ajaccio', 'bastia'],
      exactValue: 'Corse'
    }
  };
  
  // Chercher la région correspondante et retourner la valeur EXACTE de l'ENUM
  for (const [key, { variations, exactValue }] of Object.entries(regionMap)) {
    for (const variation of variations) {
      if (lowerMessage.includes(variation)) {
        console.log(`✅ Location detected: ${variation} → ${exactValue} (ENUM value)`);
        return exactValue;
      }
    }
  }
  
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, sessionId, userId, currentProject } = await req.json();
    console.log('📨 Received request:', { conversationId, sessionId, userId, messageLength: message?.length, hasCurrentProject: !!currentProject });
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);
    
    // Détecter si l'utilisateur demande des prestataires
    const detectedCategory = detectVendorCategory(message);
    const locationFromMessage = extractLocationFromMessage(message);
    console.log('🔍 Detection:', { detectedCategory, locationFromMessage });

    // Récupérer l'historique de conversation
    let conversationHistory = [];
    if (conversationId) {
      const { data: conversation } = await supabase
        .from('ai_wedding_conversations')
        .select('messages')
        .eq('id', conversationId)
        .single();
      
      if (conversation) {
        conversationHistory = conversation.messages || [];
      }
    }

    // Construire les messages pour l'IA
    const systemPrompt = `Tu es un wedding planner professionnel expert basé en France. Tu maîtrises parfaitement les 10 étapes clés de l'organisation d'un mariage.

Tu as CINQ modes de réponse :

1. MODE INITIAL - Quand l'utilisateur décrit son projet complet pour la première fois :
{
  "conversational": false,
  "mode": "initial",
  "summary": "Message chaleureux personnalisé résumant le projet",
  "weddingData": {
    "guests": nombre_invités,
    "budget": budget_euros,
    "location": "ville, région",
    "date": "YYYY-MM-DD" ou null si non précisée,
    "style": "style du mariage"
  },
  "budgetBreakdown": [
    { "category": "Réception", "percentage": 40, "amount": montant, "description": "Détails" }
  ],
  "timeline": [
    { "task": "Tâche", "timeframe": "J-12 à J-10 mois", "priority": "high", "category": "FONDATIONS ET VISION", "description": "Détails" }
  ]
}

2. MODE UPDATE - Quand l'utilisateur demande un ajustement :
{
  "conversational": false,
  "mode": "update",
  "message": "Confirmation chaleureuse du changement",
  "updatedFields": {
    "weddingData": { "date": "2025-06-15" },
    "timeline": [ /* SEULEMENT si date change */ ]
  }
}

3. MODE CONVERSATIONNEL - Questions sans impact sur le projet :
{
  "conversational": true,
  "message": "Ta réponse conversationnelle"
}

4. MODE PROJET PRESTATAIRE - Quand l'utilisateur demande UNIQUEMENT des prestataires (sans projet complet) :
{
  "conversational": false,
  "mode": "vendor_project",
  "summary": "Recherche de [catégorie]",
  "category": "Catégorie détectée",
  "ask_location": true,
  "message": "Parfait ! Dans quelle région se déroulera votre mariage ?",
  "weddingData": {
    "guests": null,
    "budget": null,
    "location": null,
    "date": null,
    "style": null
  },
  "budgetBreakdown": [],
  "timeline": [],
  "vendors": []
}

5. MODE RECHERCHE PRESTATAIRES - Après sélection de région OU si localisation déjà connue :
{
  "conversational": true,
  "mode": "vendor_search",
  "category": "Catégorie détectée",
  "location": "Localisation",
  "message": "Voici 3 [catégorie] recommandés en [région] :",
  "ask_location": false,
  "cta_selection": true
}

RÈGLES STRICTES POUR RECHERCHE PRESTATAIRES :
- Si l'utilisateur demande UNIQUEMENT un prestataire (sans mentionner budget/invités/date complet) → MODE PROJET PRESTATAIRE avec ask_location = true
- Si projet existe déjà ET location connue → MODE RECHERCHE PRESTATAIRES direct
- Si l'utilisateur sélectionne une région après avoir demandé un prestataire → MODE RECHERCHE PRESTATAIRES
- Message court et accueillant (1-2 phrases max)
- TOUJOURS limiter à 3 prestataires maximum dans la réponse
- TOUJOURS inclure cta_selection: true pour afficher le bouton "Voir la sélection entière"

RÈGLES STRICTES POUR LE RÉTROPLANNING (OBLIGATOIRE) :

1. **Durée maximale** : UN MARIAGE S'ORGANISE MAXIMUM 12 MOIS EN AVANCE
2. **Si date non fournie** → DEMANDER EXPLICITEMENT : "Quelle est la date prévue de votre mariage ?"
3. **Structure OBLIGATOIRE** : Tu DOIS TOUJOURS générer un rétroplanning avec 5 à 10 catégories d'étapes principales basées sur les 10 étapes clés de l'organisation d'un mariage professionnel :

**CATÉGORIE 1 - FONDATIONS ET VISION (J-12 à J-10 mois):**
- Définir le budget global et les priorités de dépenses
- Établir la liste des invités préliminaire
- Choisir la date et la saison du mariage
- Définir le style, l'ambiance et le thème du mariage
- Créer un mood board et une planche d'inspiration
- Ouvrir un compte sur Mariable.fr pour centraliser l'organisation

**CATÉGORIE 2 - SÉCURISATION DES PRESTATAIRES CLÉS (J-10 à J-8 mois):**
- Réserver le lieu de réception (PRIORITÉ #1)
- Réserver le traiteur ou prestataire restauration
- Réserver le photographe et/ou vidéaste
- Réserver l'officiant (mairie, église, cérémonie laïque)
- Signer tous les contrats et verser les arrhes
- Commencer la recherche de DJ/musiciens

**CATÉGORIE 3 - TENUES ET ESTHÉTIQUE (J-8 à J-6 mois):**
- Choisir et commander la robe de mariée (prévoir plusieurs essayages)
- Choisir et commander le costume du marié
- Réserver les prestataires coiffure et maquillage
- Prévoir les tenues des témoins et du cortège
- Commander les alliances
- Prévoir les accessoires (voile, bijoux, chaussures)

**CATÉGORIE 4 - PRESTATAIRES COMPLÉMENTAIRES (J-6 à J-5 mois):**
- Réserver le fleuriste et valider les compositions
- Réserver DJ, musiciens ou orchestre
- Organiser la location de matériel (décoration, vaisselle, mobilier)
- Organiser les transports (voiture mariés, navettes invités)
- Prévoir et réserver l'hébergement pour les invités de loin

**CATÉGORIE 5 - COMMUNICATION ET PAPETERIE (J-5 à J-4 mois):**
- Créer et commander les faire-part
- Envoyer les save-the-date si nécessaire
- Créer le site web du mariage avec Mariable
- Organiser la liste de mariage
- Préparer les cartons d'invitation et menus
- Commander le wedding cake

**CATÉGORIE 6 - FINALISATION DES DÉTAILS (J-4 à J-3 mois):**
- Envoyer les faire-part aux invités
- Finaliser le menu définitif avec le traiteur
- Organiser les essayages finaux des tenues
- Valider le plan de table préliminaire
- Reconfirmer tous les prestataires par écrit

**CATÉGORIE 7 - COORDINATION ET LOGISTIQUE (J-3 à J-2 mois):**
- Créer le rétroplanning détaillé et minuté du Jour J
- Organiser une répétition de la cérémonie
- Briefer les témoins, parents et cortège sur leurs rôles
- Préparer les kits d'urgence du jour J
- Finaliser le plan de table définitif avec noms et places

**CATÉGORIE 8 - DERNIERS PRÉPARATIFS (J-2 mois à J-2 semaines):**
- Confirmer le nombre d'invités final auprès de tous les prestataires
- Préparer les cadeaux invités et remerciements
- Organiser et fabriquer la décoration DIY si besoin
- Régler les soldes et derniers paiements aux prestataires
- Préparer les discours et animations

**CATÉGORIE 9 - DERNIÈRE LIGNE DROITE (J-2 semaines à J-3 jours):**
- Briefing final détaillé avec TOUS les prestataires
- Installation progressive de la décoration sur le lieu
- Derniers essayages et retouches des tenues
- Préparer toutes les affaires et accessoires du jour J
- Moments de repos et bien-être (massages, soins)

**CATÉGORIE 10 - JOUR J ET APRÈS (J-3 jours à J+1 mois):**
- Checklist du matin : coiffure, maquillage, habillage
- Coordination et gestion du timing le jour J
- PROFITER pleinement de votre mariage ! 🥂
- Récupération du matériel loué J+1
- Envoi des remerciements aux invités
- Récupération et tri des photos/vidéos

RÈGLES D'ADAPTATION :
- Si mariage > 12 mois → timeline commence 12 mois avant
- Si mariage < 12 mois → adapter et prioriser les tâches urgentes (prestataires clés en premier)
- TOUJOURS inclure 5 à 10 catégories minimum dans le timeline
- Pour chaque catégorie, donner 3 à 8 sous-actions concrètes
- Utiliser les périodes "J-X mois" pour clarifier le timing
- Être chaleureux, encourageant et professionnel

Tu dois TOUJOURS répondre en JSON :`;

    // Add current project context to system prompt if exists
    let enhancedSystemPrompt = systemPrompt;
    if (currentProject) {
      enhancedSystemPrompt += `\n\nPROJET ACTUEL DE L'UTILISATEUR :\n${JSON.stringify(currentProject, null, 2)}\n\nSi l'utilisateur demande une modification de ce projet, utilise le MODE UPDATE.`;
    }

    const messages = [
      { role: 'system', content: enhancedSystemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log('🚀 Calling Lovable AI Gateway...');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('❌ AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Crédit insuffisant. Veuillez contacter le support.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;
    
    console.log('✅ AI Response received');

    // Parser la réponse JSON
    let parsedResponse;
    try {
      // Nettoyer la réponse avant parsing (retirer les backticks markdown)
      let cleanedResponse = assistantMessage.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\n?/, '')
          .replace(/\n?```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse
          .replace(/^```\n?/, '')
          .replace(/\n?```$/, '');
      }
      
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (e) {
      console.error('❌ Failed to parse AI response as JSON:', assistantMessage);
      parsedResponse = {
        conversational: true,
        message: assistantMessage
      };
    }

    // Mettre à jour ou créer la conversation
    const newMessages = [
      ...conversationHistory,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: assistantMessage, timestamp: new Date().toISOString() }
    ];

    let finalConversationId = conversationId;

    if (conversationId) {
      await supabase
        .from('ai_wedding_conversations')
        .update({ 
          messages: newMessages,
          wedding_context: !parsedResponse.conversational ? {
            summary: parsedResponse.summary,
            weddingData: parsedResponse.weddingData,
            budgetBreakdown: parsedResponse.budgetBreakdown,
            timeline: parsedResponse.timeline
          } : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
    } else {
      const { data: newConv, error: convError } = await supabase
        .from('ai_wedding_conversations')
        .insert({
          user_id: userId || null,
          session_id: sessionId,
          messages: newMessages,
          wedding_context: !parsedResponse.conversational ? {
            summary: parsedResponse.summary,
            weddingData: parsedResponse.weddingData,
            budgetBreakdown: parsedResponse.budgetBreakdown,
            timeline: parsedResponse.timeline
          } : null
        })
        .select()
        .single();

      if (convError) {
        console.error('❌ Error creating conversation:', convError);
      } else {
        finalConversationId = newConv.id;
      }
    }

    // Recherche intelligente de prestataires (IMPROVED VERSION)
    let vendors = [];
    const shouldSearchVendors = detectedCategory || parsedResponse.mode === 'vendor_search';
    
    if (shouldSearchVendors) {
      const finalCategory = detectedCategory || parsedResponse.category;
      const searchLocation = locationFromMessage || 
                            parsedResponse.location || 
                            currentProject?.weddingData?.location;
      
      console.log('🎯 Performing vendor search:', { 
        category: finalCategory, 
        location: searchLocation,
        mode: parsedResponse.mode,
        askLocation: parsedResponse.ask_location
      });

      // Only search if we have a location AND not asking for location
      if (searchLocation && finalCategory && parsedResponse.ask_location !== true) {
        console.log(`🔍 Searching: ${finalCategory} in region "${searchLocation}"`);
        
        // Search by region first (most accurate) - Using EXACT ENUM value with .eq()
        const { data: regionVendors, error: vendorError } = await supabase
          .from('prestataires_rows')
          .select('id, nom, categorie, ville, region, prix_a_partir_de, prix_par_personne, description, email, telephone, slug')
          .eq('categorie', finalCategory)
          .eq('visible', true)
          .eq('region', searchLocation)
          .order('created_at', { ascending: false })
          .limit(3);

        if (vendorError) {
          console.error('❌ Error fetching vendors by region:', vendorError);
        } else if (regionVendors && regionVendors.length > 0) {
          vendors = regionVendors;
          console.log(`✅ Found ${vendors.length} vendors in region "${searchLocation}"`);
        } else {
          // Fallback: try by ville if region returns nothing
          console.log(`⚠️ No vendors in region, trying by ville...`);
          const { data: cityVendors } = await supabase
            .from('prestataires_rows')
            .select('id, nom, categorie, ville, region, prix_a_partir_de, prix_par_personne, description, email, telephone, slug')
            .eq('categorie', finalCategory)
            .eq('visible', true)
            .ilike('ville', `%${searchLocation}%`)
            .order('created_at', { ascending: false })
            .limit(3);
            
          if (cityVendors && cityVendors.length > 0) {
            vendors = cityVendors;
            console.log(`✅ Found ${vendors.length} vendors by ville`);
          } else {
            // Last resort: any vendor in this category (limited to 3)
            console.log(`⚠️ No vendors found, showing any from category (max 3)`);
            const { data: anyVendors } = await supabase
              .from('prestataires_rows')
              .select('id, nom, categorie, ville, region, prix_a_partir_de, prix_par_personne, description, email, telephone, slug')
              .eq('categorie', finalCategory)
              .eq('visible', true)
              .order('created_at', { ascending: false })
              .limit(3);
              
            vendors = anyVendors || [];
            console.log(`✅ Found ${vendors.length} vendors (any location)`);
          }
        }
      }
    }
    
    // Legacy: general vendor search if we have a new project with location (MAX 3)
    if (vendors.length === 0 && parsedResponse.weddingData?.location && !parsedResponse.conversational) {
      console.log('🔄 Performing general vendor search for new project');
      
      // Extract exact ENUM value from location
      const exactLocation = extractLocationFromMessage(parsedResponse.weddingData.location);
      
      if (exactLocation) {
        const { data: generalVendors, error: vendorError } = await supabase
          .from('prestataires_rows')
          .select('id, nom, categorie, ville, region, prix_a_partir_de, prix_par_personne, description, email, telephone, slug')
          .eq('region', exactLocation)
          .eq('visible', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (vendorError) {
          console.error('❌ Error fetching general vendors:', vendorError);
        } else {
          vendors = generalVendors || [];
          console.log(`✅ Found ${vendors.length} general vendors`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        response: parsedResponse,
        conversationId: finalConversationId,
        vendors,
        askLocation: parsedResponse.ask_location || false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error in vibe-wedding-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
