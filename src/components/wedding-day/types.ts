
// Type utilisé dans le planning du Jour J
export interface WeddingEvent {
  label: string;
  time: Date;
  duration?: number;
  isHighlight?: boolean;  // Rendu optionnel car pas toujours présent
  isMargin?: boolean;     // Ajout de cette propriété
  note?: string;          // Ajout de cette propriété
  type?: string;
  id: number;
}

// User choices for optional events
export interface UserChoices {
  hasPhotoSession: boolean;
  hasCoupleEntrance: boolean;
  hasOtherAnimations: boolean;
  hasSpeeches: boolean;
  hasWeddingCake: boolean;
  hasFirstDance: boolean;
}

export interface WeddingDaySchedule {
  events: WeddingEvent[];
  userChoices?: UserChoices;
}
