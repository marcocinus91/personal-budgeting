import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Transaction } from '../../types';
import { TransactionListItem } from '../transactions/TransactionListItem';
import { Card } from '../ui/Card';
import { useColors } from '../../theme/ThemeContext';
import { SPACING, FONT_SIZE } from '../../constants/layout';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const router = useRouter();
  const colors = useColors();

  if (transactions.length === 0) return null;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Ultimi movimenti</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>Vedi tutti</Text>
        </TouchableOpacity>
      </View>
      {transactions.slice(0, 5).map((t) => (
        <TransactionListItem
          key={t.id}
          transaction={t}
          onPress={(id) => router.push(`/transaction/${id}`)}
        />
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 0,
    paddingBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
});
