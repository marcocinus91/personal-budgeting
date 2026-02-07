import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGoalStore } from '../../src/store/useGoalStore';
import { GoalCard } from '../../src/components/goals/GoalCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useColors } from '../../src/theme/ThemeContext';
import { SPACING } from '../../src/constants/layout';

export default function GoalsScreen() {
  const colors = useColors();
  const router = useRouter();
  const goals = useGoalStore((s) => s.goals);
  const loadGoals = useGoalStore((s) => s.loadGoals);

  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {goals.length === 0 ? (
        <EmptyState
          icon="flag-outline"
          title="Nessun obiettivo"
          message="Crea il tuo primo obiettivo di risparmio toccando il pulsante +."
        />
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <GoalCard goal={item} onPress={(id) => router.push(`/goal/${id}`)} />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.shadow }]}
        onPress={() => router.push('/goal/new')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: 100,
  },
  separator: {
    height: SPACING.md,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
