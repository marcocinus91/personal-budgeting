import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useColors } from '../../theme/ThemeContext';
import { FONT_SIZE, SPACING } from '../../constants/layout';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function AmountInput({ value, onChangeText, placeholder = '0,00' }: AmountInputProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.currency, { color: colors.textSecondary }]}>EUR</Text>
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType="decimal-pad"
        textAlign="center"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
  },
  currency: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '500',
    marginRight: SPACING.sm,
  },
  input: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    minWidth: 120,
    padding: SPACING.sm,
  },
});
