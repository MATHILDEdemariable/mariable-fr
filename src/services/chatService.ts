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
    'dj': ['dj', 'musique', 'animation', 'soirée']
  };
  const styleKeywords = ['champêtre', 'élégant', 'bohème', 'traditionnel', 'moderne', 'vintage', 'rustique', 'minimaliste'];
  const budgetKeywords = userQuery.match(/budget[^\d]*(\d+)/i);
  const dateKeywords = userQuery.match(/(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)(\s+\d{4})?/i);
  const guestsKeywords = userQuery.match(/(\d+)\s*(invités|personnes|convives)/i);
  
  // Check conversation state
  const conversationState = getConversationState(messages);
  
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
      return getVendorRecommendations('lieu', location, null, null);
    } else {
      return { 
        message: "Je n'ai pas reconnu la région. Pourriez-vous me préciser dans quelle ville ou région vous souhaitez organiser votre mariage ?" 
      };
    }
  }
  
  if (conversationState.needsBudget && !conversationState.hasBudget) {
    // User is being asked about budget
    let budget = null;
    if (budgetKeywords && budgetKeywords[1]) {
      budget = parseInt(budgetKeywords[1], 10);
      return getVendorRecommendations(null, null, null, budget);
    } else {
      return { 
        message: "Je n'ai pas saisi votre budget. Pourriez-vous me donner une idée de votre budget global ou par prestation ?" 
      };
    }
  }
  
  if (conversationState.needsDate && !conversationState.hasDate) {
    // User is being asked about the date
    if (dateKeywords) {
      return { 
        message: `Merci ! Le mois de ${dateKeywords[1]} est une période magnifique pour un mariage. Maintenant, parlons du style de mariage que vous envisagez. Préférez-vous quelque chose de champêtre, élégant, bohème, ou traditionnel ?` 
      };
    } else {
      return { 
        message: "Je n'ai pas compris la date. Pourriez-vous me préciser le mois et l'année de votre mariage ?" 
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
      return getVendorRecommendations(null, null, style, null);
    } else {
      return { 
        message: "Je n'ai pas saisi votre style préféré. Cherchez-vous quelque chose de champêtre, élégant, bohème, traditionnel, ou peut-être moderne ?" 
      };
    }
  }
  
  if (conversationState.needsGuests && !conversationState.hasGuests) {
    // User is being asked about number of guests
    if (guestsKeywords) {
      const guests = parseInt(guestsKeywords[1], 10);
      return { 
        message: `Parfait ! Un mariage avec environ ${guests} invités nécessite une bonne organisation. Maintenant, pouvez-vous me dire quel type de prestataires vous recherchez en priorité : photographe, lieu, traiteur, fleuriste, DJ ?` 
      };
    } else {
      return { 
        message: "Je n'ai pas saisi le nombre d'invités. Pourriez-vous me préciser combien de personnes vous envisagez d'inviter ?" 
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
  let vendorType: string | null = null;
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
      return getVendorRecommendations(vendorType, location, style, budget);
    } else {
      // Otherwise, start gathering information
      return { 
        message: "Bonjour ! Pour vous aider à organiser votre mariage parfait, j'aurais besoin de quelques informations. Tout d'abord, dans quelle région ou ville souhaitez-vous organiser votre mariage ?" 
      };
    }
  }
  
  // If we have enough information, provide recommendations
  if (location || vendorType || style || budget) {
    return getVendorRecommendations(vendorType, location, style, budget);
  }
  
  // If all else fails, ask for more information
  const randomQuestion = getRandomFollowUpQuestion();
  return { message: randomQuestion };
};

// Helper function to get recommendation based on criteria
function getVendorRecommendations(
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
  
  // Generate a response based on the message and filtered vendors
  let responseMessage = "";
  
  if (filteredVendors.length > 0) {
    responseMessage = "Au vu de votre demande, voici une sélection de prestataires qui pourraient vous intéresser :";
    
    // If we have specific criteria, suggest a follow-up question
    if (location || vendorType || style || budget) {
      responseMessage += "\n\nSouhaitez-vous des informations supplémentaires sur ces prestataires ou avez-vous d'autres critères pour affiner votre recherche ?";
    }
  } else {
    responseMessage = "Je n'ai pas trouvé de prestataires correspondant exactement à vos critères. Pourriez-vous me donner plus de détails sur ce que vous recherchez ? Par exemple, le type de prestataire (photographe, lieu, traiteur), la région, votre budget ou le style que vous préférez.";
    
    // Add some random suggestions
    filteredVendors = vendors.sort(() => 0.5 - Math.random()).slice(0, 3);
    responseMessage += "\n\nEn attendant, voici quelques prestataires qui pourraient vous inspirer :";
  }
  
  // Create recommendations with reasons
  const recommendations: VendorRecommendation[] = filteredVendors.map(vendor => {
    let reason = `${vendor.nom} est un${vendor.type === 'Photographe' || vendor.type === 'Traiteur' || vendor.type === 'Fleuriste' ? '' : 'e'} ${vendor.type.toLowerCase()} à ${vendor.lieu}`;
    
    if (vendor.style && vendor.style.length > 0) {
      reason += ` proposant un style ${vendor.style.join(' et ')}`;
    }
    
    if (vendor.type === 'Traiteur') {
      reason += ` à partir de ${vendor.budget}€ par personne`;
    } else {
      reason += ` à partir de ${vendor.budget}€`;
    }
    
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
  const hasDate = /(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)(\s+\d{4})?/.test(allText);
  const hasStyle = /champêtre|élégant|bohème|traditionnel|moderne|vintage|rustique|minimaliste/.test(allText);
  const hasGuests = /(\d+)\s*(invités|personnes|convives)/.test(allText);
  
  // Check what information we're currently asking for
  const needsLocation = lastAssistantMessage.includes('quelle région') || lastAssistantMessage.includes('quelle ville');
  const needsBudget = lastAssistantMessage.includes('budget');
  const needsDate = lastAssistantMessage.includes('date') || lastAssistantMessage.includes('quand');
  const needsStyle = lastAssistantMessage.includes('style');
  const needsGuests = lastAssistantMessage.includes('invités') || lastAssistantMessage.includes('personnes');
  
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

// Helper function to get a random follow-up question
function getRandomFollowUpQuestion(): string {
  const questions = [
    "Pouvez-vous me parler de la date envisagée pour votre mariage ?",
    "Avez-vous une idée du nombre d'invités que vous souhaitez convier ?",
    "Quel style de mariage vous fait rêver : champêtre, élégant, bohème, traditionnel ?",
    "Avez-vous déjà défini un budget pour votre mariage ?",
    "Y a-t-il un type de prestataire que vous recherchez en priorité ? (photographe, lieu, traiteur, fleuriste, DJ)",
    "Dans quelle région ou ville souhaitez-vous organiser votre mariage ?",
    "Quelles sont vos priorités pour ce grand jour ?"
  ];
  
  return questions[Math.floor(Math.random() * questions.length)];
}
