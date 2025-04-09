
import { ChatResponse, Message, Vendor, VendorRecommendation } from '@/types';
import vendorsData from '@/data/vendors.json';

// This function simulates sending a message to a chat service
export const sendMessage = async (messages: Message[]): Promise<ChatResponse> => {
  // Get the latest user message
  const latestUserMessage = messages.filter(m => m.role === 'user').pop();
  
  if (!latestUserMessage) {
    return { message: "Bonjour et félicitations pour votre mariage ! Je suis Mathilde de Mariable, votre wedding planner digital. Comment puis-je vous aider aujourd'hui ?" };
  }
  
  // Analyze the message to determine user needs
  const userQuery = latestUserMessage.content.toLowerCase();
  
  // Define the vendor types and locations we can detect
  const vendorTypes = {
    'photographe': ['photo', 'photographe', 'reportage', 'album', 'images', 'photos'],
    'lieu': ['lieu', 'salle', 'domaine', 'château', 'domaine', 'propriété', 'endroit', 'ferme', 'grange'],
    'traiteur': ['traiteur', 'nourriture', 'repas', 'cuisine', 'menu', 'gastronomie', 'chef'],
    'fleuriste': ['fleur', 'fleuriste', 'décoration florale', 'bouquet', 'centre de table'],
    'dj': ['dj', 'musique', 'animation', 'soirée', 'son', 'playlist', 'ambiance'],
    'wedding planner': ['wedding planner', 'organisateur', 'organisatrice', 'planificateur', 'planificatrice', 'organisation']
  };
  
  const locations = {
    'paris': ['paris', 'île-de-france', 'ile de france', 'idf', 'parisien'],
    'bordeaux': ['bordeaux', 'gironde', 'aquitaine', 'bordelais'],
    'lyon': ['lyon', 'rhône', 'rhone', 'lyonnais'],
    'nice': ['nice', 'côte d\'azur', 'cote d\'azur', 'alpes-maritimes'],
    'marseille': ['marseille', 'bouches-du-rhône', 'bouches du rhone', 'paca', 'provence'],
    'lille': ['lille', 'nord', 'hauts-de-france', 'hauts de france', 'lillois'],
    'annecy': ['annecy', 'haute-savoie', 'haute savoie', 'savoie', 'alpes'],
    'aix': ['aix', 'aix-en-provence', 'aix en provence', 'provence'],
    'reims': ['reims', 'champagne', 'marne', 'champagne-ardenne'],
    'strasbourg': ['strasbourg', 'alsace', 'bas-rhin', 'bas rhin'],
    'nantes': ['nantes', 'loire-atlantique', 'loire atlantique', 'pays de la loire'],
    'toulouse': ['toulouse', 'haute-garonne', 'haute garonne', 'occitanie'],
    'montpellier': ['montpellier', 'hérault', 'herault', 'occitanie'],
    'normandie': ['normandie', 'caen', 'rouen', 'calvados', 'manche', 'orne'],
    'bretagne': ['bretagne', 'rennes', 'brest', 'quimper', 'saint-malo', 'saint malo']
  };
  
  // Find vendor type mentioned in the message
  let foundVendorType: string | null = null;
  for (const [vendorType, keywords] of Object.entries(vendorTypes)) {
    for (const keyword of keywords) {
      if (userQuery.includes(keyword)) {
        foundVendorType = vendorType;
        break;
      }
    }
    if (foundVendorType) break;
  }
  
  // Find location mentioned in the message
  let foundLocation: string | null = null;
  for (const [location, keywords] of Object.entries(locations)) {
    for (const keyword of keywords) {
      if (userQuery.includes(keyword)) {
        foundLocation = location;
        break;
      }
    }
    if (foundLocation) break;
  }
  
  // Both vendor type and location are found
  if (foundVendorType && foundLocation) {
    return getRecommendations(foundVendorType, foundLocation);
  }
  
  // Only vendor type is found
  if (foundVendorType && !foundLocation) {
    return { 
      message: `Je vois que vous recherchez un${foundVendorType === 'photographe' || foundVendorType === 'traiteur' || foundVendorType === 'fleuriste' ? ' ' : 'e '}${foundVendorType}. Dans quelle région ou ville se déroulera votre mariage ? J'ai besoin de cette information pour vous recommander les meilleurs prestataires adaptés à votre localisation.`
    };
  }
  
  // Only location is found
  if (!foundVendorType && foundLocation) {
    return { 
      message: `Super, votre mariage se déroulera à ${capitalizeFirstLetter(foundLocation)}. Quel type de prestataire recherchez-vous en priorité ? Par exemple, un lieu, un photographe, un traiteur, un DJ, un fleuriste ou un wedding planner ?`
    };
  }
  
  // If this is the first or second message from user and no keywords are detected
  if (messages.filter(m => m.role === 'user').length <= 2) {
    return { 
      message: "Bonjour et félicitations pour votre mariage ! Je suis Mathilde de Mariable, votre wedding planner digital. Pour que je puisse vous recommander les bons prestataires, pourriez-vous me dire dans quelle région ou ville se déroulera votre mariage, et quel type de prestataire vous recherchez en priorité (lieu, photographe, traiteur, DJ, fleuriste...) ?"
    };
  }
  
  // Default response when no specific keywords are detected
  return {
    message: "Pour que je puisse vous recommander les meilleurs prestataires, j'aurais besoin de connaître deux informations essentielles : la région ou la ville de votre mariage, et le type de prestataire que vous recherchez (lieu, photographe, traiteur, DJ, fleuriste, wedding planner...). Pourriez-vous me préciser ces éléments ?"
  };
};

// Helper function to get recommendations based on vendor type and location
function getRecommendations(vendorType: string, location: string): ChatResponse {
  // Load vendors from JSON
  const vendors = vendorsData as Vendor[];
  
  // Filter vendors according to identified criteria
  let filteredVendors = [...vendors];
  
  // Filter by location
  filteredVendors = filteredVendors.filter(vendor => 
    vendor.lieu.toLowerCase().includes(location.toLowerCase())
  );
  
  // Filter by vendor type
  if (vendorType) {
    filteredVendors = filteredVendors.filter(vendor => 
      vendor.type.toLowerCase() === vendorType.toLowerCase() ||
      (vendorType === 'photographe' && vendor.type.toLowerCase() === 'photographe') ||
      (vendorType === 'dj' && vendor.type.toLowerCase() === 'dj')
    );
  }
  
  // If no results, widen the filter to just type
  if (filteredVendors.length === 0) {
    filteredVendors = vendors.filter(vendor => 
      vendor.type.toLowerCase() === vendorType.toLowerCase() ||
      (vendorType === 'photographe' && vendor.type.toLowerCase() === 'photographe') ||
      (vendorType === 'dj' && vendor.type.toLowerCase() === 'dj')
    );
    
    // Take up to 3 random vendors if we have more than 3
    if (filteredVendors.length > 3) {
      filteredVendors = filteredVendors.sort(() => 0.5 - Math.random()).slice(0, 3);
    }
  } else {
    // Limit to 3 recommendations 
    filteredVendors = filteredVendors.slice(0, 3);
  }
  
  let responseMessage = "";
  
  if (filteredVendors.length > 0) {
    const formattedVendorType = vendorType === 'wedding planner' ? 'wedding planners' : 
                                (vendorType === 'lieu' ? 'lieux' : `${vendorType}s`);
    
    responseMessage = `J'ai trouvé d'excellents ${formattedVendorType} dans la région de ${capitalizeFirstLetter(location)} qui pourraient correspondre à vos attentes.\n\nVoici une sélection de prestataires que je vous recommande :`;
    
    // Add follow-up question to keep the conversation going
    const otherVendorTypes = Object.keys(vendorsData.reduce((acc: Record<string, boolean>, vendor) => {
      if (vendor.type.toLowerCase() !== vendorType.toLowerCase()) {
        acc[vendor.type.toLowerCase()] = true;
      }
      return acc;
    }, {})).slice(0, 2);
    
    if (otherVendorTypes.length > 0) {
      const suggestionType1 = otherVendorTypes[0] === 'dj' ? 'un DJ' : 
                            (otherVendorTypes[0] === 'wedding planner' ? 'un wedding planner' : 
                            otherVendorTypes[0] === 'photographe' ? 'un photographe' : 
                            otherVendorTypes[0] === 'fleuriste' ? 'un fleuriste' : 
                            otherVendorTypes[0] === 'traiteur' ? 'un traiteur' : 'un lieu');
      
      const suggestionType2 = otherVendorTypes.length > 1 ? 
                            (otherVendorTypes[1] === 'dj' ? 'un DJ' : 
                            otherVendorTypes[1] === 'wedding planner' ? 'un wedding planner' : 
                            otherVendorTypes[1] === 'photographe' ? 'un photographe' : 
                            otherVendorTypes[1] === 'fleuriste' ? 'un fleuriste' : 
                            otherVendorTypes[1] === 'traiteur' ? 'un traiteur' : 'un lieu') : '';
      
      responseMessage += `\n\nSouhaitez-vous que je vous propose également ${suggestionType1}${suggestionType2 ? ` ou ${suggestionType2}` : ''} dans la même région ?`;
    } else {
      responseMessage += "\n\nY a-t-il un autre type de prestataire que je peux vous aider à trouver pour votre mariage ?";
    }
  } else {
    responseMessage = `Je n'ai pas encore de ${vendorType} répertorié dans la région de ${capitalizeFirstLetter(location)}. Souhaiteriez-vous que je vous suggère d'autres types de prestataires disponibles dans cette région, ou le même type de prestataire dans une autre région proche ?`;
  }
  
  // Create recommendations with personalized reasons
  const recommendations: VendorRecommendation[] = filteredVendors.map(vendor => {
    let reason = `${vendor.nom} est un${vendor.type === 'Photographe' || vendor.type === 'Traiteur' || vendor.type === 'Fleuriste' ? '' : 'e'} ${vendor.type.toLowerCase()} basé à ${vendor.lieu}`;
    
    // Add personalized touch based on vendor type
    switch(vendor.type) {
      case 'Photographe':
        reason += " qui propose un style ";
        break;
      case 'Lieu':
        reason += " qui offre un cadre ";
        break;
      case 'Traiteur':
        reason += " qui propose une cuisine ";
        break;
      case 'Fleuriste':
        reason += " qui crée des arrangements floraux ";
        break;
      case 'DJ':
        reason += " qui anime vos soirées avec un style ";
        break;
      default:
        reason += " qui propose des services ";
    }
    
    if (vendor.style && vendor.style.length > 0) {
      reason += `${vendor.style.join(' et ')}.`;
    } else {
      reason += "de qualité.";
    }
    
    if (vendor.type === 'Traiteur') {
      reason += ` Le tarif commence à ${vendor.budget}€ par personne.`;
    } else {
      reason += ` Le tarif commence à ${vendor.budget}€.`;
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

function capitalizeFirstLetter(string: string): string {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}
