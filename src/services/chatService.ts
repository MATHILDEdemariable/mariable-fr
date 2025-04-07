
import { ChatResponse, Message, Vendor, VendorRecommendation } from '@/types';
import vendorsData from '@/data/vendors.json';

// Cette fonction simule l'envoi d'un message à un service de chat
export const sendMessage = async (messages: Message[]): Promise<ChatResponse> => {
  // Récupérer le dernier message utilisateur
  const latestUserMessage = messages.filter(m => m.role === 'user').pop();
  
  if (!latestUserMessage) {
    return { message: "Je n'ai pas compris votre demande. Pourriez-vous reformuler s'il vous plaît?" };
  }
  
  // Analyser le message pour déterminer les besoins de l'utilisateur
  const userQuery = latestUserMessage.content.toLowerCase();
  
  // Extraire les informations potentielles du message utilisateur
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
  
  // Identifier le lieu potentiel
  let location: string | null = null;
  for (const loc of locationKeywords) {
    if (userQuery.includes(loc)) {
      location = loc;
      break;
    }
  }
  
  // Identifier le type de prestataire
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
  
  // Identifier le style potentiel
  let style: string | null = null;
  for (const s of styleKeywords) {
    if (userQuery.includes(s)) {
      style = s;
      break;
    }
  }
  
  // Identifier le budget potentiel
  let budget: number | null = null;
  if (budgetKeywords && budgetKeywords[1]) {
    budget = parseInt(budgetKeywords[1], 10);
  }
  
  // Charger les prestataires depuis le JSON
  const vendors = vendorsData as Vendor[];
  
  // Filtrer les prestataires selon les critères identifiés
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
  
  // Si aucun filtre spécifique n'a fonctionné, essayer d'inférer ce qu'ils recherchent
  if (filteredVendors.length === 0) {
    // Si un lieu est mentionné, montrer tous les prestataires de ce lieu
    if (location) {
      filteredVendors = vendors.filter(vendor => 
        vendor.lieu.toLowerCase().includes(location!)
      );
    }
    // Si un type est mentionné, montrer tous les prestataires de ce type
    else if (vendorType) {
      filteredVendors = vendors.filter(vendor => 
        vendor.type.toLowerCase() === vendorType!.toLowerCase()
      );
    }
    // Par défaut, montrer un mélange de prestataires si aucun autre critère n'a été identifié
    else {
      // Obtenir 3 prestataires aléatoires de types différents
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
  
  // Limiter à 3 recommandations maximum
  filteredVendors = filteredVendors.slice(0, 3);
  
  // Générer une réponse basée sur le message et les prestataires filtrés
  let responseMessage = "";
  
  if (filteredVendors.length > 0) {
    responseMessage = "Au vu de votre demande, voici une sélection de prestataires qui pourraient vous intéresser :";
  } else {
    responseMessage = "Je n'ai pas trouvé de prestataires correspondant exactement à vos critères. Pourriez-vous me donner plus de détails sur ce que vous recherchez ? Par exemple, le type de prestataire (photographe, lieu, traiteur), la région, votre budget ou le style que vous préférez.";
    
    // Ajouter quelques suggestions aléatoires
    filteredVendors = vendors.sort(() => 0.5 - Math.random()).slice(0, 3);
    responseMessage += "\n\nEn attendant, voici quelques prestataires qui pourraient vous inspirer :";
  }
  
  // Créer les recommandations avec des raisons
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
};
