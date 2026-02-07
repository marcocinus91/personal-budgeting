import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '../../theme/ThemeContext';
import { RADIUS } from '../../constants/layout';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ progress, color, height = 8 }: ProgressBarProps) {
  const colors = useColors();
  const fillColor = color || colors.primary;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.track, { height, backgroundColor: colors.surface }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: fillColor,
            height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: RADIUS.full,
  },
});
