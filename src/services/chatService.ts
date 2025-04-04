
import { ChatResponse, Message, Vendor } from '@/types';
import vendorsData from '@/data/vendors.json';

// This would normally call the backend API, but for now we'll simulate it
export const sendMessage = async (messages: Message[]): Promise<ChatResponse> => {
  // In a real app, this would be an API call to your Express backend
  // For now, we'll simulate the AI response locally
  
  // Get the latest user message
  const latestUserMessage = messages.filter(m => m.role === 'user').pop();
  
  if (!latestUserMessage) {
    return { message: "Je n'ai pas compris votre demande. Pourriez-vous reformuler s'il vous plaît?" };
  }
  
  // Process the user message and find relevant vendors
  const userQuery = latestUserMessage.content.toLowerCase();
  
  // Extract potential information from the user query
  const locationMatches = userQuery.match(/en ([a-zÀ-ÿ]+)/i);
  const locationKeywords = [
    'bourgogne', 'normandie', 'provence', 'alsace', 'bretagne', 
    'paris', 'lyon', 'île-de-france'
  ];
  
  const budgetMatches = userQuery.match(/budget(?:\s+de)?\s+(\d+)(?:\s*[€k])/i);
  
  const typeKeywords: Record<string, string[]> = {
    'lieu': ['lieu', 'salle', 'domaine', 'château', 'endroit', 'emplacement'],
    'fleuriste': ['fleur', 'fleuriste', 'bouquet', 'décoration florale'],
    'traiteur': ['traiteur', 'repas', 'nourriture', 'cuisine', 'menu', 'chef'],
    'photographe': ['photo', 'photographe', 'reportage', 'album'],
    'pâtissier': ['gâteau', 'pâtissier', 'dessert', 'wedding cake', 'pièce montée']
  };
  
  const styleKeywords = [
    'champêtre', 'nature', 'élégant', 'luxe', 'viticole', 'rustique', 
    'historique', 'romantique', 'moderne', 'minimaliste', 'gastronomique', 
    'traditionnel', 'buffet', 'convivial', 'local', 'terroir', 'reportage', 
    'naturel', 'artistique', 'poétique', 'design', 'gourmand'
  ];
  
  // Gather filter criteria
  let location: string | null = null;
  if (locationMatches && locationMatches[1]) {
    location = locationMatches[1].toLowerCase();
  } else {
    // Look for location keywords
    for (const loc of locationKeywords) {
      if (userQuery.includes(loc.toLowerCase())) {
        location = loc.toLowerCase();
        break;
      }
    }
  }
  
  let budget: number | null = null;
  if (budgetMatches && budgetMatches[1]) {
    budget = parseInt(budgetMatches[1], 10);
  }
  
  let vendorType: string | null = null;
  for (const [type, keywords] of Object.entries(typeKeywords)) {
    for (const keyword of keywords) {
      if (userQuery.includes(keyword.toLowerCase())) {
        vendorType = type;
        break;
      }
    }
    if (vendorType) break;
  }
  
  let styles: string[] = [];
  for (const style of styleKeywords) {
    if (userQuery.includes(style.toLowerCase())) {
      styles.push(style);
    }
  }
  
  // Filter vendors based on extracted criteria
  let filteredVendors: Vendor[] = JSON.parse(JSON.stringify(vendorsData));
  
  if (location) {
    filteredVendors = filteredVendors.filter(vendor => 
      vendor.lieu.toLowerCase() === location
    );
  }
  
  if (budget) {
    filteredVendors = filteredVendors.filter(vendor => 
      vendor.budget <= budget
    );
  }
  
  if (vendorType) {
    filteredVendors = filteredVendors.filter(vendor => 
      vendor.type.toLowerCase() === vendorType.toLowerCase()
    );
  }
  
  if (styles.length > 0) {
    filteredVendors = filteredVendors.filter(vendor => 
      vendor.style.some(s => styles.includes(s))
    );
  }
  
  // If no specific filters matched, try to infer what they're looking for
  if (filteredVendors.length === 0) {
    // If they mentioned a location, show all vendors in that location
    if (location) {
      filteredVendors = (vendorsData as Vendor[]).filter(vendor => 
        vendor.lieu.toLowerCase() === location
      );
    }
    // If they mentioned a type, show all vendors of that type
    else if (vendorType) {
      filteredVendors = (vendorsData as Vendor[]).filter(vendor => 
        vendor.type.toLowerCase() === vendorType.toLowerCase()
      );
    }
    // Default to showing venues if no other criteria matched
    else if (userQuery.includes('mariage') || userQuery.includes('marié')) {
      filteredVendors = (vendorsData as Vendor[]).filter(vendor => 
        vendor.type === 'Lieu'
      );
    }
  }
  
  // Limit to 3 recommendations
  filteredVendors = filteredVendors.slice(0, 3);
  
  // Generate recommendations with reasons
  const recommendations = filteredVendors.map(vendor => {
    let reason = `Ce ${vendor.type.toLowerCase()} en ${vendor.lieu}`;
    
    if (vendor.style && vendor.style.length > 0) {
      reason += ` offre un style ${vendor.style.join(' et ')}`;
    }
    
    if (vendor.type === 'Lieu') {
      reason += ` pour un budget de ${vendor.budget}€`;
    } else if (vendor.type === 'Traiteur') {
      reason += ` à partir de ${vendor.budget}€ par personne`;
    } else {
      reason += ` à partir de ${vendor.budget}€`;
    }
    
    return {
      vendor,
      reason
    };
  });
  
  // Generate AI response
  let aiMessage = '';
  
  if (recommendations.length === 0) {
    aiMessage = "Je n'ai pas trouvé de prestataires correspondant exactement à vos critères. Pourriez-vous me donner plus de détails sur ce que vous recherchez ? Par exemple, quel type de prestataire (lieu, traiteur, photographe...), dans quelle région, et avec quel budget ?";
  } else {
    aiMessage = `D'après votre demande, voici ${recommendations.length > 1 ? 'quelques suggestions' : 'une suggestion'} qui pourrait${recommendations.length > 1 ? 'ent' : ''} vous intéresser :`;
  }
  
  // Simulate API response delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    message: aiMessage,
    recommendations: recommendations.length > 0 ? recommendations : undefined
  };
};
