import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SavingsGoal } from '../../types';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { useColors } from '../../theme/ThemeContext';
import { SPACING, FONT_SIZE } from '../../constants/layout';
import { formatEUR } from '../../utils/currency';

interface SavingsOverviewProps {
  goals: SavingsGoal[];
}

export function SavingsOverview({ goals }: SavingsOverviewProps) {
  const router = useRouter();
  const colors = useColors();
  const activeGoals = goals.filter((g) => !g.is_completed);

  if (activeGoals.length === 0) return null;

  return (
    <Card>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Obiettivi di risparmio</Text>
      <View style={styles.list}>
        {activeGoals.slice(0, 3).map((goal) => {
          const progress = goal.target_amount > 0 ? goal.current_amount / goal.target_amount : 0;
          return (
            <TouchableOpacity
              key={goal.id}
              style={styles.goalItem}
              onPress={() => router.push(`/goal/${goal.id}`)}
              activeOpacity={0.6}
            >
              <View style={styles.goalHeader}>
                <Text style={[styles.goalName, { color: colors.textPrimary }]}>{goal.name}</Text>
                <Text style={[styles.goalPercent, { color: colors.textSecondary }]}>{Math.round(progress * 100)}%</Text>
              </View>
              <ProgressBar progress={progress} color={goal.color || colors.primary} />
              <Text style={[styles.goalAmounts, { color: colors.textTertiary }]}>
                {formatEUR(goal.current_amount)} / {formatEUR(goal.target_amount)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  list: {
    gap: SPACING.md,
  },
  goalItem: {
    gap: 6,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  goalPercent: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  goalAmounts: {
    fontSize: FONT_SIZE.xs,
  },
});
