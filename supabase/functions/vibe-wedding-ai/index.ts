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

⚠️ FORMAT STRUCTURÉ OBLIGATOIRE :
Tu utilises TOUJOURS la fonction "wedding_response" pour structurer ta réponse. Cette fonction garantit que tes données sont toujours exploitables.

Tu as CINQ modes de réponse (champ "mode" obligatoire) :

1. MODE "initial" - Première description complète du projet :
- Remplis TOUS les champs : weddingData, summary, budgetBreakdown, timeline
- Génère un rétroplanning complet basé sur les 10 étapes professionnelles
- Message chaleureux et personnalisé

2. MODE "update" - Modification d'un projet existant :
- CRITIQUE : Utilise UNIQUEMENT le champ "updatedFields" 
- Dans updatedFields.weddingData, mets UNIQUEMENT les champs modifiés par l'utilisateur
- Exemples :
  * "Change le lieu en Lyon" → updatedFields: { weddingData: { location: "Lyon" } }
  * "Budget de 10000€" → updatedFields: { weddingData: { budget: 10000 } }
  * "Budget 10000€ et date décembre 2025" → updatedFields: { weddingData: { budget: 10000, date: "2025-12-15" } }
- NE mets PAS les champs non modifiés dans updatedFields
- Message confirmant le changement

3. MODE "conversational" - Question simple sans impact :
- conversational: true
- Juste un message chaleureux
- Pas de données structurées

4. MODE "vendor_project" - Demande de prestataire SANS projet complet :
- Si l'utilisateur demande UNIQUEMENT un prestataire (sans budget/invités/date)
- Crée un projet minimal avec weddingData à null
- ask_location: true pour demander la région
- Message : "Dans quelle région se déroulera votre mariage ?"

5. MODE "vendor_search" - Recherche de prestataires :
- Quand la région est connue (projet existant OU après sélection région)
- Remplis category et location
- ask_location: false
- cta_selection: true
- Message court présentant les prestataires

RÈGLES STRICTES :
- TOUJOURS inclure "mode" dans ta réponse
- En MODE UPDATE : utiliser updatedFields avec UNIQUEMENT les champs modifiés
- Message chaleureux et professionnel dans TOUS les modes
- Maximum 3 prestataires dans les messages
- Rétroplanning basé sur 10 catégories professionnelles (J-12 à J+1 mois)
- Si date manquante, la demander explicitement

CATÉGORIES DU RÉTROPLANNING (si génération nécessaire) :
1. FONDATIONS ET VISION (J-12 à J-10 mois)
2. SÉCURISATION PRESTATAIRES CLÉS (J-10 à J-8 mois)
3. TENUES ET ESTHÉTIQUE (J-8 à J-6 mois)
4. PRESTATAIRES COMPLÉMENTAIRES (J-6 à J-5 mois)
5. COMMUNICATION ET PAPETERIE (J-5 à J-4 mois)
6. FINALISATION DES DÉTAILS (J-4 à J-3 mois)
7. COORDINATION ET LOGISTIQUE (J-3 à J-2 mois)
8. DERNIERS PRÉPARATIFS (J-2 mois à J-2 semaines)
9. DERNIÈRE LIGNE DROITE (J-2 semaines à J-3 jours)
10. JOUR J ET APRÈS (J-3 jours à J+1 mois)`;

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

    console.log('🚀 Calling Lovable AI Gateway with Tool Calling...');
    
    // Définir le tool pour forcer la structure JSON
    const tools = [
      {
        type: "function",
        function: {
          name: "wedding_response",
          description: "Répondre à l'utilisateur avec les informations structurées du mariage",
          parameters: {
            type: "object",
            properties: {
              conversational: { 
                type: "boolean",
                description: "true si réponse conversationnelle simple, false si données structurées de projet"
              },
              mode: { 
                type: "string", 
                enum: ["initial", "update", "vendor_project", "vendor_search", "conversational"],
                description: "Mode de réponse selon le contexte"
              },
              message: { 
                type: "string",
                description: "Message chaleureux et personnalisé pour l'utilisateur"
              },
              summary: { 
                type: "string",
                description: "Résumé du projet de mariage (modes initial et vendor_project)"
              },
              weddingData: {
                type: "object",
                properties: {
                  location: { type: "string" },
                  date: { type: "string" },
                  guests: { type: "number" },
                  budget: { type: "number" },
                  style: { type: "string" }
                },
                description: "Données principales du mariage"
              },
              updatedFields: {
                type: "object",
                properties: {
                  weddingData: { 
                    type: "object",
                    description: "UNIQUEMENT les champs de weddingData à mettre à jour"
                  },
                  budgetBreakdown: { 
                    type: "array",
                    description: "Nouvelle répartition du budget si modifié"
                  },
                  timeline: { 
                    type: "array",
                    description: "Nouveau rétroplanning si date modifiée"
                  }
                },
                description: "Champs à mettre à jour (MODE UPDATE uniquement)"
              },
              budgetBreakdown: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category: { type: "string" },
                    percentage: { type: "number" },
                    amount: { type: "number" },
                    description: { type: "string" }
                  }
                },
                description: "Répartition détaillée du budget"
              },
              timeline: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    task: { type: "string" },
                    timeframe: { type: "string" },
                    priority: { type: "string", enum: ["high", "medium", "low"] },
                    category: { type: "string" },
                    description: { type: "string" }
                  }
                },
                description: "Rétroplanning détaillé des étapes"
              },
              category: { 
                type: "string",
                description: "Catégorie de prestataire recherchée (modes vendor)"
              },
              location: { 
                type: "string",
                description: "Région pour la recherche de prestataires"
              },
              ask_location: { 
                type: "boolean",
                description: "true si on doit demander la région à l'utilisateur"
              },
              cta_selection: {
                type: "boolean",
                description: "true pour afficher le bouton 'Voir la sélection entière'"
              }
            },
            required: ["conversational", "message"]
          }
        }
      }
    ];
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        tools,
        tool_choice: { type: "function", function: { name: "wedding_response" } }
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
    
    console.log('✅ AI Response received');

    // Extraire la réponse du tool call
    let parsedResponse;
    try {
      const toolCall = aiData.choices[0].message.tool_calls?.[0];
      
      if (toolCall && toolCall.function) {
        // Tool calling utilisé - structure garantie
        console.log('✅ Tool calling response detected');
        parsedResponse = JSON.parse(toolCall.function.arguments);
      } else {
        // Fallback sur message.content si pas de tool call (ne devrait pas arriver)
        console.log('⚠️ Fallback to content parsing');
        const assistantMessage = aiData.choices[0].message.content;
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
      }
    } catch (e) {
      console.error('❌ Failed to parse fallback response:', e);
      parsedResponse = {
        conversational: true,
        message: aiData.choices[0].message.content || "Je n'ai pas pu traiter votre demande correctement."
      };
    }

    // Mettre à jour ou créer la conversation
    // Extraire le message lisible au lieu du JSON brut
    const readableMessage = parsedResponse.conversational 
      ? parsedResponse.message 
      : parsedResponse.message || parsedResponse.summary || assistantMessage;
    
    const newMessages = [
      ...conversationHistory,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: readableMessage, timestamp: new Date().toISOString() }
    ];

    let finalConversationId = conversationId;
    let vendors = []; // Initialiser vendors au début pour éviter les erreurs de référence

    if (conversationId) {
      // Calculer le wedding_context mis à jour selon le mode
      let updatedWeddingContext = null;
      
      if (parsedResponse.mode === "update" && currentProject) {
        // MODE UPDATE : Merger uniquement les champs mentionnés dans updatedFields
        console.log('🔄 MODE UPDATE detected, merging updatedFields:', parsedResponse.updatedFields);
        
        updatedWeddingContext = {
          summary: currentProject.summary,
          weddingData: { 
            ...currentProject.weddingData, 
            ...(parsedResponse.updatedFields?.weddingData || {})
          },
          budgetBreakdown: parsedResponse.updatedFields?.budgetBreakdown || currentProject.budgetBreakdown,
          timeline: parsedResponse.updatedFields?.timeline || currentProject.timeline,
          vendors: vendors.length > 0 ? vendors : currentProject.vendors || []
        };
      } else if (parsedResponse.mode === "initial" || parsedResponse.mode === "vendor_project") {
        // MODE CREATION : Créer un nouveau contexte complet
        console.log('✨ MODE CREATION detected, creating new context');
        
        updatedWeddingContext = {
          summary: parsedResponse.summary,
          weddingData: parsedResponse.weddingData,
          budgetBreakdown: parsedResponse.budgetBreakdown || [],
          timeline: parsedResponse.timeline || [],
          vendors: vendors.length > 0 ? vendors : []
        };
      } else if (currentProject && !parsedResponse.conversational) {
        // Autres modes non-conversationnels : Merger avec le projet existant
        console.log('🔀 Merging with existing project');
        
        updatedWeddingContext = {
          summary: parsedResponse.summary || currentProject.summary,
          weddingData: parsedResponse.weddingData || currentProject.weddingData,
          budgetBreakdown: parsedResponse.budgetBreakdown || currentProject.budgetBreakdown,
          timeline: parsedResponse.timeline || currentProject.timeline,
          vendors: vendors.length > 0 ? vendors : currentProject.vendors || []
        };
      } else if (currentProject) {
        // Mode conversationnel : Préserver le projet existant
        console.log('💬 Conversational mode, preserving existing project');
        updatedWeddingContext = currentProject;
      }
      
      console.log('📦 Final wedding_context:', updatedWeddingContext ? 'Updated' : 'Null');
      
      await supabase
        .from('ai_wedding_conversations')
        .update({ 
          messages: newMessages,
          wedding_context: updatedWeddingContext,
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
    // vendors déjà initialisé plus haut pour éviter les erreurs de référence
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
