import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGoalStore } from '../../src/store/useGoalStore';
import { getDatabase } from '../../src/db/client';
import { getGoalById } from '../../src/db/goals';
import { SavingsGoal } from '../../src/types';
import { Button } from '../../src/components/ui/Button';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { Card } from '../../src/components/ui/Card';
import { useColors } from '../../src/theme/ThemeContext';
import { SPACING, FONT_SIZE, RADIUS } from '../../src/constants/layout';
import { formatEUR, parseEURInput } from '../../src/utils/currency';
import { formatTransactionDate } from '../../src/utils/date';

export default function GoalDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addFunds = useGoalStore((s) => s.addFunds);
  const withdrawFunds = useGoalStore((s) => s.withdrawFunds);
  const deleteGoal = useGoalStore((s) => s.deleteGoal);

  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState('');

  const loadGoal = async () => {
    const db = await getDatabase();
    const g = await getGoalById(db, Number(id));
    setGoal(g);
    setLoading(false);
  };

  useEffect(() => {
    loadGoal();
  }, [id]);

  const handleAddFunds = async () => {
    const amount = parseEURInput(fundAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Errore', 'Inserisci un importo valido');
      return;
    }
    await addFunds(Number(id), amount);
    setFundAmount('');
    await loadGoal();
  };

  const handleWithdraw = async () => {
    const amount = parseEURInput(fundAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Errore', 'Inserisci un importo valido');
      return;
    }
    await withdrawFunds(Number(id), amount);
    setFundAmount('');
    await loadGoal();
  };

  const handleDelete = () => {
    Alert.alert('Conferma', 'Vuoi eliminare questo obiettivo?', [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Elimina',
        style: 'destructive',
        onPress: async () => {
          await deleteGoal(Number(id));
          router.back();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!goal) return null;

  const progress = goal.target_amount > 0 ? goal.current_amount / goal.target_amount : 0;
  const color = goal.color || colors.primary;
  const isCompleted = goal.is_completed === 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{goal.name}</Text>
          {goal.deadline && (
            <Text style={[styles.deadline, { color: colors.textSecondary }]}>Scadenza: {formatTransactionDate(goal.deadline)}</Text>
          )}

          <View style={styles.progressSection}>
            <Text style={[styles.percentText, { color }]}>{Math.round(progress * 100)}%</Text>
            <ProgressBar progress={progress} color={color} height={12} />
            <View style={styles.amountRow}>
              <Text style={[styles.currentAmount, { color: colors.textPrimary }]}>{formatEUR(goal.current_amount)}</Text>
              <Text style={[styles.targetAmount, { color: colors.textSecondary }]}>di {formatEUR(goal.target_amount)}</Text>
            </View>
          </View>

          {isCompleted && (
            <View style={[styles.completedBadge, { backgroundColor: colors.incomeLight }]}>
              <Text style={[styles.completedText, { color: colors.income }]}>Obiettivo raggiunto!</Text>
            </View>
          )}
        </Card>

        {!isCompleted && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Aggiungi / Preleva fondi</Text>
            <TextInput
              style={[styles.fundInput, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
              value={fundAmount}
              onChangeText={setFundAmount}
              placeholder="Importo in EUR"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
            />
            <View style={styles.fundButtons}>
              <Button
                title="Aggiungi"
                onPress={handleAddFunds}
                style={styles.fundButton}
              />
              <Button
                title="Preleva"
                onPress={handleWithdraw}
                variant="secondary"
                style={styles.fundButton}
              />
            </View>
          </Card>
        )}

        <Button
          title="Elimina Obiettivo"
          onPress={handleDelete}
          variant="danger"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.md,
    gap: SPACING.md,
    paddingBottom: 40,
  },
  name: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  deadline: {
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
  },
  progressSection: {
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  percentText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    textAlign: 'center',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentAmount: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  targetAmount: {
    fontSize: FONT_SIZE.md,
  },
  completedBadge: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  completedText: {
    fontWeight: '600',
    fontSize: FONT_SIZE.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  fundInput: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.lg,
    borderWidth: 1,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  fundButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  fundButton: {
    flex: 1,
  },
});
