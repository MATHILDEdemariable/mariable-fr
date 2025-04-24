
// Type utilisé dans le planning du Jour J
export interface WeddingEvent {
  label: string;
  time: Date;
  duration?: number;
  isHighlight?: boolean;
  isMargin?: boolean;
  note?: string;
  type?: string;
  id: number;
}

// User choices for optional events
export interface UserChoices {
  hasCouplePhotoSession: boolean;
  hasPhotoSession: boolean;
  hasCoupleEntrance: boolean;
  hasOtherAnimations: boolean;
  hasWeddingCake: boolean;
  hasFirstDance: boolean;
}

export interface WeddingDaySchedule {
  events: WeddingEvent[];
  userChoices?: UserChoices;
}
