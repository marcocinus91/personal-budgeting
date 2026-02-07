export type ColorPalette = {
  primary: string;
  primaryLight: string;
  background: string;
  surface: string;
  border: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  income: string;
  incomeLight: string;
  expense: string;
  expenseLight: string;

  card: string;
  shadow: string;
  overlay: string;
};

export const lightColors: ColorPalette = {
  primary: '#4A90D9',
  primaryLight: '#E8F0FE',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  border: '#E5E7EB',

  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  income: '#34C759',
  incomeLight: '#ECFDF5',
  expense: '#FF3B30',
  expenseLight: '#FEF2F2',

  card: '#FFFFFF',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.3)',
};

export const darkColors: ColorPalette = {
  primary: '#5A9FE8',
  primaryLight: '#1A2A45',
  background: '#0F0F1A',
  surface: '#1A1A2E',
  border: '#2D2D44',

  textPrimary: '#F0F0F5',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',

  income: '#3DD668',
  incomeLight: '#0D2818',
  expense: '#FF5147',
  expenseLight: '#2D1215',

  card: '#1A1A2E',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const CATEGORY_COLORS = [
  '#4A90D9',
  '#34C759',
  '#FF9500',
  '#AF52DE',
  '#FF2D55',
  '#5AC8FA',
  '#FFCC02',
  '#FF6482',
  '#8E8E93',
];

export const GOAL_COLORS = [
  '#4A90D9',
  '#34C759',
  '#FF9500',
  '#AF52DE',
  '#FF2D55',
  '#5AC8FA',
];
