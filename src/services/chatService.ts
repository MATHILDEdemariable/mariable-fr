
import { ChatResponse, Message, Vendor, VendorRecommendation } from '@/types';
import vendorsData from '@/data/vendors.json';
import { Building, Briefcase, HelpCircle, Calendar, MapPin } from 'lucide-react';
import React from 'react';

// Options pour chaque étape de la conversation
export const getInitialOptions = () => [
  { 
    text: "J'ai besoin d'un wedding planner", 
    value: "wedding-planner",
    icon: React.createElement(Briefcase, { className: "h-4 w-4" })
  },
  { 
    text: "Je cherche un lieu de réception", 
    value: "lieu",
    icon: React.createElement(Building, { className: "h-4 w-4" })
  },
  { 
    text: "Je cherche un prestataire", 
    value: "prestataire",
    icon: React.createElement(Calendar, { className: "h-4 w-4" })
  },
  { 
    text: "Je ne sais pas par où commencer", 
    value: "orientation",
    icon: React.createElement(HelpCircle, { className: "h-4 w-4" })
  }
];

export const getLocationOptions = () => [
  { text: "Paris", value: "paris", icon: React.createElement(MapPin, { className: "h-4 w-4" }) },
  { text: "Lyon", value: "lyon", icon: React.createElement(MapPin, { className: "h-4 w-4" }) },
  { text: "Marseille", value: "marseille", icon: React.createElement(MapPin, { className: "h-4 w-4" }) },
  { text: "Bordeaux", value: "bordeaux", icon: React.createElement(MapPin, { className: "h-4 w-4" }) },
  { text: "Nice", value: "nice", icon: React.createElement(MapPin, { className: "h-4 w-4" }) },
  { text: "Toulouse", value: "toulouse", icon: React.createElement(MapPin, { className: "h-4 w-4" }) },
  { text: "Lille", value: "lille", icon: React.createElement(MapPin, { className: "h-4 w-4" }) },
  { text: "Strasbourg", value: "strasbourg", icon: React.createElement(MapPin, { className: "h-4 w-4" }) },
  { text: "Je ne sais pas encore", value: "unknown", icon: React.createElement(HelpCircle, { className: "h-4 w-4" }) }
];

export const getVendorTypeOptions = () => [
  { text: "Wedding planner", value: "wedding planner" },
  { text: "Lieu de réception", value: "lieu" },
  { text: "Traiteur", value: "traiteur" },
  { text: "Photographe", value: "photographe" },
  { text: "DJ", value: "dj" },
  { text: "Fleuriste", value: "fleuriste" }
];

// Traiter la sélection d'option et renvoyer une réponse appropriée
export const handleOptionSelected = async (
  optionValue: string,
  currentStep: number,
  conversationContext: {needType?: string; location?: string; vendorType?: string}
) => {
  let response: ChatResponse = { message: "" };
  let updatedContext = { ...conversationContext };
  let nextStep = currentStep + 1;

  // Étape 1: Traitement du besoin initial
  if (currentStep === 1) {
    updatedContext.needType = optionValue;
    
    if (optionValue === "orientation") {
      response = {
        message: "Pour bien commencer l'organisation de votre mariage, je vous recommande notre service de rétroplanning personnalisé. Je vais vous rediriger vers notre page dédiée où vous trouverez un guide étape par étape."
      };
    } 
    else if (optionValue === "wedding-planner") {
      updatedContext.vendorType = "wedding planner";
      response = {
        message: "Excellent choix ! Un wedding planner pourra vous accompagner tout au long de votre organisation. Dans quelle ville ou région recherchez-vous ce service ?"
      };
    }
    else if (optionValue === "lieu") {
      updatedContext.vendorType = "lieu";
      response = {
        message: "Trouver le lieu parfait est une étape cruciale ! Dans quelle ville ou région souhaitez-vous organiser votre réception ?"
      };
    }
    else if (optionValue === "prestataire") {
      response = {
        message: "Je peux vous aider à trouver différents types de prestataires. Dans quelle ville ou région se déroulera votre mariage ?"
      };
    }
  }
  // Étape 2: Traitement de la localisation
  else if (currentStep === 2) {
    updatedContext.location = optionValue;

    if (optionValue === "unknown") {
      response = {
        message: "Ce n'est pas un problème si vous n'avez pas encore choisi votre lieu. Je vous conseille de consulter notre Guide Mariable qui regroupe des prestataires dans toute la France. Voulez-vous que je vous montre quelques-uns de nos prestataires les plus appréciés ?"
      };
    } 
    else if (updatedContext.vendorType) {
      // Si le type de prestataire est déjà défini, envoyer des recommandations
      const recommendationsData = getRecommendations(updatedContext.vendorType, optionValue);
      response = recommendationsData;
      nextStep = 3; // Passer à l'étape suivante
    } 
    else {
      response = {
        message: `Parfait ! Je vais vous aider à trouver des prestataires à ${capitalizeFirstLetter(optionValue)}. Voici quelques-uns de nos prestataires les mieux notés dans cette région.`
      };

      // Fournir une sélection de prestataires variés pour cette localisation
      const vendors = vendorsData as Vendor[];
      const locationVendors = vendors.filter(vendor => 
        vendor.lieu.toLowerCase() === optionValue.toLowerCase()
      );

      if (locationVendors.length > 0) {
        // Prendre un échantillon aléatoire de différents types de prestataires
        const uniqueTypes = [...new Set(locationVendors.map(v => v.type))];
        const recommendations: VendorRecommendation[] = [];

        for (const type of uniqueTypes.slice(0, 3)) {
          const vendorsOfType = locationVendors.filter(v => v.type === type);
          if (vendorsOfType.length > 0) {
            const randomVendor = vendorsOfType[Math.floor(Math.random() * vendorsOfType.length)];
            recommendations.push({
              vendor: randomVendor,
              reason: generatePersonalizedReason(randomVendor, randomVendor.type.toLowerCase(), optionValue)
            });
          }
        }

        if (recommendations.length > 0) {
          response.recommendations = recommendations;
        }
      }

      nextStep = 3; // Passer à l'étape suivante
    }
  }

  return { response, updatedContext, nextStep };
};

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

  // Si nous sommes au premier message de l'utilisateur, proposer les options initiales
  if (messages.length === 2) {  // Le premier message est le message de bienvenue, le deuxième est le message de l'utilisateur
    return {
      message: "Pour mieux vous aider, pourriez-vous me préciser ce que vous recherchez ? Vous pouvez sélectionner une option ci-dessous ou me décrire votre besoin."
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

// Helper function to get recommendations based on vendor type and location
function getRecommendations(vendorType: string, location: string): ChatResponse {
  // Load vendors from JSON
  const vendors = vendorsData as Vendor[];
  
  // Filter vendors according to identified criteria
  let filteredVendors = [...vendors];
  
  // Filter by location - exact match to ensure accuracy
  filteredVendors = filteredVendors.filter(vendor => 
    vendor.lieu.toLowerCase() === location.toLowerCase()
  );
  
  // Filter by vendor type - exact match to ensure accuracy
  filteredVendors = filteredVendors.filter(vendor => 
    vendor.type.toLowerCase() === capitalizeFirstLetter(vendorType).toLowerCase() ||
    (vendorType === 'photographe' && vendor.type.toLowerCase() === 'photographe') ||
    (vendorType === 'dj' && vendor.type.toLowerCase() === 'dj')
  );
  
  // If no results with exact location match, try a more flexible approach
  if (filteredVendors.length === 0) {
    filteredVendors = vendors.filter(vendor => 
      vendor.lieu.toLowerCase().includes(location.toLowerCase()) &&
      (
        vendor.type.toLowerCase() === capitalizeFirstLetter(vendorType).toLowerCase() ||
        (vendorType === 'photographe' && vendor.type.toLowerCase() === 'photographe') ||
        (vendorType === 'dj' && vendor.type.toLowerCase() === 'dj')
      )
    );
  }
  
  let responseMessage = "";
  
  if (filteredVendors.length > 0) {
    // Use appropriate plural forms based on the vendor type
    const formattedVendorType = vendorType === 'wedding planner' ? 'wedding planners' : 
                                (vendorType === 'lieu' ? 'lieux' : 
                                vendorType === 'traiteur' ? 'traiteurs' :
                                vendorType === 'photographe' ? 'photographes' :
                                vendorType === 'fleuriste' ? 'fleuristes' :
                                vendorType === 'dj' ? 'DJs' : `${vendorType}s`);
    
    // Make sure we use the same language in the response as in the request
    responseMessage = `Parfait ! Voici mes recommandations de ${formattedVendorType} à ${capitalizeFirstLetter(location)} :`;
  } else {
    responseMessage = `Je n'ai pas de ${vendorType} à ${capitalizeFirstLetter(location)} dans ma base de données. Pourriez-vous essayer un autre lieu comme Paris, Lyon ou Bordeaux où nous avons une plus grande sélection ?`;
  }
  
  // Create recommendations with personalized reasons that match the exact location and vendor type
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
  // Start with clear identification that matches the location and type
  let reason = `${vendor.nom} est un${vendor.type === 'Photographe' || vendor.type === 'Traiteur' || vendor.type === 'Fleuriste' ? '' : 'e'} ${vendor.type.toLowerCase()} `;
  
  // Add location context that exactly matches the queried location
  reason += `à ${capitalizeFirstLetter(location)}`;
  
  // Add personalized description based on vendor type
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
