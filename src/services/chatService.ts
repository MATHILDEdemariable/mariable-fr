
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
    'photographe': ['photo', 'photographe', 'reportage', 'album', 'images', 'photos', 'shooting', 'cameraman', 'vidéaste', 'vidéo'],
    'lieu': ['lieu', 'salle', 'domaine', 'château', 'domaine', 'propriété', 'endroit', 'ferme', 'grange', 'manoir', 'villa', 'reception'],
    'traiteur': ['traiteur', 'nourriture', 'repas', 'cuisine', 'menu', 'gastronomie', 'chef', 'restauration', 'cocktail', 'buffet', 'dîner', 'diner'],
    'fleuriste': ['fleur', 'fleuriste', 'décoration florale', 'bouquet', 'centre de table', 'arrangements', 'couronne', 'arche florale'],
    'dj': ['dj', 'musique', 'animation', 'soirée', 'son', 'playlist', 'ambiance', 'disco', 'fête', 'danse'],
    'wedding planner': ['wedding planner', 'organisateur', 'organisatrice', 'planificateur', 'planificatrice', 'organisation', 'coordination', 'evenementiel']
  };
  
  const locations = {
    'paris': ['paris', 'île-de-france', 'ile de france', 'idf', 'parisien', 'parisienne', 'versailles', 'saint-germain'],
    'bordeaux': ['bordeaux', 'gironde', 'aquitaine', 'bordelais', 'nouvelle-aquitaine'],
    'lyon': ['lyon', 'rhône', 'rhone', 'lyonnais', 'auvergne-rhône-alpes'],
    'nice': ['nice', 'côte d\'azur', 'cote d\'azur', 'alpes-maritimes', 'cannes', 'monaco', 'antibes'],
    'marseille': ['marseille', 'bouches-du-rhône', 'bouches du rhone', 'paca', 'provence', 'aix-en-provence', 'aix en provence'],
    'lille': ['lille', 'nord', 'hauts-de-france', 'hauts de france', 'lillois'],
    'annecy': ['annecy', 'haute-savoie', 'haute savoie', 'savoie', 'alpes', 'lac d\'annecy'],
    'aix': ['aix', 'aix-en-provence', 'aix en provence', 'provence'],
    'reims': ['reims', 'champagne', 'marne', 'champagne-ardenne', 'grand est'],
    'strasbourg': ['strasbourg', 'alsace', 'bas-rhin', 'bas rhin', 'grand est'],
    'nantes': ['nantes', 'loire-atlantique', 'loire atlantique', 'pays de la loire', 'atlantique'],
    'toulouse': ['toulouse', 'haute-garonne', 'haute garonne', 'occitanie', 'midi-pyrénées'],
    'montpellier': ['montpellier', 'hérault', 'herault', 'occitanie', 'languedoc'],
    'normandie': ['normandie', 'caen', 'rouen', 'calvados', 'manche', 'orne', 'deauville', 'honfleur'],
    'bretagne': ['bretagne', 'rennes', 'brest', 'quimper', 'saint-malo', 'saint malo', 'finistère', 'morbihan']
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

  // Check for retroplanning or planning words
  const hasPlanningKeywords = userQuery.includes('planning') || 
                              userQuery.includes('retroplanning') || 
                              userQuery.includes('organisation') || 
                              userQuery.includes('organiser') ||
                              userQuery.includes('dates') ||
                              userQuery.includes('calendrier') ||
                              userQuery.includes('étapes') ||
                              userQuery.includes('préparation');

  // If user is asking about planning or retroplanning
  if (hasPlanningKeywords) {
    return {
      message: "Je serais ravie de vous aider avec votre retroplanning de mariage ! Avoir un calendrier bien organisé est essentiel pour préparer sereinement votre grand jour. Nous proposons un service de retroplanning personnalisé qui s'adapte à vos dates et besoins spécifiques. Souhaitez-vous en savoir plus sur ce service ?\n\nVous pouvez consulter notre page dédiée à la planification pour obtenir plus d'informations : [Retroplanning personnalisé](/services/planification)"
    };
  }

  // Both vendor type and location are found, provide recommendations
  if (foundVendorType && foundLocation) {
    const recommendations = getRecommendations(foundVendorType, foundLocation);
    // Add a follow-up question about other suggestions or help with planning
    recommendations.message += "\n\nSouhaitez-vous d'autres suggestions de prestataires ou bien de l'aide pour organiser votre retroplanning de mariage ? Je peux vous orienter vers notre service de retroplanning personnalisé.";
    return recommendations;
  }
  
  // If we're missing vendor type, location, or both, ask for the missing information
  if (!foundVendorType && !foundLocation) {
    return {
      message: "Pour vous proposer des prestataires adaptés à vos besoins, j'ai besoin de deux informations essentielles :\n\n1. Quel type de prestataire recherchez-vous ? (lieu, traiteur, photographe, DJ, fleuriste, wedding planner...)\n\n2. Dans quelle ville ou région se déroulera votre mariage ?\n\nPouvez-vous me préciser ces deux éléments, s'il vous plaît ?"
    };
  } else if (!foundVendorType) {
    return {
      message: `Merci pour cette information sur ${capitalizeFirstLetter(foundLocation!)}. Pour vous proposer des prestataires adaptés, pourriez-vous me préciser quel type de prestataire vous recherchez ? (lieu, traiteur, photographe, DJ, fleuriste, wedding planner...)`
    };
  } else if (!foundLocation) {
    return {
      message: `Je vois que vous cherchez un${foundVendorType === 'photographe' || foundVendorType === 'traiteur' || foundVendorType === 'fleuriste' ? ' ' : 'e '}${foundVendorType}. Pour vous proposer les meilleures options, dans quelle ville ou région se déroulera votre mariage ?`
    };
  }
  
  // If the message contains keywords related to more information
  if (userQuery.includes('plus') || userQuery.includes('détail') || 
      userQuery.includes('information') || userQuery.includes('contact') ||
      userQuery.includes('complet') || userQuery.includes('guide')) {
    return {
      message: "Pour accéder à notre sélection complète, vous pouvez consulter le Guide Mariable. Souhaitez-vous continuer la conversation ou avez-vous d'autres questions sur nos prestataires ? Peut-être avez-vous besoin d'aide pour organiser votre retroplanning de mariage ?"
    };
  }
  
  // Default response when no specific keywords are detected
  return {
    message: "Pour vous proposer des recommandations personnalisées, j'ai besoin de savoir quel type de prestataire vous intéresse (lieu, photographe, traiteur, DJ, fleuriste, wedding planner...) et dans quelle région se déroulera votre mariage. Pourriez-vous me préciser ces informations ?"
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
      recommendations
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
      vendor.type.toLowerCase() === capitalizeFirstLetter(vendorType).toLowerCase() ||
      (vendorType === 'photographe' && vendor.type.toLowerCase() === 'photographe') ||
      (vendorType === 'dj' && vendor.type.toLowerCase() === 'dj')
    );
  }
  
  // If no results, widen the filter to just type
  if (filteredVendors.length === 0) {
    filteredVendors = vendors.filter(vendor => 
      vendor.type.toLowerCase() === capitalizeFirstLetter(vendorType).toLowerCase() ||
      (vendorType === 'photographe' && vendor.type.toLowerCase() === 'photographe') ||
      (vendorType === 'dj' && vendor.type.toLowerCase() === 'dj')
    );
    
    // Take up to 2 random vendors if we have more than 2
    if (filteredVendors.length > 2) {
      filteredVendors = filteredVendors.sort(() => 0.5 - Math.random()).slice(0, 2);
    }
  } else {
    // Limit to 2 recommendations for a cleaner interface
    if (filteredVendors.length > 2) {
      filteredVendors = filteredVendors.sort(() => 0.5 - Math.random()).slice(0, 2);
    }
  }
  
  let responseMessage = "";
  
  if (filteredVendors.length > 0) {
    const formattedVendorType = vendorType === 'wedding planner' ? 'wedding planners' : 
                                (vendorType === 'lieu' ? 'lieux' : `${vendorType}s`);
    
    responseMessage = `Parfait ! Voici mes recommandations de ${formattedVendorType} à ${capitalizeFirstLetter(location)} :`;
  } else {
    responseMessage = `Je n'ai pas de ${vendorType} à ${capitalizeFirstLetter(location)} dans ma base de données. Pourriez-vous essayer un autre lieu comme Paris, Lyon ou Bordeaux où nous avons une plus grande sélection ?`;
  }
  
  // Create recommendations with personalized reasons
  const recommendations: VendorRecommendation[] = filteredVendors.map(vendor => {
    let reason = generatePersonalizedReason(vendor, vendorType, location);
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

// Helper function to generate more personalized recommendation reasons
function generatePersonalizedReason(vendor: Vendor, vendorType: string, location: string): string {
  let reason = `${vendor.nom} est un${vendor.type === 'Photographe' || vendor.type === 'Traiteur' || vendor.type === 'Fleuriste' ? '' : 'e'} ${vendor.type.toLowerCase()} `;
  
  // Add location context
  switch(location) {
    case 'paris':
      reason += `au cœur de Paris`;
      break;
    case 'bordeaux':
      reason += `dans la région bordelaise`;
      break;
    case 'lyon':
      reason += `dans la région lyonnaise`;
      break;
    case 'nice':
      reason += `sur la Côte d'Azur`;
      break;
    case 'marseille':
      reason += `en Provence`;
      break;
    case 'annecy':
      reason += `près du lac d'Annecy`;
      break;
    default:
      reason += `à ${vendor.lieu}`;
  }
  
  // Add personalized touch based on vendor type
  switch(vendor.type) {
    case 'Photographe':
      reason += `, spécialisé dans le style `;
      break;
    case 'Lieu':
      reason += `, avec un cadre `;
      break;
    case 'Traiteur':
      reason += `, proposant une cuisine `;
      break;
    case 'Fleuriste':
      reason += `, créant des arrangements `;
      break;
    case 'DJ':
      reason += `, avec une ambiance `;
      break;
    default:
      reason += ` offrant des services `;
  }
  
  if (vendor.style && vendor.style.length > 0) {
    reason += `${vendor.style.join(' et ')}. `;
  } else {
    reason += "de qualité. ";
  }
  
  // Add price information
  if (vendor.type === 'Traiteur') {
    reason += `Tarif: à partir de ${vendor.budget}€/personne.`;
  } else if (vendor.type === 'Lieu') {
    reason += `Location à partir de ${vendor.budget}€ pour votre réception.`;
  } else if (vendor.type === 'Photographe') {
    reason += `Forfait mariage complet à partir de ${vendor.budget}€.`;
  } else {
    reason += `Budget: à partir de ${vendor.budget}€.`;
  }
  
  return reason;
}

function capitalizeFirstLetter(string: string): string {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}
