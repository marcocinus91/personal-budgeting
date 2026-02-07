import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTransactionStore } from '../../src/store/useTransactionStore';
import { useGoalStore } from '../../src/store/useGoalStore';
import { MonthlySummaryCard } from '../../src/components/dashboard/MonthlySummaryCard';
import { ExpenseChart } from '../../src/components/dashboard/ExpenseChart';
import { RecentTransactions } from '../../src/components/dashboard/RecentTransactions';
import { SavingsOverview } from '../../src/components/dashboard/SavingsOverview';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useColors } from '../../src/theme/ThemeContext';
import { SPACING } from '../../src/constants/layout';
import { getMonthBounds, getCurrentMonthYear, formatMonthYear } from '../../src/utils/date';

export default function DashboardScreen() {
  const colors = useColors();
  const transactions = useTransactionStore((s) => s.transactions);
  const loadTransactions = useTransactionStore((s) => s.loadTransactions);
  const getMonthlyTotals = useTransactionStore((s) => s.getMonthlyTotals);
  const getExpensesByCategory = useTransactionStore((s) => s.getExpensesByCategory);
  const goals = useGoalStore((s) => s.goals);
  const loadGoals = useGoalStore((s) => s.loadGoals);

  const [totals, setTotals] = useState({ totalIncome: 0, totalExpenses: 0 });
  const [expensesByCategory, setExpensesByCategory] = useState<
    Array<{ categoryName: string; total: number; percentage: number }>
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  const { year, month } = getCurrentMonthYear();
  const { start, end } = getMonthBounds(year, month);
  const monthLabel = formatMonthYear(new Date(year, month - 1));

  const loadData = useCallback(async () => {
    await Promise.all([loadTransactions(), loadGoals()]);
    const t = await getMonthlyTotals(start, end);
    setTotals(t);
    const expenses = await getExpensesByCategory(start, end);
    const totalExp = expenses.reduce((sum, e) => sum + e.total, 0);
    setExpensesByCategory(
      expenses.map((e) => ({
        categoryName: e.category_name,
        total: e.total,
        percentage: totalExp > 0 ? (e.total / totalExp) * 100 : 0,
      }))
    );
  }, [start, end]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const isEmpty = transactions.length === 0 && goals.length === 0;

  if (isEmpty) {
    return (
      <EmptyState
        icon="wallet-outline"
        title="Benvenuto!"
        message="Inizia aggiungendo la tua prima entrata o uscita dalla tab Aggiungi."
      />
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.surface }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <MonthlySummaryCard
        monthLabel={monthLabel}
        totalIncome={totals.totalIncome}
        totalExpenses={totals.totalExpenses}
      />
      <ExpenseChart data={expensesByCategory} />
      <SavingsOverview goals={goals} />
      <RecentTransactions transactions={transactions} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: 40,
    gap: SPACING.md,
  },
});
