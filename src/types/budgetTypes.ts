
export interface BudgetItem {
  id: string;
  name: string;
  estimated: number;
  actual: number;
  deposit: number;
  remaining: number;
  payment_note: string;
}

export interface BudgetCategory {
  name: string;
  items: BudgetItem[];
  totalEstimated: number;
  totalActual: number;
  totalDeposit: number;
  totalRemaining: number;
}

export interface BudgetEstimate {
  total: number;
  breakdown: BudgetBreakdownItem[];
}

export interface BudgetBreakdownItem {
  name: string;
  amount: number;
  basePrice: number;
  color: string;
}
