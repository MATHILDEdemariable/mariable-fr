
import { BudgetCategory, BudgetLine, BudgetEstimate, DashboardBudgetData, DatabaseBudgetRecord } from '@/types/budgetTypes';

// Couleurs par défaut pour les catégories
const DEFAULT_COLORS = {
  'Lieu de réception': '#7F9474',
  'Traiteur (repas + boissons)': '#948970',
  'Traiteur (hors boissons)': '#948970',
  'Photographe & Vidéaste': '#A99E89',
  'DJ / Animation': '#C6BCA9',
  'Wedding Planner': '#8E9196',
  'Décoration & Fleurs': '#1A1F2C',
  'Tenues & mise en beauté': '#B8A99A',
  'Papeterie & faire-part': '#aaadb0',
  'Autres (transport, cadeaux, imprévus)': '#aaadb0',
  'Autres dépenses': '#aaadb0',
  'Budget non alloué': '#cccccc',
  'Lieu': '#7F9474',
  'Traiteur': '#948970',
  'Décoration': '#A99E89',
  'Tenue': '#C6BCA9',
  'Photo & Vidéo': '#8E9196',
  'Imprévus': '#1A1F2C'
};

// Convertit les données calculatrice vers format dashboard
export const formatBudgetForDashboard = (estimate: BudgetEstimate, metadata?: any): DashboardBudgetData => {
  const categories: BudgetCategory[] = estimate.breakdown.map(item => ({
    name: item.name,
    amount: item.amount,
    color: item.color || DEFAULT_COLORS[item.name] || '#cccccc'
  }));

  return {
    categories,
    total: estimate.total,
    source: 'calculator',
    lastUpdated: new Date().toISOString(),
    metadata
  };
};

// Convertit les données database vers format dashboard
export const formatDatabaseBudgetForDashboard = (record: DatabaseBudgetRecord): DashboardBudgetData => {
  let categories: BudgetCategory[] = [];

  try {
    // Parse breakdown from database
    const breakdown = Array.isArray(record.breakdown) ? record.breakdown : [];
    
    categories = breakdown.map((item: any) => ({
      name: item.name || 'Catégorie inconnue',
      amount: Number(item.amount) || 0,
      color: item.color || DEFAULT_COLORS[item.name] || '#cccccc'
    }));
  } catch (error) {
    console.error('Erreur lors du parsing des données budget:', error);
    // Fallback avec données par défaut
    categories = [
      { name: 'Lieu', amount: Math.round(record.total_budget * 0.35), color: DEFAULT_COLORS['Lieu'] },
      { name: 'Traiteur', amount: Math.round(record.total_budget * 0.35), color: DEFAULT_COLORS['Traiteur'] },
      { name: 'Décoration', amount: Math.round(record.total_budget * 0.1), color: DEFAULT_COLORS['Décoration'] },
      { name: 'Photo & Vidéo', amount: Math.round(record.total_budget * 0.1), color: DEFAULT_COLORS['Photo & Vidéo'] },
      { name: 'Imprévus', amount: Math.round(record.total_budget * 0.1), color: DEFAULT_COLORS['Imprévus'] }
    ];
  }

  return {
    categories,
    total: record.total_budget,
    source: 'dashboard',
    lastUpdated: record.updated_at,
    metadata: {
      region: record.region,
      season: record.season,
      guestsCount: record.guests_count,
      serviceLevel: record.service_level
    }
  };
};

// Combine intelligemment les données des deux sources
export const mergeBudgetData = (dashboardData: DashboardBudgetData, calculatorData?: DashboardBudgetData): DashboardBudgetData => {
  if (!calculatorData) return dashboardData;
  
  // Prioriser les données les plus récentes
  const dashboardDate = new Date(dashboardData.lastUpdated);
  const calculatorDate = new Date(calculatorData.lastUpdated);
  
  if (calculatorDate > dashboardDate) {
    return {
      ...calculatorData,
      source: 'merged'
    };
  }
  
  return {
    ...dashboardData,
    source: 'merged'
  };
};

// Vérifie la cohérence des données
export const validateBudgetStructure = (data: DashboardBudgetData): boolean => {
  if (!data || !data.categories || !Array.isArray(data.categories)) {
    return false;
  }

  // Vérifier que chaque catégorie a les propriétés requises
  return data.categories.every(category => 
    category.name && 
    typeof category.amount === 'number' && 
    category.color
  );
};

// Nettoie et normalise les données
export const sanitizeBudgetData = (data: any): DashboardBudgetData | null => {
  if (!data) return null;

  try {
    const sanitized: DashboardBudgetData = {
      categories: [],
      total: 0,
      source: data.source || 'dashboard',
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      metadata: data.metadata || {}
    };

    if (data.categories && Array.isArray(data.categories)) {
      sanitized.categories = data.categories
        .filter((cat: any) => cat && cat.name && typeof cat.amount === 'number')
        .map((cat: any) => ({
          name: String(cat.name),
          amount: Number(cat.amount) || 0,
          color: cat.color || DEFAULT_COLORS[cat.name] || '#cccccc'
        }));
    }

    sanitized.total = sanitized.categories.reduce((sum, cat) => sum + cat.amount, 0);

    return validateBudgetStructure(sanitized) ? sanitized : null;
  } catch (error) {
    console.error('Erreur lors de la sanitisation des données budget:', error);
    return null;
  }
};

// Données par défaut en cas d'échec
export const getDefaultBudgetData = (): DashboardBudgetData => ({
  categories: [
    { name: 'Lieu', amount: 5000, color: DEFAULT_COLORS['Lieu'] },
    { name: 'Traiteur', amount: 7000, color: DEFAULT_COLORS['Traiteur'] },
    { name: 'Décoration', amount: 2000, color: DEFAULT_COLORS['Décoration'] },
    { name: 'Tenue', amount: 3000, color: DEFAULT_COLORS['Tenue'] },
    { name: 'Photo & Vidéo', amount: 2500, color: DEFAULT_COLORS['Photo & Vidéo'] },
    { name: 'Imprévus', amount: 1500, color: DEFAULT_COLORS['Imprévus'] }
  ],
  total: 21000,
  source: 'dashboard',
  lastUpdated: new Date().toISOString()
});
