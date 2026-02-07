import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../../types';
import { useColors } from '../../theme/ThemeContext';
import { SPACING, RADIUS, FONT_SIZE } from '../../constants/layout';
import { formatEUR } from '../../utils/currency';

interface TransactionListItemProps {
  transaction: Transaction;
  onPress: (id: number) => void;
}

export function TransactionListItem({ transaction, onPress }: TransactionListItemProps) {
  const colors = useColors();
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? colors.income : colors.expense;
  const bgColor = isIncome ? colors.incomeLight : colors.expenseLight;
  const sign = isIncome ? '+' : '-';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(transaction.id)}
      activeOpacity={0.6}
    >
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        <Ionicons
          name={(transaction.category_name === 'Stipendio' ? 'briefcase-outline' :
                 transaction.category_name === 'Freelance' ? 'laptop-outline' :
                 transaction.category_name === 'Investimenti' ? 'trending-up-outline' :
                 transaction.category_name === 'Regalo' ? 'gift-outline' :
                 transaction.category_name === 'Affitto' ? 'home-outline' :
                 transaction.category_name === 'Cibo' ? 'restaurant-outline' :
                 transaction.category_name === 'Trasporti' ? 'car-outline' :
                 transaction.category_name === 'Svago' ? 'game-controller-outline' :
                 transaction.category_name === 'Salute' ? 'medkit-outline' :
                 transaction.category_name === 'Abbigliamento' ? 'shirt-outline' :
                 transaction.category_name === 'Bollette' ? 'flash-outline' :
                 transaction.category_name === 'Istruzione' ? 'school-outline' :
                 'ellipsis-horizontal-outline') as any}
          size={20}
          color={amountColor}
        />
      </View>
      <View style={styles.details}>
        <Text style={[styles.category, { color: colors.textPrimary }]}>{transaction.category_name}</Text>
        {transaction.note ? (
          <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={1}>{transaction.note}</Text>
        ) : null}
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {sign}{formatEUR(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
  },
  category: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  note: {
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  amount: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});
