import { TransactionType } from '../types';

export interface CategoryDefinition {
  name: string;
  type: TransactionType;
  icon: string;
}

export const INCOME_CATEGORIES: CategoryDefinition[] = [
  { name: 'Stipendio', type: 'income', icon: 'briefcase-outline' },
  { name: 'Freelance', type: 'income', icon: 'laptop-outline' },
  { name: 'Investimenti', type: 'income', icon: 'trending-up-outline' },
  { name: 'Regalo', type: 'income', icon: 'gift-outline' },
  { name: 'Altro', type: 'income', icon: 'ellipsis-horizontal-outline' },
];

export const EXPENSE_CATEGORIES: CategoryDefinition[] = [
  { name: 'Affitto', type: 'expense', icon: 'home-outline' },
  { name: 'Cibo', type: 'expense', icon: 'restaurant-outline' },
  { name: 'Trasporti', type: 'expense', icon: 'car-outline' },
  { name: 'Svago', type: 'expense', icon: 'game-controller-outline' },
  { name: 'Salute', type: 'expense', icon: 'medkit-outline' },
  { name: 'Abbigliamento', type: 'expense', icon: 'shirt-outline' },
  { name: 'Bollette', type: 'expense', icon: 'flash-outline' },
  { name: 'Istruzione', type: 'expense', icon: 'school-outline' },
  { name: 'Altro', type: 'expense', icon: 'ellipsis-horizontal-outline' },
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
