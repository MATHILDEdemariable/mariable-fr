
export interface WeddingEvent {
  label: string;
  time: Date;
  duration?: number;
  isHighlight?: boolean;
}

export interface WeddingDaySchedule {
  events: WeddingEvent[];
}
