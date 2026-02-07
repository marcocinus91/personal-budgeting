import React, { useEffect, useState, useCallback } from 'react';
import { View, SectionList, Text, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTransactionStore } from '../../src/store/useTransactionStore';
import { TransactionListItem } from '../../src/components/transactions/TransactionListItem';
import { FilterBar } from '../../src/components/transactions/FilterBar';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useColors } from '../../src/theme/ThemeContext';
import { SPACING, FONT_SIZE } from '../../src/constants/layout';
import { TransactionType, Transaction, TransactionFilter } from '../../src/types';
import { formatDayHeader, getMonthBounds, getCurrentMonthYear } from '../../src/utils/date';

type Period = 'month' | 'lastMonth' | 'all';

export default function TransactionsScreen() {
  const colors = useColors();
  const router = useRouter();
  const transactions = useTransactionStore((s) => s.transactions);
  const loadTransactions = useTransactionStore((s) => s.loadTransactions);
  const isLoading = useTransactionStore((s) => s.isLoading);

  const [typeFilter, setTypeFilter] = useState<TransactionType | undefined>(undefined);
  const [periodFilter, setPeriodFilter] = useState<Period>('month');

  const buildFilter = useCallback((): TransactionFilter => {
    const filter: TransactionFilter = {};
    if (typeFilter) filter.type = typeFilter;

    const { year, month } = getCurrentMonthYear();
    if (periodFilter === 'month') {
      const { start, end } = getMonthBounds(year, month);
      filter.dateFrom = start;
      filter.dateTo = end;
    } else if (periodFilter === 'lastMonth') {
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const { start, end } = getMonthBounds(prevYear, prevMonth);
      filter.dateFrom = start;
      filter.dateTo = end;
    }

    return filter;
  }, [typeFilter, periodFilter]);

  useFocusEffect(
    useCallback(() => {
      loadTransactions(buildFilter());
    }, [buildFilter])
  );

  useEffect(() => {
    loadTransactions(buildFilter());
  }, [typeFilter, periodFilter]);

  const sections = groupByDate(transactions);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <FilterBar
        selectedType={typeFilter}
        onTypeChange={setTypeFilter}
        selectedPeriod={periodFilter}
        onPeriodChange={setPeriodFilter}
      />
      {transactions.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="Nessun movimento"
          message="Non ci sono movimenti per il periodo selezionato."
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TransactionListItem
              transaction={item}
              onPress={(id) => router.push(`/transaction/${id}`)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionHeader, { color: colors.textSecondary, backgroundColor: colors.surface }]}>{title}</Text>
          )}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}

function groupByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  for (const t of transactions) {
    if (!groups[t.date]) groups[t.date] = [];
    groups[t.date].push(t);
  }
  return Object.entries(groups).map(([date, data]) => ({
    title: formatDayHeader(date),
    data,
  }));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
    textTransform: 'capitalize',
  },
});
