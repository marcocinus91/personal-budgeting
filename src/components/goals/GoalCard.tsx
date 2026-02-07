import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavingsGoal } from '../../types';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { useColors } from '../../theme/ThemeContext';
import { SPACING, FONT_SIZE } from '../../constants/layout';
import { formatEUR } from '../../utils/currency';
import { formatTransactionDate } from '../../utils/date';

interface GoalCardProps {
  goal: SavingsGoal;
  onPress: (id: number) => void;
}

export function GoalCard({ goal, onPress }: GoalCardProps) {
  const colors = useColors();
  const progress = goal.target_amount > 0 ? goal.current_amount / goal.target_amount : 0;
  const isCompleted = goal.is_completed === 1;
  const color = goal.color || colors.primary;

  return (
    <TouchableOpacity onPress={() => onPress(goal.id)} activeOpacity={0.6}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconBg, { backgroundColor: color + '20' }]}>
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'flag'}
              size={20}
              color={color}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>{goal.name}</Text>
            {goal.deadline && (
              <Text style={[styles.deadline, { color: colors.textTertiary }]}>Scadenza: {formatTransactionDate(goal.deadline)}</Text>
            )}
          </View>
          <Text style={[styles.percent, { color: colors.textPrimary }]}>{Math.round(progress * 100)}%</Text>
        </View>
        <ProgressBar progress={progress} color={color} />
        <View style={styles.amounts}>
          <Text style={[styles.current, { color: colors.textPrimary }]}>{formatEUR(goal.current_amount)}</Text>
          <Text style={[styles.target, { color: colors.textSecondary }]}>di {formatEUR(goal.target_amount)}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  deadline: {
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  percent: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  amounts: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'baseline',
  },
  current: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  target: {
    fontSize: FONT_SIZE.sm,
  },
});
