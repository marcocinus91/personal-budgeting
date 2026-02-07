import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { useColors } from '../../theme/ThemeContext';
import { RADIUS, SPACING, FONT_SIZE } from '../../constants/layout';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', disabled, loading, style }: ButtonProps) {
  const colors = useColors();

  const bgColor = variant === 'primary'
    ? colors.primary
    : variant === 'danger'
    ? colors.expense
    : 'transparent';

  const textColor = variant === 'secondary' ? colors.primary : '#FFFFFF';
  const borderColor = variant === 'secondary' ? colors.primary : 'transparent';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColor, borderColor },
        variant === 'secondary' && styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondary: {
    borderWidth: 1.5,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});
