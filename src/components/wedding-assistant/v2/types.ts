import { supabase } from '@/integrations/supabase/client';
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
  [questionId: string]: { answer: string, score: number };
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
  level: string;
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

export interface UserQuizResult {
  id?: string;
  user_id?: string;
  email?: string;
  score: number;
  status: string;
  level: string;
  objectives: string[] | Json[];
  categories: string[] | Json[];
  created_at?: string;
  updated_at?: string;
}

export interface GeneratedTask {
  id?: string;
  user_id?: string;
  quiz_result_id?: string;
  label: string;
  description: string | null;
  priority: 'haute' | 'moyenne' | 'basse';
  category: string;
  position: number;
  completed: boolean;
  due_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Ordre défini des sections pour le quiz
export const SECTION_ORDER = [
  "Organisation Générale",
  "Réception",
  "Cérémonie",
  "Invités",
  "Mariés"
];

// Generate quiz result from answers
export const generateQuizResult = async (answers: Record<string, { answer: string; score: number }>): Promise<PlanningResult> => {
  let totalScore = 0;
  Object.values(answers).forEach((answer) => {
    totalScore += answer.score;
  });

  try {
    const { data: scoringLevels, error } = await supabase
      .from('quiz_scoring')
      .select('*')
      .order('score_min');

    if (error) {
      console.error('Error fetching quiz scoring:', error);
      throw error;
    }
    
    const levelData = scoringLevels.find(l => totalScore >= l.score_min && totalScore <= l.score_max);

    if (levelData) {
      return {
        score: totalScore,
        status: levelData.status,
        objectives: Array.isArray(levelData.objectives) ? levelData.objectives.map(String) : [],
        categories: Array.isArray(levelData.categories) ? levelData.categories.map(String) : [],
        level: levelData.status,
      };
    }
  } catch(e) {
    console.error('Failed to generate results from Supabase, using fallback', e);
  }

  // Fallback hardcoded logic
  console.warn('Using fallback quiz result generation logic.');
  const answerCount = Object.keys(answers).length;
  const averageScore = answerCount > 0 ? Math.round(totalScore / answerCount) : 0;
  let level = '';
  let status = '';
  let objectives: string[] = [];
  let categories: string[] = [];

  if (averageScore <= 2) {
    level = 'Débutant';
    status = 'Début de planification';
    objectives = ['Définir un budget', 'Créer une liste d\'invités', 'Choisir une date'];
    categories = ['Budget', 'Organisation générale'];
  } else if (averageScore <= 4) {
    level = 'Intermédiaire';
    status = 'Planification en cours';
    objectives = ['Réserver les prestataires', 'Finaliser les détails', 'Organiser la coordination'];
    categories = ['Prestataires', 'Réception', 'Cérémonie'];
  } else {
    level = 'Avancé';
    status = 'Finalisation';
    objectives = ['Coordination jour J', 'Derniers détails', 'Confirmation finale'];
    categories = ['Coordination', 'Invités', 'Mariés'];
  }

  return {
    score: averageScore,
    status,
    objectives,
    categories,
    level
  };
};

// Save quiz result to database
export const saveQuizResult = async (quizResult: PlanningResult): Promise<void> => {
  // Store in localStorage for now
  localStorage.setItem('quizResult', JSON.stringify(quizResult));
  console.log('Quiz result saved:', quizResult);
};
