import React, { useState } from 'react';
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
import { AmountInput } from '../ui/AmountInput';
import { Button } from '../ui/Button';
import { useColors } from '../../theme/ThemeContext';
import { GOAL_COLORS } from '../../theme/colors';
import { SPACING, RADIUS, FONT_SIZE } from '../../constants/layout';
import { parseEURInput } from '../../utils/currency';

interface GoalFormProps {
  initialData?: {
    name: string;
    targetAmount: number;
    deadline?: string;
    color?: string;
  };
  onSubmit: (data: { name: string; targetAmount: number; deadline?: string; color?: string }) => Promise<void>;
  submitLabel?: string;
}

export function GoalForm({ initialData, onSubmit, submitLabel = 'Crea Obiettivo' }: GoalFormProps) {
  const colors = useColors();
  const [name, setName] = useState(initialData?.name ?? '');
  const [amountText, setAmountText] = useState(
    initialData ? String(initialData.targetAmount).replace('.', ',') : ''
  );
  const [deadline, setDeadline] = useState(initialData?.deadline ?? '');
  const [color, setColor] = useState(initialData?.color ?? GOAL_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Errore', 'Inserisci un nome per l\'obiettivo');
      return;
    }
    const targetAmount = parseEURInput(amountText);
    if (!targetAmount || targetAmount <= 0) {
      Alert.alert('Errore', 'Inserisci un importo obiettivo valido');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        targetAmount,
        deadline: deadline.trim() || undefined,
        color,
      });
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
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Nome</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
          value={name}
          onChangeText={setName}
          placeholder="Es: Vacanza estiva"
          placeholderTextColor={colors.textTertiary}
          maxLength={50}
        />

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Importo obiettivo</Text>
        <AmountInput value={amountText} onChangeText={setAmountText} />

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Scadenza (opzionale)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
          value={deadline}
          onChangeText={setDeadline}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textTertiary}
        />

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Colore</Text>
        <View style={styles.colorRow}>
          {GOAL_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorDot,
                { backgroundColor: c },
                color === c && [styles.colorDotSelected, { borderColor: colors.textPrimary }],
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        <Button
          title={submitLabel}
          onPress={handleSubmit}
          loading={loading}
          disabled={!name.trim() || !amountText}
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
  colorRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorDotSelected: {
    borderWidth: 3,
  },
  submitButton: {
    marginTop: SPACING.xl,
  },
});
