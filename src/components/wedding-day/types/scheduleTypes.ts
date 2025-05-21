
// Types for the wedding day schedule generator

export interface QuizOption {
  valeur?: string;
  duree?: number;
  quantite?: number[];
}

export interface QuizField {
  label: string;
  type: 'choix' | 'multi-choix' | 'time' | 'number' | string;
  options?: (string | QuizOption)[];
  duree?: number;
  unit?: string;
  visible_si?: Record<string, string>;
}

export interface QuizSection {
  [key: string]: QuizField | QuizSection;
}

export interface QuizData {
  inputs_mariage: QuizSection;
}

export interface QuizFormValues {
  [key: string]: string | number | boolean | string[] | QuizFormValues;
}

// Event interface for the generated schedule
export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  type: string;
  isHighlight?: boolean;
  notes?: string;
}

export interface WeddingSchedule {
  events: ScheduleEvent[];
  metadata: {
    weddingDate: Date;
    ceremonyType: string;
    hasMultipleLocations: boolean;
    includedActivities: string[];
  };
}
