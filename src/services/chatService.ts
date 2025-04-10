import { VendorRecommendation, Message as MessageType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const getInitialOptions = () => {
  return [
    { text: "Je cherche un prestataire", value: "prestataire", icon: React.createElement(Briefcase, { className: "h-4 w-4" }) },
    { text: "J'ai besoin d'aide pour la planification", value: "planification", icon: React.createElement(Calendar, { className: "h-4 w-4" }) },
    { text: "J'ai une question sur le budget", value: "budget", icon: React.createElement(Building, { className: "h-4 w-4" }) },
    { text: "J'ai besoin d'aide ou de conseils", value: "conseil", icon: React.createElement(HelpCircle, { className: "h-4 w-4" }) }
  ];
};

export const getLocationOptions = () => {
  return [
    { text: "Paris", value: "paris", icon: React.createElement(MapPin, { className: "h-4 w-4" }) },
    { text: "Lyon", value: "lyon", icon: React.createElement(MapPin, { className: "h-4 w-4" }) },
    { text: "Marseille", value: "marseille", icon: React.createElement(MapPin, { className: "h-4 w-4" }) },
    { text: "Toulouse", value: "toulouse", icon: React.createElement(MapPin, { className: "h-4 w-4" }) },
    { text: "Nice", value: "nice", icon: React.createElement(MapPin, { className: "h-4 w-4" }) }
  ];
};

export const sendMessage = async (messages: MessageType[]): Promise<{
  message: string;
  recommendations?: VendorRecommendation[];
  noRecommendationsFound?: boolean;
}> => {
  // Simuler un délai de réponse
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let lastUserMessage = '';
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      lastUserMessage = messages[i].content;
      break;
    }
  }
  
  // Si c'est le premier message de l'utilisateur, donner directement des recommandations ou options
  if (messages.filter(m => m.role === 'user').length === 1) {
    return {
      message: "Bonjour et félicitations pour votre mariage ! Je suis Mathilde de Mariable, votre wedding planner digital ✨ Dites-moi tout, je vais vous aider à trouver les meilleurs prestataires selon vos envies.",
    };
  }
  
  // Simuler une réponse du service de chat
  if (lastUserMessage.toLowerCase().includes("photographe")) {
    return {
      message: "Super ! Je connais d'excellents photographes. Voici quelques recommandations :",
      recommendations: [
        {
          id: uuidv4(),
          name: "Studio Photo Mariage",
          description: "Photographe spécialisé dans les mariages de luxe.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          id: uuidv4(),
          name: "Instants Précieux",
          description: "Capture les moments uniques de votre mariage avec créativité.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          id: uuidv4(),
          name: "Éclats de Rire",
          description: "Des photos naturelles et spontanées pour un souvenir inoubliable.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        }
      ]
    };
  } else if (lastUserMessage.toLowerCase().includes("traiteur")) {
    return {
      message: "Parfait, voici quelques traiteurs que je recommande :",
      recommendations: [
        {
          id: uuidv4(),
          name: "Saveurs Exquises",
          description: "Traiteur gastronomique pour mariages élégants.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          id: uuidv4(),
          name: "Festin Royal",
          description: "Des menus personnalisés pour un mariage inoubliable.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          id: uuidv4(),
          name: "Délice & Création",
          description: "Cuisine créative et raffinée pour votre mariage.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        }
      ]
    };
  } else if (lastUserMessage.toLowerCase().includes("dj")) {
    return {
      message: "Voici quelques DJ populaires :",
      recommendations: [
        {
          id: uuidv4(),
          name: "DJ MagicMix",
          description: "Ambiance garantie pour votre soirée de mariage.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          id: uuidv4(),
          name: "Sonorisation Événement",
          description: "Des professionnels de la musique pour votre mariage.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          id: uuidv4(),
          name: "Rythme & Harmonie",
          description: "DJ expérimenté pour une soirée de mariage réussie.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        }
      ]
    };
  } else {
    return {
      message: "Je comprends. Pourrais-tu me donner plus de détails sur ce que tu recherches ?",
    };
  }
};

export const handleOptionSelected = async (
  selectedOption: string,
  currentStep: number,
  context: any
): Promise<{
  response: {
    message: string;
    recommendations?: VendorRecommendation[];
  };
  updatedContext: any;
  nextStep: number;
  noRecommendationsFound?: boolean;
}> => {
  // Simuler un délai de réponse
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let updatedContext = { ...context };
  let nextStep = currentStep + 1;
  let noRecommendationsFound = false;
  
  // Si on est à l'étape 1 (sélection du type de besoin)
  if (currentStep === 1) {
    updatedContext.needType = selectedOption;
    
    // Si c'est une recherche de prestataire
    if (selectedOption === "prestataire") {
      return {
        response: {
          message: "Dans quelle ville ou région se déroulera votre mariage ?",
        },
        updatedContext,
        nextStep
      };
    } 
    // Si c'est une question sur la planification
    else if (selectedOption === "planification") {
      return {
        response: {
          message: "Je peux vous aider à planifier votre mariage. Avez-vous déjà une date en tête ?",
        },
        updatedContext,
        nextStep
      };
    }
    // Si c'est une question sur le budget
    else if (selectedOption === "budget") {
      return {
        response: {
          message: "Je peux vous aider à gérer votre budget de mariage. Avez-vous déjà un budget global en tête ?",
        },
        updatedContext,
        nextStep
      };
    }
    // Si c'est une demande d'orientation ou de conseil
    else if (selectedOption === "orientation" || selectedOption === "conseil") {
      return {
        response: {
          message: "Vous souhaitez des conseils généraux pour votre mariage. Voici quelques ressources qui pourraient vous aider :",
        },
        updatedContext,
        nextStep
      };
    }
  }
  // Si on est à l'étape 2 (sélection de la localisation)
  else if (currentStep === 2) {
    updatedContext.location = selectedOption;
    
    // Simuler une recherche de prestataires
    if (selectedOption === "paris") {
      return {
        response: {
          message: "Voici quelques photographes à Paris :",
          recommendations: [
            {
              id: uuidv4(),
              name: "Studio Photo Paris",
              description: "Photographe spécialisé dans les mariages à Paris.",
              imageUrl: "/placeholder-image.jpg",
              link: "https://www.google.com"
            },
            {
              id: uuidv4(),
              name: "Instants Parisiens",
              description: "Capture les moments uniques de votre mariage à Paris avec créativité.",
              imageUrl: "/placeholder-image.jpg",
              link: "https://www.google.com"
            },
            {
              id: uuidv4(),
              name: "Éclats de Rire Paris",
              description: "Des photos naturelles et spontanées pour un souvenir inoubliable à Paris.",
              imageUrl: "/placeholder-image.jpg",
              link: "https://www.google.com"
            }
          ]
        },
        updatedContext,
        nextStep
      };
    } else {
      noRecommendationsFound = true;
      return {
        response: {
          message: "Je n'ai pas trouvé de prestataires dans cette région.",
        },
        updatedContext,
        nextStep,
        noRecommendationsFound
      };
    }
  }
  
  return {
    response: {
      message: "Je ne sais pas quoi répondre.",
    },
    updatedContext,
    nextStep
  };
};
