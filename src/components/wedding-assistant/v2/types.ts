import { Json } from "@/integrations/supabase/types";

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

export interface QuizEmailCapture {
  id: string;
  email: string;
  full_name?: string;
  quiz_score?: number;
  quiz_status?: string;
  level?: string;
  created_at: string;
  updated_at: string;
}

// New interface for user quiz results from database
export interface UserQuizResult {
  id: string;
  user_id: string | null;
  email: string | null;
  score: number;
  status: string;
  level: string;
  objectives: string[];
  categories: string[];
  created_at: string;
  updated_at: string;
  synchronized: boolean;
}

// Predefined order of sections for the quiz
export const SECTION_ORDER = [
  "Organisation Générale",
  "Réception",
  "Cérémonie",
  "Invités",
  "Mariés"
];
