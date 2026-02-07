import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TransactionType, CreateTransactionInput } from '../../types';
import { useTransactionStore } from '../../store/useTransactionStore';
import { AmountInput } from '../ui/AmountInput';
import { CategoryPicker } from '../ui/CategoryPicker';
import { Button } from '../ui/Button';
import { useColors } from '../../theme/ThemeContext';
import { SPACING, RADIUS, FONT_SIZE } from '../../constants/layout';
import { parseEURInput } from '../../utils/currency';
import { formatDateISO } from '../../utils/date';

interface TransactionFormProps {
  initialData?: {
    type: TransactionType;
    amount: number;
    categoryId: number;
    date: string;
    note?: string;
  };
  onSubmit: (data: CreateTransactionInput) => Promise<void>;
  submitLabel?: string;
}

export function TransactionForm({ initialData, onSubmit, submitLabel = 'Salva' }: TransactionFormProps) {
  const colors = useColors();
  const categories = useTransactionStore((s) => s.categories);
  const loadCategories = useTransactionStore((s) => s.loadCategories);

  const [type, setType] = useState<TransactionType>(initialData?.type ?? 'expense');
  const [amountText, setAmountText] = useState(initialData ? String(initialData.amount).replace('.', ',') : '');
  const [categoryId, setCategoryId] = useState<number | null>(initialData?.categoryId ?? null);
  const [date, setDate] = useState(initialData?.date ?? formatDateISO(new Date()));
  const [note, setNote] = useState(initialData?.note ?? '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (categoryId && !filteredCategories.find((c) => c.id === categoryId)) {
      setCategoryId(null);
    }
  }, [type]);

  const handleSubmit = async () => {
    const amount = parseEURInput(amountText);
    if (!amount || amount <= 0) {
      Alert.alert('Errore', 'Inserisci un importo valido');
      return;
    }
    if (!categoryId) {
      Alert.alert('Errore', 'Seleziona una categoria');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ type, amount, categoryId, date, note: note.trim() || undefined });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.typeToggle, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && { backgroundColor: colors.expense }]}
            onPress={() => setType('expense')}
            activeOpacity={0.7}
          >
            <Text style={[styles.typeText, { color: colors.textSecondary }, type === 'expense' && styles.typeTextActive]}>
              Uscita
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && { backgroundColor: colors.income }]}
            onPress={() => setType('income')}
            activeOpacity={0.7}
          >
            <Text style={[styles.typeText, { color: colors.textSecondary }, type === 'income' && styles.typeTextActive]}>
              Entrata
            </Text>
          </TouchableOpacity>
        </View>

        <AmountInput value={amountText} onChangeText={setAmountText} />

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Categoria</Text>
        <CategoryPicker
          categories={filteredCategories}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Data</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textTertiary}
        />

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Nota (opzionale)</Text>
        <TextInput
          style={[styles.input, styles.noteInput, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
          value={note}
          onChangeText={setNote}
          placeholder="Aggiungi una nota..."
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={200}
        />

        <Button
          title={submitLabel}
          onPress={handleSubmit}
          loading={loading}
          disabled={!amountText || !categoryId}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  typeToggle: {
    flexDirection: 'row',
    borderRadius: RADIUS.md,
    padding: 4,
    gap: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  typeText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: SPACING.xl,
  },
});
