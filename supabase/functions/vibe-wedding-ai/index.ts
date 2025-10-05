import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to detect vendor categories from message (ENRICHED)
const detectVendorCategory = (message: string): string | null => {
  const messageLower = message.toLowerCase();
  
  // IMPORTANT: Ces valeurs doivent EXACTEMENT matcher l'enum de la DB
  const categoryKeywords: { [key: string]: string[] } = {
    'Lieu de réception': ['lieu', 'salle', 'château', 'domaine', 'réception', 'propriété', 'venue', 'reception'],
    'Traiteur': ['traiteur', 'repas', 'buffet', 'menu', 'catering', 'nourriture', 'cuisine', 'restauration'],
    'Photographe': ['photographe', 'photo', 'photos', 'photographie', 'shooting', 'photographer'],
    'Vidéaste': ['vidéaste', 'vidéo', 'film', 'cinéma', 'vidéographie', 'videaste', 'filmeur', 'videographer'],
    'Fleuriste': ['fleuriste', 'fleur', 'fleurs', 'bouquet', 'composition florale', 'floral', 'florist'],
    'DJ/Musiciens': ['dj', 'musique', 'musicien', 'orchestre', 'animation musicale', 'sono', 'sound', 'animation', 'animateur'],
    'Wedding Planner': ['wedding planner', 'organisateur', 'coordination', 'planificateur', 'organisatrice', 'wedding coordinator'],
    'Coiffeur/Maquilleur': ['coiffeur', 'coiffure', 'cheveux', 'coiffage', 'maquilleur', 'maquillage', 'beauté', 'make-up', 'makeup']
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
    const { message, conversationId, sessionId, userId, currentProject, organizationMode = true } = await req.json();
    console.log('📨 Received request:', { 
      conversationId, 
      sessionId, 
      userId, 
      messageLength: message?.length, 
      hasCurrentProject: !!currentProject,
      organizationMode
    });
    
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

⚠️ MODE UTILISATEUR : ${organizationMode ? '📝 ORGANISATION' : '💬 CONVERSATION'}

${organizationMode ? `
🔴 MODE ORGANISATION ACTIVÉ :
- L'utilisateur VEUT QUE TU MODIFIES SON PROJET avec ses nouvelles informations
- Si projet existant : utilise mode "update" avec updatedFields contenant UNIQUEMENT les champs modifiés
- Si nouveau projet : utilise mode "initial" avec weddingData complet
- Si recherche prestataire : utilise mode "vendor_search"
- TOUJOURS mettre à jour les champs mentionnés par l'utilisateur
- Confirme chaque modification dans ton message
` : `
🟢 MODE CONVERSATION ACTIVÉ :
- L'utilisateur NE VEUT PAS modifier son projet
- Utilise UNIQUEMENT mode "conversational": true
- Tu peux chercher des prestataires (mode "vendor_search") MAIS sans créer/modifier le projet
- Réponds aux questions, donne des conseils, mais N'ALTÈRE PAS les données du projet
- Sois chaleureux mais ne modifie JAMAIS le weddingData/budget/timeline
`}

⚠️ FORMAT STRUCTURÉ OBLIGATOIRE :
Tu utilises TOUJOURS la fonction "wedding_response" pour structurer ta réponse. Cette fonction garantit que tes données sont toujours exploitables.

Tu as CINQ modes de réponse (champ "mode" obligatoire) :

1. MODE "initial" - Première description complète du projet (SEULEMENT si organizationMode = true) :
- Remplis TOUS les champs : weddingData, summary, budgetBreakdown, timeline
- Génère un rétroplanning complet basé sur les 10 étapes professionnelles
- Message chaleureux et personnalisé

2. MODE "update" - Modification d'un projet existant (SEULEMENT si organizationMode = true) :

⚠️ RÈGLE ABSOLUE : Dans updatedFields.weddingData, tu DOIS TOUJOURS inclure les champs ET leurs valeurs

⚠️ OBLIGATION : updatedFields.weddingData NE DOIT JAMAIS ÊTRE VIDE ({})

EXEMPLES OBLIGATOIRES à suivre EXACTEMENT :

🔴 CAS 1 - Budget modifié :
Utilisateur : "je veux un budget de 30000 euros"
→ updatedFields: { weddingData: { budget: 30000 } }
→ Message: "Super ! J'ai mis à jour le budget de votre mariage à 30 000€."

🔴 CAS 2 - Date modifiée :
Utilisateur : "la date sera le 15 décembre 2026"  
→ updatedFields: { weddingData: { date: "2026-12-15" } }
→ Message: "Parfait ! J'ai enregistré la date du 15 décembre 2026 pour votre mariage."

🔴 CAS 3 - Lieu modifié :
Utilisateur : "changeons le lieu pour Lyon"
→ updatedFields: { weddingData: { location: "Lyon" } }
→ Message: "Excellent choix ! J'ai changé le lieu pour Lyon."

🔴 CAS 4 - Invités modifiés :
Utilisateur : "100 invités"
→ updatedFields: { weddingData: { guests: 100 } }
→ Message: "Noté ! Votre mariage accueillera 100 invités."

🔴 CAS 5 - Photographe demandé (avec projet existant) :
Utilisateur : "Je cherche un photographe"
→ mode: "vendor_search" (PAS update)
→ category: "Photographe"
→ location: (extraire du projet existant)
→ Message: "Je recherche les meilleurs photographes dans votre région..."

⚠️ RÈGLES CRITIQUES :
- updatedFields.weddingData ne doit JAMAIS être vide
- Chaque tâche du timeline DOIT avoir une category non vide
- TOUJOURS extraire et mettre les valeurs dans updatedFields.weddingData

❌ JAMAIS : updatedFields: { weddingData: {} }
✅ TOUJOURS : updatedFields: { weddingData: { budget: 30000 } }

- Message confirmant chaque changement avec enthousiasme

3. MODE "conversational" - Question simple sans impact :
- conversational: true
- Juste un message chaleureux
- Pas de données structurées
- Utilise CE MODE si organizationMode = false (mode conversation)

4. MODE "vendor_project" - Demande de prestataire SANS projet complet (SEULEMENT si organizationMode = true) :
- Si l'utilisateur demande UNIQUEMENT un prestataire (sans budget/invités/date)
- Crée un projet minimal avec weddingData à null
- ask_location: true pour demander la région
- Message : "Dans quelle région se déroulera votre mariage ?"

5. MODE "vendor_search" - Recherche de prestataires :
- Quand la région est connue (projet existant OU après sélection région)
- CRITIQUE : Utilise UNIQUEMENT ces catégories EXACTES en français : "Photographe", "Vidéaste", "Traiteur", "Lieu de réception", "Wedding Planner", "DJ/Musiciens", "Fleuriste", "Coiffeur/Maquilleur"
- category doit être EXACTEMENT l'une de ces valeurs (respect de la casse et accents)
- location doit être l'ENUM exact de la région française
- ask_location: false
- cta_selection: true
- IMPORTANT : NE PAS modifier le projet si organizationMode = false
- Message court présentant les prestataires

⚠️ DISTINCTION VENDOR_SEARCH vs UPDATE :
- Si l'utilisateur demande JUSTE un prestataire (sans modifier budget/date/lieu) → mode "vendor_search"
- Si l'utilisateur modifie le projet (budget, date, lieu, invités) → mode "update"
- NE PAS mélanger les deux modes

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
                    properties: {
                      location: { type: "string", description: "Lieu du mariage" },
                      date: { type: "string", description: "Date au format YYYY-MM-DD" },
                      guests: { type: "number", description: "Nombre d'invités" },
                      budget: { type: "number", description: "Budget en euros" },
                      style: { type: "string", description: "Style du mariage" }
                    },
                    description: "Champs de weddingData à mettre à jour - INCLURE UNIQUEMENT les champs modifiés avec leurs VALEURS"
                  },
                  budgetBreakdown: { 
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        category: { type: "string" },
                        percentage: { type: "number" },
                        amount: { type: "number" }
                      }
                    },
                    description: "Nouvelle répartition du budget si modifié"
                  },
                  timeline: { 
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        task: { type: "string" },
                        timeframe: { type: "string" },
                        priority: { type: "string" }
                      }
                    },
                    description: "Nouveau rétroplanning si date modifiée"
                  }
                },
                description: "MODE UPDATE UNIQUEMENT : Contient les champs modifiés par l'utilisateur"
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
                enum: ["Photographe", "Vidéaste", "Traiteur", "Lieu de réception", "Wedding Planner", "DJ/Musiciens", "Fleuriste", "Coiffeur/Maquilleur"],
                description: "Catégorie EXACTE du prestataire - TOUJOURS utiliser ces valeurs françaises avec accents et majuscules"
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
    
    // 🔴 CRITIQUE: Parser la réponse de tool calling pour extraire parsedResponse
    const toolCall = aiData.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }
    
    const parsedResponse = JSON.parse(toolCall.function.arguments);
    
    // 🛡️ FALLBACK : Si mode "update" avec updatedFields vide, extraire depuis le message
    if (parsedResponse.mode === "update" && 
        parsedResponse.updatedFields && 
        Object.keys(parsedResponse.updatedFields.weddingData || {}).length === 0) {
      
      console.log('⚠️ Empty updatedFields detected, attempting auto-extraction from message');
      
      if (!parsedResponse.updatedFields.weddingData) {
        parsedResponse.updatedFields.weddingData = {};
      }
      
      // Extraction automatique du budget (gère "30000 euros", "30 000 euros", "30000€")
      const budgetMatches = [
        message.match(/(\d{2,6})\s*000\s*(?:€|euros?)/i), // "30 000 euros"
        message.match(/(\d{4,6})\s*(?:€|euros?)/i), // "30000 euros"
      ];
      
      for (const match of budgetMatches) {
        if (match) {
          let budget = parseInt(match[1].replace(/\s/g, ''));
          // Si format "30" pour "30000", multiplier par 1000
          if (budget < 1000 && message.includes('000')) {
            budget = budget * 1000;
          }
          parsedResponse.updatedFields.weddingData.budget = budget;
          console.log('✅ Auto-extracted budget:', budget);
          break;
        }
      }
      
      // Extraction automatique de la date (formats multiples)
      const monthNames: Record<string, string> = {
        'janvier': '01', 'février': '02', 'fevrier': '02', 'mars': '03', 'avril': '04',
        'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08', 'aout': '08',
        'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12', 'decembre': '12'
      };
      
      const dateMatches = [
        message.match(/(\d{4})-(\d{2})-(\d{2})/), // Format ISO
        message.match(/(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\s+(\d{4})/i) // "décembre 2026"
      ];
      
      if (dateMatches[0]) {
        parsedResponse.updatedFields.weddingData.date = `${dateMatches[0][1]}-${dateMatches[0][2]}-${dateMatches[0][3]}`;
        console.log('✅ Auto-extracted date (ISO):', parsedResponse.updatedFields.weddingData.date);
      } else if (dateMatches[1]) {
        const month = monthNames[dateMatches[1][1].toLowerCase()];
        const year = dateMatches[1][2];
        parsedResponse.updatedFields.weddingData.date = `${year}-${month}-01`;
        console.log('✅ Auto-extracted date (French):', parsedResponse.updatedFields.weddingData.date);
      }
      
      // Extraction automatique du nombre d'invités
      const guestsMatch = message.match(/(\d+)\s*(?:invités?|guests?|personnes?)/i);
      if (guestsMatch) {
        parsedResponse.updatedFields.weddingData.guests = parseInt(guestsMatch[1]);
        console.log('✅ Auto-extracted guests:', parsedResponse.updatedFields.weddingData.guests);
      }
      
      // Extraction automatique du lieu
      const locationPatterns = ['à ', 'en ', 'sur ', 'près de ', 'dans ', 'au '];
      for (const pattern of locationPatterns) {
        const locationMatch = message.match(new RegExp(pattern + '([A-ZÀ-Ü][a-zà-ü]+(?:\\s+[A-ZÀ-Ü][a-zà-ü]+)*)', 'i'));
        if (locationMatch) {
          parsedResponse.updatedFields.weddingData.location = locationMatch[1];
          console.log('✅ Auto-extracted location:', parsedResponse.updatedFields.weddingData.location);
          break;
        }
      }
    }
    
    // 🛡️ VALIDATION : S'assurer que toutes les tâches du timeline ont une catégorie
    const timelineToValidate = parsedResponse.updatedFields?.timeline || parsedResponse.timeline;
    if (timelineToValidate && Array.isArray(timelineToValidate)) {
      timelineToValidate.forEach((task: any, index: number) => {
        if (!task.category || task.category.trim() === '') {
          // Assigner une catégorie par défaut basée sur le contenu
          if (task.task.toLowerCase().includes('budget') || task.task.toLowerCase().includes('coût')) {
            task.category = 'Budget & Finances';
          } else if (task.task.toLowerCase().includes('lieu') || task.task.toLowerCase().includes('réception') || task.task.toLowerCase().includes('salle')) {
            task.category = 'Lieu & Logistique';
          } else if (task.task.toLowerCase().includes('traiteur') || task.task.toLowerCase().includes('fleur') || task.task.toLowerCase().includes('photo') || task.task.toLowerCase().includes('dj')) {
            task.category = 'Prestataires';
          } else if (task.task.toLowerCase().includes('robe') || task.task.toLowerCase().includes('costume') || task.task.toLowerCase().includes('tenue')) {
            task.category = 'Tenues & Style';
          } else if (task.task.toLowerCase().includes('invité') || task.task.toLowerCase().includes('faire-part') || task.task.toLowerCase().includes('guest')) {
            task.category = 'Invités & Communication';
          } else if (task.task.toLowerCase().includes('cérémonie') || task.task.toLowerCase().includes('mairie') || task.task.toLowerCase().includes('église')) {
            task.category = 'Cérémonie';
          } else {
            task.category = 'Organisation générale';
          }
          console.log(`⚠️ Task ${index} missing category, assigned: ${task.category}`);
        }
      });
    }
    
    console.log('✅ AI Response received');
    console.log('🤖 AI Response details:', {
      mode: parsedResponse?.mode,
      conversational: parsedResponse?.conversational,
      category: parsedResponse?.category,
      location: parsedResponse?.location,
      organizationMode,
      updatedFields: parsedResponse?.updatedFields
    });

    // 🔴 CRITIQUE: Rechercher les vendors IMMÉDIATEMENT après avoir reçu la réponse de l'IA
    let vendors: any[] = [];
    const shouldSearchVendors = detectedCategory || parsedResponse.mode === 'vendor_search';
    
    if (shouldSearchVendors) {
      const finalCategory = parsedResponse.category || detectedCategory;
      const searchLocation = locationFromMessage || 
                            parsedResponse.location || 
                            currentProject?.weddingData?.location;
      
      console.log('🎯 Performing vendor search:', { 
        finalCategory, 
        searchLocation,
        detectedCategory,
        parsedCategory: parsedResponse.category,
        mode: parsedResponse.mode,
        askLocation: parsedResponse.ask_location
      });

      // Only search if we have a location AND category AND not asking for location
      if (searchLocation && finalCategory && parsedResponse.ask_location !== true) {
        console.log(`🔍 Searching: ${finalCategory} in region "${searchLocation}"`);
        
        // Search by region first (most accurate)
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
            console.log('❌ No vendors found');
          }
        }
      } else {
        console.log('⚠️ Skipping vendor search:', {
          hasLocation: !!searchLocation,
          hasCategory: !!finalCategory,
          askLocation: parsedResponse.ask_location
        });
      }
    }

    // Mettre à jour ou créer la conversation
    // Extraire le message lisible au lieu du JSON brut
    const readableMessage = parsedResponse.conversational 
      ? parsedResponse.message 
      : parsedResponse.message || parsedResponse.summary || aiData.choices[0].message.content;
    
    const newMessages = [
      ...conversationHistory,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: readableMessage, timestamp: new Date().toISOString() }
    ];

    let finalConversationId = conversationId;

    if (conversationId) {
      // Calculer le wedding_context mis à jour selon le mode ET organizationMode
      let updatedWeddingContext = null;
      
      if (organizationMode && !parsedResponse.conversational) {
        if (parsedResponse.mode === "update" && currentProject) {
          // MODE UPDATE : Merger uniquement les champs mentionnés dans updatedFields
          console.log('🔄 MODE UPDATE detected, merging updatedFields:', parsedResponse.updatedFields);
          
          const existingVendorIds = new Set((currentProject.vendors || []).map((v: any) => v.id));
          const newVendors = vendors.filter(v => !existingVendorIds.has(v.id));
          
          updatedWeddingContext = {
            summary: currentProject.summary,
            weddingData: { 
              ...currentProject.weddingData, 
              ...(parsedResponse.updatedFields?.weddingData || {})
            },
            budgetBreakdown: parsedResponse.updatedFields?.budgetBreakdown || currentProject.budgetBreakdown,
            timeline: parsedResponse.updatedFields?.timeline || currentProject.timeline,
            vendors: [...(currentProject.vendors || []), ...newVendors]
          };
        } else if (parsedResponse.mode === "initial" || parsedResponse.mode === "vendor_project") {
          // MODE CREATION : Créer un nouveau contexte complet
          console.log('✨ MODE CREATION detected, creating new context');
          
          updatedWeddingContext = {
            summary: parsedResponse.summary,
            weddingData: parsedResponse.weddingData,
            budgetBreakdown: parsedResponse.budgetBreakdown || [],
            timeline: parsedResponse.timeline || [],
            vendors: vendors
          };
        } else if (currentProject) {
          // Autres modes non-conversationnels : Merger avec le projet existant
          console.log('🔀 Merging with existing project');
          
          const existingVendorIds = new Set((currentProject.vendors || []).map((v: any) => v.id));
          const newVendors = vendors.filter(v => !existingVendorIds.has(v.id));
          
          updatedWeddingContext = {
            summary: parsedResponse.summary || currentProject.summary,
            weddingData: parsedResponse.weddingData || currentProject.weddingData,
            budgetBreakdown: parsedResponse.budgetBreakdown || currentProject.budgetBreakdown,
            timeline: parsedResponse.timeline || currentProject.timeline,
            vendors: [...(currentProject.vendors || []), ...newVendors]
          };
        }
      } else {
        // Mode conversation : Préserver le projet existant
        console.log('💬 Conversational mode or organizationMode=false, preserving existing project');
        updatedWeddingContext = currentProject;
      }
      
      console.log('📦 Final wedding_context:', updatedWeddingContext ? 'Updated' : 'Null');
      console.log('🔄 Wedding Context Update:', {
        organizationMode,
        mode: parsedResponse.mode,
        beforeWeddingData: currentProject?.weddingData,
        afterWeddingData: updatedWeddingContext?.weddingData,
        vendorsCount: vendors.length
      });
      
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
          wedding_context: !parsedResponse.conversational && organizationMode ? {
            summary: parsedResponse.summary,
            weddingData: parsedResponse.weddingData,
            budgetBreakdown: parsedResponse.budgetBreakdown,
            timeline: parsedResponse.timeline,
            vendors: vendors
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

    return new Response(
      JSON.stringify({
        response: {
          ...parsedResponse,
          organizationMode
        },
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
