
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

export interface WeddingDaySchedule {
  events: WeddingEvent[];
}
