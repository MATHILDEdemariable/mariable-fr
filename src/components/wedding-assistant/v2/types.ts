
export interface QuizQuestion {
  id: string;
  question: string;
  section: string;
  options: string[];
  scores: number[];
  order_index: number;
}

export interface QuizScoring {
  id: string;
  score_min: number;
  score_max: number;
  status: string;
  objectives: string[];
  categories: string[];
}

export interface UserAnswers {
  [questionId: string]: number;
}

export interface WeddingFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[] | any; // Updated to handle Json type from Supabase
}

export interface PlanningResult {
  score: number;
  status: string;
  objectives: string[];
  categories: string[];
}
