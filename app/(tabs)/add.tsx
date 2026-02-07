import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionForm } from '../../src/components/transactions/TransactionForm';
import { useTransactionStore } from '../../src/store/useTransactionStore';
import { CreateTransactionInput } from '../../src/types';
import { useColors } from '../../src/theme/ThemeContext';
import { Alert } from 'react-native';

export default function AddScreen() {
  const colors = useColors();
  const router = useRouter();
  const addTransaction = useTransactionStore((s) => s.addTransaction);

  const handleSubmit = async (data: CreateTransactionInput) => {
    await addTransaction(data);
    Alert.alert('Fatto', 'Transazione aggiunta con successo', [
      { text: 'OK', onPress: () => router.push('/(tabs)') },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <TransactionForm onSubmit={handleSubmit} submitLabel="Aggiungi" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
