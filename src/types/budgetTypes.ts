
// Types pour la gestion cohérente des données budget entre calculatrice et dashboard

export interface BudgetCategory {
  name: string;
  amount: number;
  color: string;
}

export interface BudgetLine {
  name: string;
  amount: number;
  basePrice: number;
  color: string;
}

export interface BudgetEstimate {
  total: number;
  breakdown: BudgetLine[];
}

export interface DashboardBudgetData {
  categories: BudgetCategory[];
  total: number;
  source: 'calculator' | 'dashboard' | 'merged';
  lastUpdated: string;
  metadata?: {
    region?: string;
    season?: string;
    guestsCount?: number;
    serviceLevel?: string;
    calculatorMode?: string;
  };
}

export interface DatabaseBudgetRecord {
  id: string;
  user_id: string;
  project_id?: string;
  region: string;
  season: string;
  guests_count: number;
  service_level: string;
  selected_vendors: string[];
  total_budget: number;
  breakdown: any; // JSON data from database
  created_at: string;
  updated_at: string;
}
