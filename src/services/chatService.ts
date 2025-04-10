
import React from 'react';
import { VendorRecommendation, Message as MessageType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { Briefcase, Calendar, Building, HelpCircle, Home, Users, ExternalLink, BookOpen, MapPin } from 'lucide-react';

export const getInitialOptions = () => {
  return [
    { text: "Je cherche un lieu", value: "lieu", icon: React.createElement(Home, { className: "h-4 w-4" }) },
    { text: "Je cherche un prestataire", value: "prestataire", icon: React.createElement(Briefcase, { className: "h-4 w-4" }) },
    { text: "Je ne sais pas par où commencer", value: "aide", icon: React.createElement(HelpCircle, { className: "h-4 w-4" }) }
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
  actionButtons?: { text: string; action: string; link?: string; newTab?: boolean }[];
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
      message: "Bonjour et félicitations pour votre mariage! Je suis Mathilde de Mariable, votre wedding planner digital. Dites-moi tout, je vais vous aider à trouver les meilleurs prestataires selon vos envies.",
    };
  }
  
  // Si l'utilisateur demande de l'aide ou des conseils
  if (lastUserMessage.toLowerCase().includes("aide") || lastUserMessage.toLowerCase().includes("conseil")) {
    return {
      message: "Comment puis-je vous aider aujourd'hui?",
      actionButtons: [
        {
          text: "Aide à la planification",
          action: "link",
          link: "/services/planification"
        },
        {
          text: "Conseils personnalisés",
          action: "link",
          link: "/services/conseils"
        }
      ]
    };
  }
  
  // Simuler une réponse du service de chat
  if (lastUserMessage.toLowerCase().includes("photographe")) {
    return {
      message: "Super! Je connais d'excellents photographes. Voici quelques recommandations:",
      recommendations: [
        {
          name: "Studio Photo Mariage",
          description: "Photographe spécialisé dans les mariages de luxe.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          name: "Instants Précieux",
          description: "Capture les moments uniques de votre mariage avec créativité.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          name: "Éclats de Rire",
          description: "Des photos naturelles et spontanées pour un souvenir inoubliable.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        }
      ]
    };
  } else if (lastUserMessage.toLowerCase().includes("traiteur")) {
    return {
      message: "Parfait, voici quelques traiteurs que je recommande:",
      recommendations: [
        {
          name: "Saveurs Exquises",
          description: "Traiteur gastronomique pour mariages élégants.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          name: "Festin Royal",
          description: "Des menus personnalisés pour un mariage inoubliable.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          name: "Délice & Création",
          description: "Cuisine créative et raffinée pour votre mariage.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        }
      ]
    };
  } else if (lastUserMessage.toLowerCase().includes("dj")) {
    return {
      message: "Voici quelques DJ populaires:",
      recommendations: [
        {
          name: "DJ MagicMix",
          description: "Ambiance garantie pour votre soirée de mariage.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          name: "Sonorisation Événement",
          description: "Des professionnels de la musique pour votre mariage.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          name: "Rythme & Harmonie",
          description: "DJ expérimenté pour une soirée de mariage réussie.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        }
      ]
    };
  } else if (lastUserMessage.toLowerCase().includes("lieu") || lastUserMessage.toLowerCase().includes("salle")) {
    return {
      message: "Voici quelques lieux de réception que je recommande:",
      recommendations: [
        {
          name: "Château Élégance",
          description: "Un cadre historique et raffiné pour votre mariage.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          name: "Domaine des Roses",
          description: "Un lieu champêtre entouré de nature pour une ambiance bucolique.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        },
        {
          name: "Espace Contemporain",
          description: "Lieu moderne et modulable pour un mariage tendance.",
          imageUrl: "/placeholder-image.jpg",
          link: "https://www.google.com"
        }
      ]
    };
  } else {
    return {
      message: "Je comprends. Pourrais-tu me donner plus de détails sur ce que tu recherches?",
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
    actionButtons?: { text: string; action: string; link?: string; newTab?: boolean }[];
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
    
    // Si c'est une recherche de lieu ou de prestataire
    if (selectedOption === "lieu" || selectedOption === "prestataire") {
      return {
        response: {
          message: "Dans quelle ville ou région se déroulera votre mariage?",
        },
        updatedContext,
        nextStep
      };
    } 
    // Si l'utilisateur ne sait pas par où commencer
    else if (selectedOption === "aide") {
      return {
        response: {
          message: "Je vous invite à consulter les ressources dans la page 'nos services' pour démarrer l'organisation de votre mariage ou nous contacter spécifiquement si besoin",
          actionButtons: [
            { 
              text: "Aide à la planification", 
              action: "link", 
              link: "/services/planification"
            },
            { 
              text: "Conseils personnalisés", 
              action: "link", 
              link: "/services/conseils"
            },
            { 
              text: "Accéder au Guide Mariable", 
              action: "link", 
              link: "https://leguidemariable.softr.app/",
              newTab: true
            }
          ]
        },
        updatedContext,
        nextStep: 3 // Passer directement à l'étape des boutons d'aide
      };
    }
  }
  
  // Si on est à l'étape 2 (sélection de la localisation)
  else if (currentStep === 2) {
    updatedContext.location = selectedOption;
    
    // Simuler une recherche de prestataires
    if (selectedOption === "paris") {
      const responseMessage = updatedContext.needType === "lieu" 
        ? "Voici quelques lieux à Paris:" 
        : "Voici quelques prestataires à Paris:";
      
      const recommendations = updatedContext.needType === "lieu" 
        ? [
            {
              name: "Château Paris",
              description: "Un lieu élégant et historique pour votre mariage à Paris.",
              imageUrl: "/placeholder-image.jpg",
              link: "https://www.google.com"
            },
            {
              name: "Domaine Parisien",
              description: "Un cadre exceptionnel au cœur de Paris.",
              imageUrl: "/placeholder-image.jpg",
              link: "https://www.google.com"
            },
            {
              name: "Espace City",
              description: "Un lieu moderne et urbain pour un mariage tendance à Paris.",
              imageUrl: "/placeholder-image.jpg",
              link: "https://www.google.com"
            }
          ]
        : [
            {
              name: "Studio Photo Paris",
              description: "Photographe spécialisé dans les mariages à Paris.",
              imageUrl: "/placeholder-image.jpg",
              link: "https://www.google.com"
            },
            {
              name: "Instants Parisiens",
              description: "Capture les moments uniques de votre mariage à Paris avec créativité.",
              imageUrl: "/placeholder-image.jpg",
              link: "https://www.google.com"
            },
            {
              name: "Éclats de Rire Paris",
              description: "Des photos naturelles et spontanées pour un souvenir inoubliable à Paris.",
              imageUrl: "/placeholder-image.jpg",
              link: "https://www.google.com"
            }
          ];
          
      return {
        response: {
          message: responseMessage,
          recommendations
        },
        updatedContext,
        nextStep
      };
    } else {
      noRecommendationsFound = true;
      return {
        response: {
          message: "Le plus simple serait de consulter le guide ou nous contacter directement. Partagez nous votre brief complet pour que l'on puisse vous aider (c'est gratuit & rapide)",
          actionButtons: [
            { 
              text: "Nous contacter directement", 
              action: "link", 
              link: "/contact/nous-contacter"
            },
            { 
              text: "Consulter le guide Mariable", 
              action: "link", 
              link: "https://leguidemariable.softr.app/",
              newTab: true
            }
          ]
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
