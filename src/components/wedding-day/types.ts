
export interface WeddingEvent {
  label: string;
  time: Date;
  duration?: number;
  isHighlight?: boolean;
}

export interface WeddingDaySchedule {
  events: WeddingEvent[];
}

export interface KeyEvents {
  hasPhotoSession: boolean;
  hasCoupleEntrance: boolean;
  hasSpeeches: boolean;
  hasWeddingCake: boolean;
  hasFirstDance: boolean;
}
