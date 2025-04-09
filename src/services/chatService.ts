import { ChatResponse, Message, Vendor, VendorRecommendation } from '@/types';
import vendorsData from '@/data/vendors.json';

// This function simulates sending a message to a chat service
export const sendMessage = async (messages: Message[]): Promise<ChatResponse> => {
  // Get the latest user message
  const latestUserMessage = messages.filter(m => m.role === 'user').pop();
  
  if (!latestUserMessage) {
    return { message: "Je n'ai pas compris votre demande. Pourriez-vous reformuler s'il vous plaît?" };
  }
  
  // Analyze the message to determine user needs
  const userQuery = latestUserMessage.content.toLowerCase();
  
  // Extract potential information from the user message
  const locationKeywords = ['paris', 'bordeaux', 'lyon', 'nice', 'marseille', 'lille', 'annecy', 'aix', 'reims', 'strasbourg'];
  const typeKeywords = {
    'photographe': ['photo', 'photographe', 'reportage', 'album'],
    'lieu': ['lieu', 'salle', 'domaine', 'château', 'domaine', 'propriété'],
    'traiteur': ['traiteur', 'nourriture', 'repas', 'cuisine', 'menu'],
    'fleuriste': ['fleur', 'fleuriste', 'décoration florale'],
    'dj': ['dj', 'musique', 'animation', 'soirée'],
    'wedding planner': ['wedding planner', 'organisateur', 'organisatrice', 'planificateur', 'planificatrice']
  };
  const styleKeywords = ['champêtre', 'élégant', 'bohème', 'traditionnel', 'moderne', 'vintage', 'rustique', 'minimaliste'];
  const budgetKeywords = userQuery.match(/budget[^\d]*(\d+)/i);
  const dateKeywords = userQuery.match(/(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)(\s+\d{4})?/i) || 
                      userQuery.match(/(\d{1,2})[\s/.-](\d{1,2})[\s/.-](\d{2,4})/);
  const guestsKeywords = userQuery.match(/(\d+)\s*(invités|personnes|convives)/i);
  
  // Check conversation state
  const conversationState = getConversationState(messages);
  
  // First, check for key vendor words to trigger recommendations
  let hasVendorKeyword = false;
  let vendorType = null;
  
  for (const [type, keywords] of Object.entries(typeKeywords)) {
    for (const keyword of keywords) {
      if (userQuery.includes(keyword)) {
        hasVendorKeyword = true;
        vendorType = type;
        break;
      }
    }
    if (hasVendorKeyword) break;
  }
  
  if (hasVendorKeyword) {
    return getVendorRecommendationsWithEnthusiasm(vendorType, null, null, null);
  }
  
  // If no vendor keywords, continue with conversation flow
  
  // If we're in a specific state in the conversation, handle it accordingly
  if (conversationState.needsLocation && !conversationState.hasLocation) {
    // User is being asked about location
    let location = null;
    for (const loc of locationKeywords) {
      if (userQuery.includes(loc)) {
        location = loc;
        break;
      }
    }
    
    if (location) {
      return { 
        message: `${getPositiveReaction()} ${capitalizeFirstLetter(location)} est un choix splendide pour un mariage ! J'adore cette région. ${getLocationComment(location)} Maintenant, parlons un peu de vos invités. Combien de personnes envisagez-vous d'inviter à votre mariage ?`
      };
    } else {
      return { 
        message: `J'aimerais vraiment vous aider avec les meilleurs prestataires de votre région ! Dans quelle ville ou région prévoyez-vous de célébrer votre mariage ?` 
      };
    }
  }
  
  if (conversationState.needsBudget && !conversationState.hasBudget) {
    // User is being asked about budget
    let budget = null;
    if (budgetKeywords && budgetKeywords[1]) {
      budget = parseInt(budgetKeywords[1], 10);
      return { 
        message: `Merci pour cette précision sur votre budget ! ${getBudgetComment(budget)} Pour mieux vous accompagner, quelle est la date prévue pour votre mariage ?` 
      };
    } else {
      return { 
        message: `Je comprends que parler budget n'est pas toujours facile ! Avez-vous une idée du budget global que vous envisagez pour votre mariage ? Cela m'aidera à vous proposer des prestataires qui correspondent à vos attentes.` 
      };
    }
  }
  
  if (conversationState.needsDate && !conversationState.hasDate) {
    // User is being asked about the date
    if (dateKeywords) {
      const datePart = dateKeywords[0];
      return { 
        message: `${getPositiveReaction()} Un mariage en ${datePart} ! C'est une période vraiment merveilleuse. ${getDateComment(datePart)} Maintenant, parlons du style de votre mariage ! Avez-vous une préférence ? Par exemple champêtre, élégant, bohème, traditionnel...` 
      };
    } else {
      return { 
        message: `J'adore connaître la saison de votre mariage pour mieux imaginer votre grand jour ! Avez-vous déjà fixé une date ou au moins un mois en particulier ?` 
      };
    }
  }
  
  if (conversationState.needsStyle && !conversationState.hasStyle) {
    // User is being asked about style
    let style = null;
    for (const s of styleKeywords) {
      if (userQuery.includes(s)) {
        style = s;
        break;
      }
    }
    
    if (style) {
      return { 
        message: `Un mariage ${style}, j'adore ce choix ! ${getStyleComment(style)} Maintenant que j'ai une meilleure idée de vos goûts, quel type de prestataires recherchez-vous en priorité ? Photographe, lieu, traiteur, fleuriste, DJ... ?` 
      };
    } else {
      return { 
        message: `Je suis curieuse de connaître l'ambiance que vous imaginez pour votre mariage ! Pensez-vous à quelque chose de champêtre, élégant, bohème, traditionnel... ? Chaque style a son charme unique !` 
      };
    }
  }
  
  if (conversationState.needsGuests && !conversationState.hasGuests) {
    // User is being asked about number of guests
    if (guestsKeywords) {
      const guests = parseInt(guestsKeywords[1], 10);
      return { 
        message: `${getPositiveReaction()} Un mariage avec ${guests} personnes, c'est ${getGuestsComment(guests)} ! Maintenant, je peux mieux vous aider avec des recommandations. Quel type de prestataire vous intéresse le plus : photographe, lieu, traiteur, fleuriste, DJ... ?` 
      };
    } else {
      return { 
        message: `C'est toujours utile de savoir combien d'invités vous prévoyez, car cela influence beaucoup de décisions ! Avez-vous une idée du nombre de personnes que vous aimeriez convier à votre grand jour ?` 
      };
    }
  }
  
  // Identify the potential location
  let location: string | null = null;
  for (const loc of locationKeywords) {
    if (userQuery.includes(loc)) {
      location = loc;
      break;
    }
  }
  
  // Identify the vendor type
  vendorType = null;
  for (const [type, keywords] of Object.entries(typeKeywords)) {
    for (const keyword of keywords) {
      if (userQuery.includes(keyword)) {
        vendorType = type;
        break;
      }
    }
    if (vendorType) break;
  }
  
  // Identify the potential style
  let style: string | null = null;
  for (const s of styleKeywords) {
    if (userQuery.includes(s)) {
      style = s;
      break;
    }
  }
  
  // Identify the potential budget
  let budget: number | null = null;
  if (budgetKeywords && budgetKeywords[1]) {
    budget = parseInt(budgetKeywords[1], 10);
  }
  
  // Start conversation if this is the first or second message
  if (messages.filter(m => m.role === 'user').length <= 2) {
    if (location || vendorType || style || budget) {
      // If we already have some information, use it for recommendations
      return getVendorRecommendationsWithEnthusiasm(vendorType, location, style, budget);
    } else {
      // Otherwise, start gathering information with a warm welcome
      return { 
        message: "Bonjour et félicitations pour votre mariage ! Je suis Mathilde, votre wedding planner virtuelle, et je suis là pour vous simplifier la vie. Pour commencer à vous aider, j'aimerais en savoir plus sur vos projets. Dans quelle région ou ville envisagez-vous de célébrer votre grand jour ?" 
      };
    }
  }
  
  // If we have enough information, provide recommendations
  if (location || vendorType || style || budget) {
    return getVendorRecommendationsWithEnthusiasm(vendorType, location, style, budget);
  }
  
  // If all else fails, continue the conversation naturally
  const randomQuestion = getPersonalizedFollowUpQuestion(userQuery);
  return { message: randomQuestion };
};

// Helper function to get recommendation based on criteria with enthusiastic language
function getVendorRecommendationsWithEnthusiasm(
  vendorType: string | null, 
  location: string | null, 
  style: string | null, 
  budget: number | null
): ChatResponse {
  // Load vendors from JSON
  const vendors = vendorsData as Vendor[];
  
  // Filter vendors according to identified criteria
  let filteredVendors = [...vendors];
  
  if (location) {
    filteredVendors = filteredVendors.filter(vendor => 
      vendor.lieu.toLowerCase().includes(location!)
    );
  }
  
  if (vendorType) {
    filteredVendors = filteredVendors.filter(vendor => 
      vendor.type.toLowerCase() === vendorType!.toLowerCase()
    );
  }
  
  if (style) {
    filteredVendors = filteredVendors.filter(vendor => 
      vendor.style.some(s => s.toLowerCase().includes(style!.toLowerCase()))
    );
  }
  
  if (budget) {
    filteredVendors = filteredVendors.filter(vendor => vendor.budget <= budget!);
  }
  
  // If no specific filter worked, try to infer what they are looking for
  if (filteredVendors.length === 0) {
    // If a location is mentioned, show all vendors from that location
    if (location) {
      filteredVendors = vendors.filter(vendor => 
        vendor.lieu.toLowerCase().includes(location!)
      );
    }
    // If a type is mentioned, show all vendors of that type
    else if (vendorType) {
      filteredVendors = vendors.filter(vendor => 
        vendor.type.toLowerCase() === vendorType!.toLowerCase()
      );
    }
    // By default, show a mix of vendors if no other criteria was identified
    else {
      // Get 3 random vendors of different types
      const types = Array.from(new Set(vendors.map(v => v.type)));
      filteredVendors = [];
      
      for (const type of types.slice(0, 3)) {
        const vendorsOfType = vendors.filter(v => v.type === type);
        if (vendorsOfType.length > 0) {
          const randomIndex = Math.floor(Math.random() * vendorsOfType.length);
          filteredVendors.push(vendorsOfType[randomIndex]);
        }
      }
    }
  }
  
  // Limit to 3 recommendations maximum
  filteredVendors = filteredVendors.slice(0, 3);
  
  // Generate an enthusiastic response based on the message and filtered vendors
  let responseMessage = "";
  
  if (filteredVendors.length > 0) {
    // Create a personalized and enthusiastic message
    responseMessage = getEnthusiasticIntro(vendorType, location, style);
    
    responseMessage += "\n\nVoici une sélection de prestataires qui pourraient vous intéresser :";
    
    // Add a personalized closing
    responseMessage += "\n\nQu'en pensez-vous ? Ces prestataires correspondent-ils à ce que vous recherchiez ? N'hésitez pas à me poser des questions si vous avez besoin de plus de détails !";
  } else {
    responseMessage = "Votre projet de mariage a l'air merveilleux ! Je n'ai pas trouvé de prestataires correspondant exactement à vos critères dans ma base de données pour le moment, mais je serais ravie d'en savoir plus pour vous aider.";
    
    if (vendorType) {
      responseMessage += ` Pourriez-vous me préciser dans quelle région vous cherchez un${vendorType === 'Photographe' || vendorType === 'Traiteur' || vendorType === 'Fleuriste' ? '' : 'e'} ${vendorType.toLowerCase()} ?`;
    } else {
      responseMessage += " Quel type de prestataire recherchez-vous en priorité ? Un lieu, un traiteur, un photographe, un DJ, un fleuriste ?";
    }
    
    // Add some random suggestions
    filteredVendors = vendors.sort(() => 0.5 - Math.random()).slice(0, 3);
    responseMessage += "\n\nEn attendant, voici quelques prestataires qui pourraient vous inspirer :";
  }
  
  // Create recommendations with personalized reasons
  const recommendations: VendorRecommendation[] = filteredVendors.map(vendor => {
    let reason = getPersonalizedReason(vendor, style);
    
    return {
      vendor,
      reason
    };
  });
  
  return {
    message: responseMessage,
    recommendations
  };
}

// Helper function to get the current state of the conversation
function getConversationState(messages: Message[]) {
  const userMessages = messages.filter(m => m.role === 'user');
  const assistantMessages = messages.filter(m => m.role === 'assistant');
  
  const lastAssistantMessage = assistantMessages[assistantMessages.length - 1]?.content.toLowerCase() || '';
  
  // Check what information we've gathered so far
  const allText = messages.map(m => m.content.toLowerCase()).join(' ');
  
  const hasLocation = /paris|bordeaux|lyon|nice|marseille|lille|annecy|aix|reims|strasbourg/.test(allText);
  const hasBudget = /budget[^\d]*\d+/.test(allText);
  const hasDate = /(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)(\s+\d{4})?/.test(allText) || 
                  /\d{1,2}[\s/.-]\d{1,2}[\s/.-]\d{2,4}/.test(allText);
  const hasStyle = /champêtre|élégant|bohème|traditionnel|moderne|vintage|rustique|minimaliste/.test(allText);
  const hasGuests = /(\d+)\s*(invités|personnes|convives)/.test(allText);
  
  // Check what information we're currently asking for
  const needsLocation = lastAssistantMessage.includes('quelle région') || 
                        lastAssistantMessage.includes('quelle ville') || 
                        lastAssistantMessage.includes('où') && lastAssistantMessage.includes('mariage');
  
  const needsBudget = lastAssistantMessage.includes('budget') && 
                      (lastAssistantMessage.includes('?') || lastAssistantMessage.includes('envisag'));
  
  const needsDate = (lastAssistantMessage.includes('date') || 
                    lastAssistantMessage.includes('quand') ||
                    lastAssistantMessage.includes('mois')) && 
                    lastAssistantMessage.includes('?');
  
  const needsStyle = lastAssistantMessage.includes('style') ||
                     lastAssistantMessage.includes('ambiance') ||
                     lastAssistantMessage.includes('champêtre') ||
                     lastAssistantMessage.includes('élégant') ||
                     lastAssistantMessage.includes('bohème');
  
  const needsGuests = lastAssistantMessage.includes('invités') || 
                      lastAssistantMessage.includes('personnes') ||
                      lastAssistantMessage.includes('combien');
  
  return {
    hasLocation,
    hasBudget,
    hasDate,
    hasStyle,
    hasGuests,
    needsLocation,
    needsBudget,
    needsDate,
    needsStyle,
    needsGuests
  };
}

// Helper function to generate personalized follow-up questions based on user input
function getPersonalizedFollowUpQuestion(userQuery: string): string {
  // Extract user-mentioned topics to make personalized questions
  const topics = {
    'date': userQuery.includes('date') || userQuery.includes('quand') || userQuery.includes('mois'),
    'lieu': userQuery.includes('lieu') || userQuery.includes('salle') || userQuery.includes('endroit'),
    'style': userQuery.includes('style') || userQuery.includes('thème') || userQuery.includes('ambiance'),
    'budget': userQuery.includes('budget') || userQuery.includes('coût') || userQuery.includes('prix'),
    'invités': userQuery.includes('invités') || userQuery.includes('convives') || userQuery.includes('personnes'),
    'prestataires': userQuery.includes('prestataire') || userQuery.includes('photographe') || userQuery.includes('traiteur')
  };

  // Prioritize follow-up based on mentioned topics
  if (topics.lieu) {
    return "Le lieu est effectivement l'une des premières décisions importantes ! Dans quelle région ou ville souhaitez-vous célébrer votre mariage ? J'ai des contacts avec des domaines et salles magnifiques un peu partout en France.";
  }
  
  if (topics.date) {
    return "La date est un élément clé ! Avez-vous déjà une idée du mois ou de la saison qui vous fait rêver pour votre grand jour ? Certaines périodes sont particulièrement magiques selon les régions.";
  }
  
  if (topics.invités) {
    return "Le nombre d'invités est effectivement crucial pour organiser votre mariage ! Avez-vous une idée approximative du nombre de personnes que vous souhaiteriez convier à cette belle journée ? Cela influence beaucoup le choix du lieu et du traiteur.";
  }
  
  if (topics.style) {
    return "L'ambiance de votre mariage est ce qui le rendra unique et mémorable ! Quel style vous attire ? Quelque chose de champêtre, élégant, bohème... ?";
  }
  
  if (topics.budget) {
    return "Le budget est effectivement un aspect important à clarifier dès le début. Avez-vous défini une fourchette pour l'ensemble de votre mariage ? Cela m'aidera à vous orienter vers des prestataires adaptés à vos attentes.";
  }
  
  if (topics.prestataires) {
    return "Je comprends que trouver les bons prestataires est essentiel ! Quels sont les services prioritaires pour vous : photographe, lieu, traiteur, fleuriste, DJ ? Je pourrais vous faire des recommandations personnalisées.";
  }
  
  // If no specific topic is identified, ask a general question
  const questions = [
    "J'aimerais mieux comprendre vos attentes pour ce grand jour. Dans quelle région envisagez-vous de célébrer votre mariage ?",
    "Chaque mariage est unique ! Pour mieux vous accompagner, pourriez-vous me parler de l'ambiance que vous imaginez pour votre célébration ? Quelque chose de champêtre, élégant, bohème... ?",
    "Pour vous proposer les meilleurs prestataires, j'aurais besoin de savoir si vous avez déjà une date ou une saison en tête pour votre mariage ?",
    "J'adorerais vous aider avec des recommandations personnalisées ! Quel type de prestataire recherchez-vous en priorité : photographe, lieu, traiteur, fleuriste, DJ ?",
    "Les préparatifs d'un mariage sont passionnants ! Avez-vous déjà une idée du nombre d'invités que vous souhaiteriez convier à cette belle journée ?",
    "Pour mieux vous guider, pourriez-vous me parler un peu plus de vos envies pour ce mariage ? Y a-t-il un aspect en particulier qui vous tient à cœur ?"
  ];
  
  return questions[Math.floor(Math.random() * questions.length)];
}

// Helper functions for more conversational responses
function getEnthusiasticIntro(vendorType: string | null, location: string | null, style: string | null): string {
  let intro = "";
  
  if (vendorType && location && style) {
    intro = `Fantastique ! Je comprends parfaitement que vous recherchiez un${vendorType === 'photographe' || vendorType === 'traiteur' || vendorType === 'fleuriste' ? ' ' : 'e '}${vendorType} dans la région de ${capitalizeFirstLetter(location)} pour créer une ambiance ${style}.`;
  } else if (vendorType && location) {
    intro = `Super ! J'ai quelques ${vendorType}s talentueux à vous proposer dans la région de ${capitalizeFirstLetter(location)}.`;
  } else if (vendorType && style) {
    intro = `Excellente idée ! Un${vendorType === 'photographe' || vendorType === 'traiteur' || vendorType === 'fleuriste' ? ' ' : 'e '}${vendorType} qui sait créer une ambiance ${style} apportera vraiment une touche spéciale à votre mariage.`;
  } else if (location && style) {
    intro = `${capitalizeFirstLetter(location)} est un excellent choix pour un mariage ${style} ! J'adore cette combinaison.`;
  } else if (vendorType) {
    intro = `Je serais ravie de vous aider à trouver le${vendorType === 'photographe' || vendorType === 'traiteur' || vendorType === 'fleuriste' ? ' ' : 'a '}${vendorType} parfait(e) pour votre grand jour !`;
  } else if (location) {
    intro = `${capitalizeFirstLetter(location)} offre tellement de belles possibilités pour un mariage ! J'ai quelques suggestions qui pourraient vous plaire.`;
  } else if (style) {
    intro = `Un mariage ${style}, quelle belle vision ! Ce style crée vraiment une atmosphère mémorable.`;
  } else {
    intro = "Voici quelques prestataires de qualité qui pourraient correspondre à ce que vous recherchez !";
  }
  
  return intro;
}

function getPersonalizedReason(vendor: Vendor, style: string | null): string {
  const styleMatch = style && vendor.style.some(s => s.toLowerCase().includes(style.toLowerCase()));
  
  let reason = `${vendor.nom} est un${vendor.type === 'Photographe' || vendor.type === 'Traiteur' || vendor.type === 'Fleuriste' ? '' : 'e'} ${vendor.type.toLowerCase()} à ${vendor.lieu}`;
  
  // Add personalized touch based on vendor type
  switch(vendor.type) {
    case 'Photographe':
      reason += " qui capture des moments inoubliables avec";
      break;
    case 'Lieu':
      reason += " qui offre un cadre magnifique avec";
      break;
    case 'Traiteur':
      reason += " qui propose une cuisine délicieuse avec";
      break;
    case 'Fleuriste':
      reason += " qui crée des arrangements floraux superbes avec";
      break;
    case 'DJ':
      reason += " qui anime vos soirées avec";
      break;
    default:
      reason += " qui propose des services de qualité avec";
  }
  
  if (vendor.style && vendor.style.length > 0) {
    reason += ` un style ${vendor.style.join(' et ')}`;
    if (styleMatch) {
      reason += " - exactement ce que vous recherchez !";
    } else {
      reason += " qui pourrait vous plaire.";
    }
  }
  
  if (vendor.type === 'Traiteur') {
    reason += ` Le tarif commence à ${vendor.budget}€ par personne.`;
  } else {
    reason += ` Le tarif commence à ${vendor.budget}€.`;
  }
  
  return reason;
}

function getPositiveReaction(): string {
  const reactions = [
    "Super !",
    "Parfait !",
    "Génial !",
    "Excellent !",
    "Magnifique !",
    "Merveilleux !",
    "Fantastique !",
    "Quelle belle idée !"
  ];
  
  return reactions[Math.floor(Math.random() * reactions.length)];
}

function getLocationComment(location: string): string {
  const comments: {[key: string]: string[]} = {
    'paris': ["La capitale offre tellement d'options élégantes pour un mariage !", "Paris est idéale pour un mariage sophistiqué et plein de charme."],
    'bordeaux': ["La région bordelaise avec ses vignobles est parfaite pour un mariage mémorable !", "J'adore Bordeaux pour ses domaines viticoles qui font des lieux de réception exceptionnels."],
    'lyon': ["Lyon et sa gastronomie, un excellent choix pour impressionner vos invités !", "La région lyonnaise offre un cadre magnifique entre ville et campagne."],
    'nice': ["La Côte d'Azur, quelle destination de rêve pour célébrer votre amour !", "Nice offre cette lumière méditerranéenne incomparable pour vos photos."],
    'marseille': ["Marseille et ses calanques, un décor naturel époustouflant pour votre grand jour !", "J'adore la chaleur et l'authenticité du sud pour un mariage."],
    'lille': ["Le Nord a tellement de charme, avec ses bâtisses en briques et son ambiance chaleureuse !", "Lille et sa région offrent des lieux atypiques pleins de caractère."],
    'annecy': ["Les montagnes et le lac d'Annecy, un cadre idyllique pour un mariage !", "Annecy est si romantique, vos photos seront à couper le souffle."],
    'aix': ["La Provence et ses champs de lavande, un décor de rêve pour un mariage en été !", "Aix-en-Provence a cette élégance naturelle qui sublimera votre célébration."],
    'reims': ["La Champagne, quelle région symbolique pour célébrer votre union !", "Reims et ses maisons de champagne, l'assurance d'une réception pétillante !"],
    'strasbourg': ["L'Alsace a tant de charme avec ses maisons à colombages et sa gastronomie !", "Strasbourg allie si bien tradition et modernité pour un mariage unique."]
  };
  
  if (comments[location] && comments[location].length > 0) {
    return comments[location][Math.floor(Math.random() * comments[location].length)];
  }
  
  return "Cette région offre de très belles possibilités pour votre célébration !";
}

function getBudgetComment(budget: number): string {
  if (budget <= 10000) {
    return "Avec un budget bien défini, nous pouvons trouver des prestataires de qualité qui respectent vos limites financières. L'essentiel est de prioriser ce qui compte vraiment pour vous !";
  } else if (budget <= 20000) {
    return "C'est un budget raisonnable qui vous permettra de créer un très beau mariage en faisant les bons choix et en priorisant vos envies !";
  } else if (budget <= 30000) {
    return "Votre budget vous offre de belles possibilités pour créer un mariage mémorable avec des prestataires de qualité !";
  } else {
    return "Avec ce budget, nous avons une belle marge pour travailler avec d'excellents prestataires et créer exactement l'atmosphère dont vous rêvez !";
  }
}

function getDateComment(date: string): string {
  if (date.includes('mai') || date.includes('juin') || date.includes('septembre')) {
    return "C'est l'une des périodes les plus prisées pour les mariages, pensez à réserver vos prestataires rapidement !";
  } else if (date.includes('juillet') || date.includes('août')) {
    return "Un mariage en plein été, parfait pour profiter de longues soirées et de la chaleur !";
  } else if (date.includes('décembre') || date.includes('février') || date.includes('janvier')) {
    return "Un mariage hivernal peut être si chaleureux et magique avec la bonne décoration !";
  } else if (date.includes('octobre') || date.includes('novembre')) {
    return "J'adore les mariages d'automne avec leurs couleurs chaudes et leur ambiance cosy !";
  } else if (date.includes('mars') || date.includes('avril')) {
    return "Le printemps apporte cette touche de renouveau et de fraîcheur parfaite pour un mariage !";
  }
  
  return "C'est une très bonne période pour célébrer votre union !";
}

function getStyleComment(style: string): string {
  const comments: {[key: string]: string} = {
    'champêtre': "Les mariages champêtres ont ce charme naturel et décontracté qui met tout le monde à l'aise. On peut jouer avec les fleurs de saison, le bois, et créer une atmosphère authentique.",
    'élégant': "L'élégance intemporelle, quel excellent choix ! Pensez aux détails raffinés, aux couleurs sobres peut-être rehaussées d'une touche métallique comme l'or ou l'argent.",
    'bohème': "J'adore le style bohème pour sa liberté créative ! On peut mélanger les textures, ajouter des touches ethniques, jouer avec les macramés et les fleurs sauvages.",
    'traditionnel': "Il y a quelque chose de profondément émouvant dans un mariage traditionnel. C'est un style qui traverse les époques et crée des souvenirs intemporels.",
    'moderne': "Un mariage moderne offre tant de possibilités pour exprimer votre personnalité ! Des lignes épurées, des concepts innovants, c'est un style qui vous ressemble.",
    'vintage': "Le charme du passé avec une touche contemporaine, le vintage permet de créer une atmosphère nostalgique et pleine de caractère.",
    'rustique': "Le style rustique apporte cette chaleur et cette authenticité si particulières. Bois, matériaux bruts, simplicité... tout pour un mariage convivial !",
    'minimaliste': "J'apprécie beaucoup l'approche minimaliste où chaque détail est choisi avec soin. 'Less is more' comme on dit, pour un résultat élégant et impactant."
  };
  
  if (comments[style]) {
    return comments[style];
  }
  
  return "Ce style va créer une atmosphère vraiment unique pour votre célébration !";
}

function getGuestsComment(guests: number): string {
  if (guests <= 30) {
    return "tellement intime et personnel";
  } else if (guests <= 80) {
    return "une taille parfaite, ni trop grand ni trop petit";
  } else if (guests <= 150) {
    return "une belle assemblée pour partager votre bonheur";
  } else {
    return "une grande fête mémorable";
  }
}

function capitalizeFirstLetter(string: string): string {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}
