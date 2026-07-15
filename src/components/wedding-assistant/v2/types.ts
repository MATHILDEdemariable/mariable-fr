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
// Logique: chaque réponse porte un code profil (1=Militaire, 2=Déléguée, 3=Détente, 4=Débutante).
// Le profil majoritaire l'emporte. Égalité → priorité au code le plus petit.
export const generateQuizResult = async (answers: Record<string, { answer: string; score: number }>): Promise<PlanningResult> => {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  Object.values(answers).forEach((a) => {
    if (counts[a.score] !== undefined) counts[a.score] += 1;
  });

  let winningCode = 4;
  let maxCount = -1;
  for (const code of [1, 2, 3, 4]) {
    if (counts[code] > maxCount) {
      maxCount = counts[code];
      winningCode = code;
    }
  }

  try {
    const { data: scoringLevels, error } = await supabase
      .from('quiz_scoring')
      .select('*')
      .order('score_min');

    if (error) throw error;

    const levelData = scoringLevels?.find(
      (l) => winningCode >= l.score_min && winningCode <= l.score_max
    );

    if (levelData) {
      return {
        score: winningCode,
        status: levelData.status,
        objectives: Array.isArray(levelData.objectives) ? levelData.objectives.map(String) : [],
        categories: Array.isArray(levelData.categories) ? levelData.categories.map(String) : [],
        level: levelData.status,
      };
    }
  } catch (e) {
    console.error('Failed to generate results from Supabase, using safe fallback', e);
  }

  // Safe fallback: profils fun, jamais l'ancien wording "Début de planification"
  const fallbackMap: Record<number, PlanningResult> = {
    1: { score: 1, status: 'Militaire', level: 'Militaire',
      categories: ['Organisation stratégique', 'Contrôle & suivi', 'Budget détaillé'],
      objectives: ['Utilise le planning Jour-J détaillé', 'Suis ton budget poste par poste', 'Construis ton seating plan'] },
    2: { score: 2, status: 'Déléguée', level: 'Déléguée',
      categories: ['Wedding planner', 'Coordination pro', 'Sérénité'],
      objectives: ['Découvre nos wedding planners partenaires', 'Réserve un Jour-M avec un coordinateur', 'Partage ton dashboard'] },
    3: { score: 3, status: 'Détente', level: 'Détente',
      categories: ['Inspiration', 'Coup de cœur', 'Personnalisation'],
      objectives: ['Explore les moodboards', 'Utilise le sélecteur par vibe', 'Fais confiance à ton feeling'] },
    4: { score: 4, status: 'Débutante', level: 'Débutante',
      categories: ['Démarrage', 'Checklist', 'Guides'],
      objectives: ['Commence par le Guide Débutants', 'Télécharge la Checklist Mariage', 'Définis ton budget'] },
  };
  return fallbackMap[winningCode];
};

// Save quiz result to database
export const saveQuizResult = async (quizResult: PlanningResult): Promise<void> => {
  // Store in localStorage for now
  localStorage.setItem('quizResult', JSON.stringify(quizResult));
  console.log('Quiz result saved:', quizResult);
};
