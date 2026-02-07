export type TransactionType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  icon: string | null;
  sort_order: number;
  is_default: number;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  category_id: number;
  date: string;
  note: string | null;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_type?: TransactionType;
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  categoryId: number;
  date: string;
  note?: string;
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {}

export interface SavingsGoal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  color: string | null;
  is_completed: number;
  created_at: string;
  updated_at: string;
}

export interface CreateGoalInput {
  name: string;
  targetAmount: number;
  deadline?: string;
  color?: string;
}

export interface UpdateGoalInput extends Partial<CreateGoalInput> {
  currentAmount?: number;
  isCompleted?: boolean;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: Array<{
    categoryId: number;
    categoryName: string;
    total: number;
    percentage: number;
  }>;
}

export interface TransactionFilter {
  type?: TransactionType;
  categoryId?: number;
  dateFrom?: string;
  dateTo?: string;
}
