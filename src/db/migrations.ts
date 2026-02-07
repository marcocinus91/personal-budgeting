import { type SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion < 1) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        icon TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_default INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        amount REAL NOT NULL CHECK(amount > 0),
        category_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        note TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );

      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);

      CREATE TABLE IF NOT EXISTS savings_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        target_amount REAL NOT NULL CHECK(target_amount > 0),
        current_amount REAL NOT NULL DEFAULT 0 CHECK(current_amount >= 0),
        deadline TEXT,
        color TEXT,
        is_completed INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      INSERT INTO categories (name, type, icon, sort_order) VALUES
        ('Stipendio', 'income', 'briefcase-outline', 1),
        ('Freelance', 'income', 'laptop-outline', 2),
        ('Investimenti', 'income', 'trending-up-outline', 3),
        ('Regalo', 'income', 'gift-outline', 4),
        ('Altro', 'income', 'ellipsis-horizontal-outline', 5);

      INSERT INTO categories (name, type, icon, sort_order) VALUES
        ('Affitto', 'expense', 'home-outline', 1),
        ('Cibo', 'expense', 'restaurant-outline', 2),
        ('Trasporti', 'expense', 'car-outline', 3),
        ('Svago', 'expense', 'game-controller-outline', 4),
        ('Salute', 'expense', 'medkit-outline', 5),
        ('Abbigliamento', 'expense', 'shirt-outline', 6),
        ('Bollette', 'expense', 'flash-outline', 7),
        ('Istruzione', 'expense', 'school-outline', 8),
        ('Altro', 'expense', 'ellipsis-horizontal-outline', 9);

      PRAGMA user_version = 1;
    `);
  }
}
