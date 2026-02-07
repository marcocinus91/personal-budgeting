import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { useColors } from '../../theme/ThemeContext';
import { SPACING, FONT_SIZE } from '../../constants/layout';
import { formatEUR } from '../../utils/currency';

interface MonthlySummaryCardProps {
  monthLabel: string;
  totalIncome: number;
  totalExpenses: number;
}

export function MonthlySummaryCard({ monthLabel, totalIncome, totalExpenses }: MonthlySummaryCardProps) {
  const colors = useColors();
  const balance = totalIncome - totalExpenses;

  return (
    <Card>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{monthLabel}</Text>
      <View style={styles.row}>
        <SummaryItem label="Entrate" amount={totalIncome} color={colors.income} textSecondary={colors.textSecondary} />
        <SummaryItem label="Uscite" amount={totalExpenses} color={colors.expense} textSecondary={colors.textSecondary} />
        <SummaryItem label="Bilancio" amount={balance} color={balance >= 0 ? colors.income : colors.expense} textSecondary={colors.textSecondary} />
      </View>
    </Card>
  );
}

function SummaryItem({ label, amount, color, textSecondary }: { label: string; amount: number; color: string; textSecondary: string }) {
  return (
    <View style={styles.item}>
      <Text style={[styles.label, { color: textSecondary }]}>{label}</Text>
      <Text style={[styles.amount, { color }]}>{formatEUR(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    marginBottom: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
});
