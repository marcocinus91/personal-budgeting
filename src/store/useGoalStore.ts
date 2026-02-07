import { create } from 'zustand';
import { SavingsGoal, CreateGoalInput } from '../types';
import { getDatabase } from '../db/client';
import * as goalDb from '../db/goals';

interface GoalState {
  goals: SavingsGoal[];
  isLoading: boolean;

  loadGoals: () => Promise<void>;
  addGoal: (data: CreateGoalInput) => Promise<void>;
  updateGoal: (id: number, data: Parameters<typeof goalDb.updateGoal>[2]) => Promise<void>;
  deleteGoal: (id: number) => Promise<void>;
  addFunds: (id: number, amount: number) => Promise<void>;
  withdrawFunds: (id: number, amount: number) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,

  loadGoals: async () => {
    set({ isLoading: true });
    const db = await getDatabase();
    const goals = await goalDb.getAllGoals(db);
    set({ goals, isLoading: false });
  },

  addGoal: async (data: CreateGoalInput) => {
    const db = await getDatabase();
    await goalDb.insertGoal(db, data);
    await get().loadGoals();
  },

  updateGoal: async (id, data) => {
    const db = await getDatabase();
    await goalDb.updateGoal(db, id, data);
    await get().loadGoals();
  },

  deleteGoal: async (id: number) => {
    const db = await getDatabase();
    await goalDb.deleteGoal(db, id);
    await get().loadGoals();
  },

  addFunds: async (id: number, amount: number) => {
    const db = await getDatabase();
    await goalDb.addFundsToGoal(db, id, amount);
    await get().loadGoals();
  },

  withdrawFunds: async (id: number, amount: number) => {
    const db = await getDatabase();
    await goalDb.withdrawFundsFromGoal(db, id, amount);
    await get().loadGoals();
  },
}));
