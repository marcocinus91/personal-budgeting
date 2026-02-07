import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionForm } from '../../src/components/transactions/TransactionForm';
import { Button } from '../../src/components/ui/Button';
import { useTransactionStore } from '../../src/store/useTransactionStore';
import { getDatabase } from '../../src/db/client';
import { getTransactionById } from '../../src/db/transactions';
import { CreateTransactionInput, Transaction } from '../../src/types';
import { useColors } from '../../src/theme/ThemeContext';
import { SPACING } from '../../src/constants/layout';

export default function TransactionDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const updateTransaction = useTransactionStore((s) => s.updateTransaction);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    const db = await getDatabase();
    const t = await getTransactionById(db, Number(id));
    setTransaction(t);
    setLoading(false);
  };

  const handleSubmit = async (data: CreateTransactionInput) => {
    await updateTransaction(Number(id), data);
    Alert.alert('Fatto', 'Transazione aggiornata', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Conferma', 'Vuoi eliminare questa transazione?', [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Elimina',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(Number(id));
          router.back();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!transaction) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <TransactionForm
        initialData={{
          type: transaction.type,
          amount: transaction.amount,
          categoryId: transaction.category_id,
          date: transaction.date,
          note: transaction.note || undefined,
        }}
        onSubmit={handleSubmit}
        submitLabel="Aggiorna"
      />
      <View style={styles.deleteContainer}>
        <Button
          title="Elimina Transazione"
          onPress={handleDelete}
          variant="danger"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
  },
});
