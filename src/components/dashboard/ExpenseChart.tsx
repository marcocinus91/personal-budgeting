import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Card } from '../ui/Card';
import { useColors } from '../../theme/ThemeContext';
import { CATEGORY_COLORS } from '../../theme/colors';
import { SPACING, FONT_SIZE } from '../../constants/layout';
import { formatEUR } from '../../utils/currency';

interface ExpenseChartProps {
  data: Array<{
    categoryName: string;
    total: number;
    percentage: number;
  }>;
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  const colors = useColors();

  if (data.length === 0) return null;

  const chartData = data.map((item, index) => ({
    name: item.categoryName,
    amount: item.total,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  }));

  const screenWidth = Dimensions.get('window').width - 64;

  return (
    <Card>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Spese per categoria</Text>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={180}
        chartConfig={{
          color: () => colors.textPrimary,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute
      />
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={item.categoryName} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }]} />
            <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>{item.categoryName}</Text>
            <Text style={[styles.legendValue, { color: colors.textPrimary }]}>{formatEUR(item.total)}</Text>
          </View>
        ))}
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
  legend: {
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
  },
  legendValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
});
