
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

export interface WeddingDaySchedule {
  events: WeddingEvent[];
}
