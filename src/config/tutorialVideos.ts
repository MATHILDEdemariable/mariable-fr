/**
 * Configuration centralisée des vidéos tutorielles Loom
 * 
 * ⚠️ IMPORTANT : Les IDs Loom sont des placeholders.
 * Pour activer les vidéos, remplacer 'PLACEHOLDER_LOOM_ID' par les vrais IDs Loom.
 * 
 * Format ID Loom : chaîne alphanumérique (ex: 'a5f4b8c9d2e1f3g4h5i6')
 */

export type TutorialVideoId = 
  | 'welcome'
  | 'checklist'
  | 'budget'
  | 'vendors'
  | 'rsvp'
  | 'drinks'
  | 'planning'
  | 'coordination'
  | 'after-wedding'
  | 'accommodations'
  | 'seating-plan';

export interface TutorialVideo {
  id: TutorialVideoId;
  loomId: string; // À remplir avec le vrai ID Loom
  title: string;
  description: string;
  modulePath?: string; // Route associée au module
}

export const TUTORIAL_VIDEOS: Record<TutorialVideoId, TutorialVideo> = {
  welcome: {
    id: 'welcome',
    loomId: 'a37c90539f6c4b1695c2ffed8129fce7',
    title: 'Bienvenue sur Mariable',
    description: 'Découvrez comment utiliser la plateforme pour organiser votre mariage',
  },
  checklist: {
    id: 'checklist',
    loomId: '42f47b66628e4ff8a42df864d7ca3511',
    title: 'Utiliser la checklist',
    description: 'Organisez vos tâches efficacement avec notre checklist intelligente',
    modulePath: '/dashboard/checklist-mariage',
  },
  budget: {
    id: 'budget',
    loomId: '9d755fba2172417992350eac6a20bea0',
    title: 'Gérer votre budget',
    description: 'Suivez vos dépenses de mariage et contrôlez votre budget',
    modulePath: '/dashboard/budget',
  },
  vendors: {
    id: 'vendors',
    loomId: 'e2b8610719e24f9e934095e42afe9593',
    title: 'Trouver et suivre vos prestataires',
    description: 'Découvrez comment rechercher et gérer vos prestataires',
    modulePath: '/dashboard/suivi',
  },
  rsvp: {
    id: 'rsvp',
    loomId: 'b67944ae29884cefbb9401a0728c0efc',
    title: 'Gérer les RSVP',
    description: 'Suivez les confirmations de présence de vos invités',
    modulePath: '/dashboard/rsvp',
  },
  drinks: {
    id: 'drinks',
    loomId: '5963086f384e49a3bc25fc2334afd417',
    title: 'Calculatrice boissons',
    description: 'Estimez les quantités de boissons nécessaires',
    modulePath: '/dashboard/drinks',
  },
  planning: {
    id: 'planning',
    loomId: 'PLACEHOLDER_LOOM_ID',
    title: 'Quiz Mariage',
    description: 'Commencez par les questions essentielles',
    modulePath: '/dashboard/planning',
  },
  coordination: {
    id: 'coordination',
    loomId: 'PLACEHOLDER_LOOM_ID',
    title: 'Coordination Jour-J',
    description: 'Préparez le planning détaillé de votre grand jour',
    modulePath: '/mon-jour-m',
  },
  'after-wedding': {
    id: 'after-wedding',
    loomId: 'PLACEHOLDER_LOOM_ID',
    title: 'Après le mariage',
    description: 'Conseils et tâches pour l\'après mariage',
    modulePath: '/dashboard/apres-jour-j',
  },
  accommodations: {
    id: 'accommodations',
    loomId: 'PLACEHOLDER_LOOM_ID',
    title: 'Gestion des logements',
    description: 'Organisez les hébergements pour vos invités',
    modulePath: '/dashboard/accommodations',
  },
  'seating-plan': {
    id: 'seating-plan',
    loomId: 'b67944ae29884cefbb9401a0728c0efc',
    title: 'Plan de table',
    description: 'Créez et gérez votre plan de table',
    modulePath: '/dashboard/seating-plan',
  },
};

/**
 * Helper pour récupérer une vidéo par ID
 */
export const getTutorialVideo = (id: TutorialVideoId): TutorialVideo | undefined => {
  return TUTORIAL_VIDEOS[id];
};

/**
 * Vérifier si une vidéo a un vrai ID Loom (pas un placeholder)
 */
export const isVideoAvailable = (id: TutorialVideoId): boolean => {
  const video = getTutorialVideo(id);
  return video ? video.loomId !== 'PLACEHOLDER_LOOM_ID' : false;
};
