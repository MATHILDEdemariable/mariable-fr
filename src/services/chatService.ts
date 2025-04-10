import { ChatResponse, Message, Vendor, VendorRecommendation } from '@/types';
import vendorsData from '@/data/vendors.json';

// This function simulates sending a message to a chat service
export const sendMessage = async (messages: Message[]): Promise<ChatResponse> => {
  // Get the latest user message
  const latestUserMessage = messages.filter(m => m.role === 'user').pop();
  
  if (!latestUserMessage) {
    return { 
      message: "Bonjour et félicitations pour votre mariage ! Je suis Mathilde de Mariable, votre wedding planner digital ✨ Dites-moi tout, je vais vous aider à trouver les meilleurs prestataires selon vos envies."
    };
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

  // Check if this is the first message from the user
  const userMessageCount = messages.filter(m => m.role === 'user').length;
  
  // If this is the first user message, always ask for both prestataire type and location
  if (userMessageCount === 1) {
    return {
      message: "Merci pour ces informations ! Pour mieux vous aider, pourriez-vous me préciser deux éléments essentiels :\n\n1. Quel type de prestataire recherchez-vous ? (lieu, traiteur, photographe, DJ, fleuriste...)\n\n2. Dans quelle ville ou région se déroulera votre mariage ?"
    };
  }
  
  // After the first message, if we're still missing one or both pieces of info, ask specifically for what's missing
  if (userMessageCount > 1) {
    if (!foundVendorType && !foundLocation) {
      return {
        message: "Pour vous proposer les meilleurs prestataires, j'ai besoin de savoir :\n\n1. Quel type de prestataire recherchez-vous ? (lieu, traiteur, photographe...)\n\n2. Dans quelle ville ou région se déroulera votre mariage ?"
      };
    } else if (!foundVendorType) {
      return {
        message: `Merci pour cette information sur ${capitalizeFirstLetter(foundLocation!)}. Pourriez-vous me préciser quel type de prestataire vous recherchez ? (lieu, traiteur, photographe, DJ, fleuriste...)`
      };
    } else if (!foundLocation) {
      return {
        message: `Je vois que vous cherchez un${foundVendorType === 'photographe' || foundVendorType === 'traiteur' || foundVendorType === 'fleuriste' ? ' ' : 'e '}${foundVendorType}. Dans quelle ville ou région se déroulera votre mariage ?`
      };
    }
  }
  
  // Both vendor type and location are found, provide recommendations
  if (foundVendorType && foundLocation) {
    return getRecommendations(foundVendorType, foundLocation);
  }
  
  // If the message contains "plus" or "détails" or "information" - suggest sign up
  if (userQuery.includes('plus') || userQuery.includes('détail') || 
      userQuery.includes('information') || userQuery.includes('contact') ||
      userQuery.includes('complet') || userQuery.includes('guide')) {
    return {
      message: "Pour accéder à notre sélection complète, inscrivez-vous à notre Guide Mariable !",
      shouldRedirect: true
    };
  }
  
  // Default response when no specific keywords are detected
  return {
    message: "Pour vous proposer des recommandations personnalisées, j'ai besoin de savoir quel type de prestataire vous intéresse (lieu, photographe, traiteur...) et dans quelle région se déroulera votre mariage."
  };
};

// Helper function to get location-based recommendations
function getLocationRecommendations(location: string): ChatResponse {
  // Load vendors from JSON
  const vendors = vendorsData as Vendor[];
  
  // Filter vendors by location
  let filteredVendors = vendors.filter(vendor => 
    vendor.lieu.toLowerCase().includes(location.toLowerCase())
  );
  
  // Take up to 2 random vendors if we have more than 2
  if (filteredVendors.length > 2) {
    filteredVendors = filteredVendors.sort(() => 0.5 - Math.random()).slice(0, 2);
  }
  
  if (filteredVendors.length > 0) {
    const responseMessage = `Voici quelques prestataires à ${capitalizeFirstLetter(location)} qui pourraient vous intéresser. Pour des recommandations plus précises, merci de me préciser quel type de prestataire vous recherchez spécifiquement.`;
    
    // Create recommendations
    const recommendations: VendorRecommendation[] = filteredVendors.map(vendor => ({
      vendor,
      reason: `${vendor.nom} est un${vendor.type === 'Photographe' || vendor.type === 'Traiteur' || vendor.type === 'Fleuriste' ? '' : 'e'} ${vendor.type.toLowerCase()} à ${vendor.lieu} (${vendor.budget}€${vendor.type === 'Traiteur' ? '/personne' : ''}).`
    }));
    
    return {
      message: responseMessage,
      recommendations,
      shouldRedirect: true
    };
  } else {
    return {
      message: `Je n'ai pas encore de prestataires à ${capitalizeFirstLetter(location)}. Pourriez-vous me préciser un autre lieu comme Paris, Lyon ou Bordeaux où nous avons d'excellents prestataires ?`
    };
  }
}

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
    
    // Take up to 2 random vendors if we have more than 2
    if (filteredVendors.length > 2) {
      filteredVendors = filteredVendors.sort(() => 0.5 - Math.random()).slice(0, 2);
    }
  } else {
    // Limit to 2 recommendations for a cleaner interface
    filteredVendors = filteredVendors.slice(0, 2);
  }
  
  let responseMessage = "";
  let shouldRedirect = false;
  
  if (filteredVendors.length > 0) {
    const formattedVendorType = vendorType === 'wedding planner' ? 'wedding planners' : 
                                (vendorType === 'lieu' ? 'lieux' : `${vendorType}s`);
    
    responseMessage = `Parfait ! Voici mes recommandations de ${formattedVendorType} à ${capitalizeFirstLetter(location)} :`;
    
    // Always set redirect flag to encourage sign up
    shouldRedirect = true;
  } else {
    responseMessage = `Je n'ai pas de ${vendorType} à ${capitalizeFirstLetter(location)} dans ma base de données. Pourriez-vous essayer un autre lieu comme Paris, Lyon ou Bordeaux où nous avons une plus grande sélection ?`;
  }
  
  // Create recommendations with personalized reasons
  const recommendations: VendorRecommendation[] = filteredVendors.map(vendor => {
    let reason = `${vendor.nom} est un${vendor.type === 'Photographe' || vendor.type === 'Traiteur' || vendor.type === 'Fleuriste' ? '' : 'e'} ${vendor.type.toLowerCase()} à ${vendor.lieu}`;
    
    // Add personalized touch based on vendor type
    switch(vendor.type) {
      case 'Photographe':
        reason += " au style ";
        break;
      case 'Lieu':
        reason += " au cadre ";
        break;
      case 'Traiteur':
        reason += " proposant une cuisine ";
        break;
      case 'Fleuriste':
        reason += " créant des arrangements ";
        break;
      case 'DJ':
        reason += " avec un style ";
        break;
      default:
        reason += " offrant des services ";
    }
    
    if (vendor.style && vendor.style.length > 0) {
      reason += `${vendor.style.join(' et ')}. `;
    } else {
      reason += "de qualité. ";
    }
    
    if (vendor.type === 'Traiteur') {
      reason += `Tarif: ${vendor.budget}€/personne.`;
    } else {
      reason += `Tarif: ${vendor.budget}€.`;
    }
    
    return {
      vendor,
      reason
    };
  });
  
  return {
    message: responseMessage,
    recommendations,
    shouldRedirect
  };
}

function capitalizeFirstLetter(string: string): string {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}
