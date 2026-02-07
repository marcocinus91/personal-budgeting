import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types';
import { useColors } from '../../theme/ThemeContext';
import { SPACING, RADIUS, FONT_SIZE } from '../../constants/layout';

interface CategoryPickerProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function CategoryPicker({ categories, selectedId, onSelect }: CategoryPickerProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {categories.map((cat) => {
        const isSelected = cat.id === selectedId;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.chip,
              { backgroundColor: colors.surface, borderColor: colors.border },
              isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={(cat.icon as any) || 'ellipsis-horizontal-outline'}
              size={18}
              color={isSelected ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary },
                isSelected && { color: '#FFFFFF' },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
});
