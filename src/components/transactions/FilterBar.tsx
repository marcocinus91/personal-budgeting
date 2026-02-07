import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { TransactionType } from '../../types';
import { useColors } from '../../theme/ThemeContext';
import { type ColorPalette } from '../../theme/colors';
import { SPACING, RADIUS, FONT_SIZE } from '../../constants/layout';

interface FilterBarProps {
  selectedType: TransactionType | undefined;
  onTypeChange: (type: TransactionType | undefined) => void;
  selectedPeriod: 'month' | 'lastMonth' | 'all';
  onPeriodChange: (period: 'month' | 'lastMonth' | 'all') => void;
}

export function FilterBar({ selectedType, onTypeChange, selectedPeriod, onPeriodChange }: FilterBarProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <FilterChip label="Tutti" active={!selectedType} onPress={() => onTypeChange(undefined)} colors={colors} />
        <FilterChip label="Uscite" active={selectedType === 'expense'} onPress={() => onTypeChange('expense')} colors={colors} />
        <FilterChip label="Entrate" active={selectedType === 'income'} onPress={() => onTypeChange('income')} colors={colors} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <FilterChip label="Questo mese" active={selectedPeriod === 'month'} onPress={() => onPeriodChange('month')} colors={colors} />
        <FilterChip label="Mese scorso" active={selectedPeriod === 'lastMonth'} onPress={() => onPeriodChange('lastMonth')} colors={colors} />
        <FilterChip label="Tutto" active={selectedPeriod === 'all'} onPress={() => onPeriodChange('all')} colors={colors} />
      </ScrollView>
    </View>
  );
}

function FilterChip({ label, active, onPress, colors }: { label: string; active: boolean; onPress: () => void; colors: ColorPalette }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: colors.surface, borderColor: colors.border },
        active && { backgroundColor: colors.primary, borderColor: colors.primary },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, { color: colors.textSecondary }, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  divider: {
    width: 1,
    marginHorizontal: 4,
  },
});
