import { type SQLiteDatabase } from 'expo-sqlite';
import { SavingsGoal, CreateGoalInput } from '../types';

export async function getAllGoals(db: SQLiteDatabase): Promise<SavingsGoal[]> {
  return db.getAllAsync<SavingsGoal>(
    'SELECT * FROM savings_goals ORDER BY is_completed ASC, created_at DESC'
  );
}

export async function getGoalById(
  db: SQLiteDatabase,
  id: number
): Promise<SavingsGoal | null> {
  return db.getFirstAsync<SavingsGoal>(
    'SELECT * FROM savings_goals WHERE id = ?',
    [id]
  );
}

export async function insertGoal(
  db: SQLiteDatabase,
  data: CreateGoalInput
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO savings_goals (name, target_amount, deadline, color)
     VALUES (?, ?, ?, ?)`,
    [data.name, data.targetAmount, data.deadline ?? null, data.color ?? null]
  );
  return result.lastInsertRowId;
}

export async function updateGoal(
  db: SQLiteDatabase,
  id: number,
  data: {
    name?: string;
    targetAmount?: number;
    currentAmount?: number;
    deadline?: string | null;
    color?: string | null;
    isCompleted?: boolean;
  }
): Promise<void> {
  const fields: string[] = [];
  const params: (string | number | null)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
  if (data.targetAmount !== undefined) { fields.push('target_amount = ?'); params.push(data.targetAmount); }
  if (data.currentAmount !== undefined) { fields.push('current_amount = ?'); params.push(data.currentAmount); }
  if (data.deadline !== undefined) { fields.push('deadline = ?'); params.push(data.deadline); }
  if (data.color !== undefined) { fields.push('color = ?'); params.push(data.color); }
  if (data.isCompleted !== undefined) { fields.push('is_completed = ?'); params.push(data.isCompleted ? 1 : 0); }

  fields.push("updated_at = datetime('now')");
  params.push(id);

  await db.runAsync(
    `UPDATE savings_goals SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
}

export async function deleteGoal(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM savings_goals WHERE id = ?', [id]);
}

export async function addFundsToGoal(
  db: SQLiteDatabase,
  id: number,
  amount: number
): Promise<void> {
  await db.runAsync(
    `UPDATE savings_goals
     SET current_amount = MIN(current_amount + ?, target_amount),
         is_completed = CASE WHEN current_amount + ? >= target_amount THEN 1 ELSE 0 END,
         updated_at = datetime('now')
     WHERE id = ?`,
    [amount, amount, id]
  );
}

export async function withdrawFundsFromGoal(
  db: SQLiteDatabase,
  id: number,
  amount: number
): Promise<void> {
  await db.runAsync(
    `UPDATE savings_goals
     SET current_amount = MAX(current_amount - ?, 0),
         is_completed = 0,
         updated_at = datetime('now')
     WHERE id = ?`,
    [amount, id]
  );
}
