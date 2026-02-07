import { type SQLiteDatabase } from 'expo-sqlite';
import { Transaction, CreateTransactionInput, TransactionFilter } from '../types';

export async function getAllTransactions(db: SQLiteDatabase): Promise<Transaction[]> {
  return db.getAllAsync<Transaction>(
    `SELECT t.*, c.name as category_name, c.type as category_type
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     ORDER BY t.date DESC, t.created_at DESC`
  );
}

export async function getTransactionById(
  db: SQLiteDatabase,
  id: number
): Promise<Transaction | null> {
  return db.getFirstAsync<Transaction>(
    `SELECT t.*, c.name as category_name, c.type as category_type
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.id = ?`,
    id
  );
}

export async function getFilteredTransactions(
  db: SQLiteDatabase,
  filter: TransactionFilter
): Promise<Transaction[]> {
  let query = `
    SELECT t.*, c.name as category_name, c.type as category_type
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (filter.type) {
    query += ' AND t.type = ?';
    params.push(filter.type);
  }
  if (filter.categoryId) {
    query += ' AND t.category_id = ?';
    params.push(filter.categoryId);
  }
  if (filter.dateFrom) {
    query += ' AND t.date >= ?';
    params.push(filter.dateFrom);
  }
  if (filter.dateTo) {
    query += ' AND t.date <= ?';
    params.push(filter.dateTo);
  }

  query += ' ORDER BY t.date DESC, t.created_at DESC';
  return db.getAllAsync<Transaction>(query, params);
}

export async function getMonthlyTotals(
  db: SQLiteDatabase,
  dateFrom: string,
  dateTo: string
) {
  const income = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(amount), 0) as total FROM transactions
     WHERE type = 'income' AND date >= ? AND date <= ?`,
    [dateFrom, dateTo]
  );
  const expenses = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(amount), 0) as total FROM transactions
     WHERE type = 'expense' AND date >= ? AND date <= ?`,
    [dateFrom, dateTo]
  );
  return {
    totalIncome: income?.total ?? 0,
    totalExpenses: expenses?.total ?? 0,
  };
}

export async function getExpensesByCategory(
  db: SQLiteDatabase,
  dateFrom: string,
  dateTo: string
) {
  return db.getAllAsync<{
    category_id: number;
    category_name: string;
    total: number;
  }>(
    `SELECT t.category_id, c.name as category_name, SUM(t.amount) as total
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.type = 'expense' AND t.date >= ? AND t.date <= ?
     GROUP BY t.category_id
     ORDER BY total DESC`,
    [dateFrom, dateTo]
  );
}

export async function insertTransaction(
  db: SQLiteDatabase,
  data: CreateTransactionInput
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO transactions (type, amount, category_id, date, note)
     VALUES (?, ?, ?, ?, ?)`,
    [data.type, data.amount, data.categoryId, data.date, data.note ?? null]
  );
  return result.lastInsertRowId;
}

export async function updateTransaction(
  db: SQLiteDatabase,
  id: number,
  data: Partial<CreateTransactionInput>
): Promise<void> {
  const fields: string[] = [];
  const params: (string | number | null)[] = [];

  if (data.type !== undefined) { fields.push('type = ?'); params.push(data.type); }
  if (data.amount !== undefined) { fields.push('amount = ?'); params.push(data.amount); }
  if (data.categoryId !== undefined) { fields.push('category_id = ?'); params.push(data.categoryId); }
  if (data.date !== undefined) { fields.push('date = ?'); params.push(data.date); }
  if (data.note !== undefined) { fields.push('note = ?'); params.push(data.note ?? null); }

  fields.push("updated_at = datetime('now')");
  params.push(id);

  await db.runAsync(
    `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
}

export async function deleteTransaction(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
}
