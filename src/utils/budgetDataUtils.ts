
import { BudgetCategory } from '@/types/budgetTypes';

export interface BudgetItem {
  id: string;
  name: string;
  estimated: number;
  actual: number;
  deposit: number;
  remaining: number;
  payment_note: string;
}

export interface BudgetBreakdownItem {
  name: string;
  amount: number;
  basePrice: number;
  color: string;
}

export interface DashboardBudgetData {
  categories: BudgetCategory[];
  totalEstimated: number;
  totalActual: number;
  totalDeposit: number;
  totalRemaining: number;
  source?: 'calculator' | 'dashboard';
  lastUpdated?: string;
}

export interface CalculatorBudgetData {
  total: number;
  breakdown: BudgetBreakdownItem[];
  source?: 'calculator';
  metadata?: {
    region?: string;
    guests_count?: number;
    season?: string;
    service_level?: string;
  };
}

// Couleurs par défaut pour les catégories
const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  'Lieu de réception': '#7F9474',
  'Traiteur & Boissons': '#948970',
  'Traiteur (hors boissons)': '#948970',
  'Traiteur (repas + boissons)': '#948970',
  'Tenues & Accessoires': '#A99E89',
  'Tenues & mise en beauté': '#A99E89',
  'Décoration & Fleurs': '#1A1F2C',
  'Photo & Vidéo': '#C6BCA9',
  'Photographe & Vidéaste': '#C6BCA9',
  'Musique & Animation': '#8E9196',
  'DJ / Animation': '#8E9196',
  'Transport': '#B8A99A',
  'Papeterie': '#aaadb0',
  'Papeterie & faire-part': '#aaadb0',
  'Cadeaux': '#D4C5B9',
  'Divers': '#aaadb0',
  'Autres': '#aaadb0',
  'Autres (transport, cadeaux, imprévus)': '#aaadb0',
  'Wedding Planner': '#8E9196',
  'Budget non alloué': '#cccccc'
};

/**
 * Convertit les données de la calculatrice vers le format dashboard
 */
export const formatBudgetForDashboard = (
  calculatorData: CalculatorBudgetData
): DashboardBudgetData => {
  const categories: BudgetCategory[] = [];
  
  calculatorData.breakdown.forEach((item, index) => {
    const categoryName = item.name;
    const color = item.color || DEFAULT_CATEGORY_COLORS[categoryName] || '#aaadb0';
    
    // Créer un item pour cette catégorie
    const budgetItem: BudgetItem = {
      id: `calc_item_${index}_${Date.now()}`,
      name: categoryName,
      estimated: item.amount,
      actual: 0,
      deposit: 0,
      remaining: item.amount,
      payment_note: ''
    };
    
    // Trouver ou créer la catégorie
    let category = categories.find(cat => cat.name === categoryName);
    if (!category) {
      category = {
        name: categoryName,
        items: [],
        totalEstimated: 0,
        totalActual: 0,
        totalDeposit: 0,
        totalRemaining: 0
      };
      categories.push(category);
    }
    
    category.items.push(budgetItem);
    category.totalEstimated += item.amount;
    category.totalRemaining += item.amount;
  });
  
  const totalEstimated = calculatorData.breakdown.reduce((sum, item) => sum + item.amount, 0);
  
  return {
    categories,
    totalEstimated,
    totalActual: 0,
    totalDeposit: 0,
    totalRemaining: totalEstimated,
    source: 'calculator',
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Combine intelligemment les données des deux sources
 */
export const mergeBudgetData = (
  dashboardData: DashboardBudgetData | null,
  calculatorData: CalculatorBudgetData | null
): DashboardBudgetData | null => {
  // Si on a seulement des données dashboard, les retourner
  if (dashboardData && !calculatorData) {
    return { ...dashboardData, source: 'dashboard' };
  }
  
  // Si on a seulement des données calculatrice, les convertir
  if (!dashboardData && calculatorData) {
    return formatBudgetForDashboard(calculatorData);
  }
  
  // Si on a les deux, privilégier les données dashboard mais ajouter les nouvelles catégories de la calculatrice
  if (dashboardData && calculatorData) {
    const calculatorFormatted = formatBudgetForDashboard(calculatorData);
    const mergedCategories = [...dashboardData.categories];
    
    // Ajouter les nouvelles catégories de la calculatrice qui n'existent pas dans le dashboard
    calculatorFormatted.categories.forEach(calcCategory => {
      const existingCategory = mergedCategories.find(cat => cat.name === calcCategory.name);
      if (!existingCategory) {
        mergedCategories.push(calcCategory);
      }
    });
    
    // Recalculer les totaux
    const totalEstimated = mergedCategories.reduce((sum, cat) => sum + cat.totalEstimated, 0);
    const totalActual = mergedCategories.reduce((sum, cat) => sum + cat.totalActual, 0);
    const totalDeposit = mergedCategories.reduce((sum, cat) => sum + cat.totalDeposit, 0);
    const totalRemaining = mergedCategories.reduce((sum, cat) => sum + cat.totalRemaining, 0);
    
    return {
      categories: mergedCategories,
      totalEstimated,
      totalActual,
      totalDeposit,
      totalRemaining,
      source: 'dashboard',
      lastUpdated: new Date().toISOString()
    };
  }
  
  return null;
};

/**
 * Vérifie la cohérence des données
 */
export const validateBudgetStructure = (data: DashboardBudgetData): boolean => {
  if (!data || !data.categories || !Array.isArray(data.categories)) {
    return false;
  }
  
  // Vérifier que chaque catégorie a la structure correcte
  for (const category of data.categories) {
    if (!category.name || !Array.isArray(category.items)) {
      return false;
    }
    
    // Vérifier que chaque item a la structure correcte
    for (const item of category.items) {
      if (!item.id || typeof item.estimated !== 'number') {
        return false;
      }
    }
  }
  
  return true;
};

/**
 * Convertit les données dashboard vers le format d'export de la calculatrice
 */
export const formatDashboardForCalculator = (
  dashboardData: DashboardBudgetData
): CalculatorBudgetData => {
  const breakdown: BudgetBreakdownItem[] = dashboardData.categories.map(category => ({
    name: category.name,
    amount: category.totalEstimated,
    basePrice: category.totalEstimated,
    color: DEFAULT_CATEGORY_COLORS[category.name] || '#aaadb0'
  }));
  
  return {
    total: dashboardData.totalEstimated,
    breakdown,
    source: 'calculator'
  };
};

/**
 * Nettoie les données corrompues
 */
export const sanitizeBudgetData = (data: any): DashboardBudgetData | null => {
  try {
    if (!data || typeof data !== 'object') {
      return null;
    }
    
    const sanitized: DashboardBudgetData = {
      categories: [],
      totalEstimated: 0,
      totalActual: 0,
      totalDeposit: 0,
      totalRemaining: 0,
      source: data.source || 'dashboard',
      lastUpdated: data.lastUpdated || new Date().toISOString()
    };
    
    if (data.categories && Array.isArray(data.categories)) {
      sanitized.categories = data.categories.filter((cat: any) => {
        return cat && cat.name && Array.isArray(cat.items);
      }).map((cat: any) => ({
        name: cat.name,
        items: (cat.items || []).filter((item: any) => {
          return item && item.id && typeof item.estimated === 'number';
        }).map((item: any) => ({
          id: item.id,
          name: item.name || '',
          estimated: Number(item.estimated) || 0,
          actual: Number(item.actual) || 0,
          deposit: Number(item.deposit) || 0,
          remaining: Number(item.remaining) || 0,
          payment_note: item.payment_note || ''
        })),
        totalEstimated: Number(cat.totalEstimated) || 0,
        totalActual: Number(cat.totalActual) || 0,
        totalDeposit: Number(cat.totalDeposit) || 0,
        totalRemaining: Number(cat.totalRemaining) || 0
      }));
    }
    
    // Recalculer les totaux
    sanitized.totalEstimated = sanitized.categories.reduce((sum, cat) => sum + cat.totalEstimated, 0);
    sanitized.totalActual = sanitized.categories.reduce((sum, cat) => sum + cat.totalActual, 0);
    sanitized.totalDeposit = sanitized.categories.reduce((sum, cat) => sum + cat.totalDeposit, 0);
    sanitized.totalRemaining = sanitized.categories.reduce((sum, cat) => sum + cat.totalRemaining, 0);
    
    return validateBudgetStructure(sanitized) ? sanitized : null;
  } catch (error) {
    console.error('Error sanitizing budget data:', error);
    return null;
  }
};
