import { create } from 'zustand';
import { Transaction, CreateTransactionInput, Category, TransactionFilter } from '../types';
import { getDatabase } from '../db/client';
import * as transactionDb from '../db/transactions';
import * as categoryDb from '../db/categories';

interface TransactionState {
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;

  loadCategories: () => Promise<void>;
  loadTransactions: (filter?: TransactionFilter) => Promise<void>;
  addTransaction: (data: CreateTransactionInput) => Promise<void>;
  updateTransaction: (id: number, data: Partial<CreateTransactionInput>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  getMonthlyTotals: (dateFrom: string, dateTo: string) => Promise<{ totalIncome: number; totalExpenses: number }>;
  getExpensesByCategory: (dateFrom: string, dateTo: string) => Promise<Array<{ category_id: number; category_name: string; total: number }>>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  categories: [],
  isLoading: false,

  loadCategories: async () => {
    const db = await getDatabase();
    const categories = await categoryDb.getAllCategories(db);
    set({ categories });
  },

  loadTransactions: async (filter?: TransactionFilter) => {
    set({ isLoading: true });
    const db = await getDatabase();
    const transactions = filter
      ? await transactionDb.getFilteredTransactions(db, filter)
      : await transactionDb.getAllTransactions(db);
    set({ transactions, isLoading: false });
  },

  addTransaction: async (data: CreateTransactionInput) => {
    const db = await getDatabase();
    await transactionDb.insertTransaction(db, data);
    await get().loadTransactions();
  },

  updateTransaction: async (id: number, data: Partial<CreateTransactionInput>) => {
    const db = await getDatabase();
    await transactionDb.updateTransaction(db, id, data);
    await get().loadTransactions();
  },

  deleteTransaction: async (id: number) => {
    const db = await getDatabase();
    await transactionDb.deleteTransaction(db, id);
    await get().loadTransactions();
  },

  getMonthlyTotals: async (dateFrom: string, dateTo: string) => {
    const db = await getDatabase();
    return transactionDb.getMonthlyTotals(db, dateFrom, dateTo);
  },

  getExpensesByCategory: async (dateFrom: string, dateTo: string) => {
    const db = await getDatabase();
    return transactionDb.getExpensesByCategory(db, dateFrom, dateTo);
  },
}));
