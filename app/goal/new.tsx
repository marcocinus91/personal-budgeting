import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoalForm } from '../../src/components/goals/GoalForm';
import { useGoalStore } from '../../src/store/useGoalStore';
import { useColors } from '../../src/theme/ThemeContext';

export default function NewGoalScreen() {
  const colors = useColors();
  const router = useRouter();
  const addGoal = useGoalStore((s) => s.addGoal);

  const handleSubmit = async (data: { name: string; targetAmount: number; deadline?: string; color?: string }) => {
    await addGoal(data);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <GoalForm onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
