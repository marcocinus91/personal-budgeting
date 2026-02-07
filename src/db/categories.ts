import { type SQLiteDatabase } from 'expo-sqlite';
import { Category, TransactionType } from '../types';

export async function getAllCategories(db: SQLiteDatabase): Promise<Category[]> {
  return db.getAllAsync<Category>(
    'SELECT * FROM categories ORDER BY type, sort_order'
  );
}

export async function getCategoriesByType(
  db: SQLiteDatabase,
  type: TransactionType
): Promise<Category[]> {
  return db.getAllAsync<Category>(
    'SELECT * FROM categories WHERE type = ? ORDER BY sort_order',
    [type]
  );
}
