import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTransactionStore } from '../../src/store/useTransactionStore';
import { useGoalStore } from '../../src/store/useGoalStore';
import { getDatabase } from '../../src/db/client';
import { useColors } from '../../src/theme/ThemeContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { type ColorPalette } from '../../src/theme/colors';
import { SPACING, RADIUS, FONT_SIZE } from '../../src/constants/layout';
import { type ThemeMode } from '../../src/theme/ThemeContext';

export default function SettingsScreen() {
  const colors = useColors();
  const { mode, setMode } = useTheme();
  const loadTransactions = useTransactionStore((s) => s.loadTransactions);
  const loadGoals = useGoalStore((s) => s.loadGoals);

  const handleExportCSV = async () => {
    try {
      const db = await getDatabase();
      const transactions = await db.getAllAsync<{
        date: string;
        type: string;
        amount: number;
        category_name: string;
        note: string | null;
      }>(
        `SELECT t.date, t.type, t.amount, c.name as category_name, t.note
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         ORDER BY t.date DESC`
      );

      if (transactions.length === 0) {
        Alert.alert('Info', 'Non ci sono transazioni da esportare.');
        return;
      }

      let csv = 'Data,Tipo,Importo,Categoria,Nota\n';
      for (const t of transactions) {
        const note = (t.note || '').replace(/"/g, '""');
        csv += `${t.date},${t.type === 'income' ? 'Entrata' : 'Uscita'},${t.amount},"${t.category_name}","${note}"\n`;
      }

      const file = new File(Paths.cache, 'transazioni.csv');
      if (file.exists) file.delete();
      file.create();
      file.write(csv);
      await Sharing.shareAsync(file.uri, { mimeType: 'text/csv', dialogTitle: 'Esporta Transazioni' });
    } catch (error) {
      Alert.alert('Errore', 'Impossibile esportare i dati.');
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Conferma Reset',
      'Sei sicuro di voler eliminare tutti i dati? Questa azione non può essere annullata.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina Tutto',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDatabase();
              await db.execAsync('DELETE FROM transactions; DELETE FROM savings_goals;');
              await loadTransactions();
              await loadGoals();
              Alert.alert('Fatto', 'Tutti i dati sono stati eliminati.');
            } catch {
              Alert.alert('Errore', 'Impossibile eliminare i dati.');
            }
          },
        },
      ]
    );
  };

  const themeModeLabel = (m: ThemeMode) => {
    if (m === 'system') return 'Sistema';
    if (m === 'light') return 'Chiaro';
    return 'Scuro';
  };

  const handleThemeChange = () => {
    const options: ThemeMode[] = ['system', 'light', 'dark'];
    const labels = options.map(themeModeLabel);
    Alert.alert('Tema', 'Scegli il tema dell\'app', [
      ...options.map((opt, i) => ({
        text: labels[i] + (opt === mode ? ' ✓' : ''),
        onPress: () => setMode(opt),
      })),
      { text: 'Annulla', style: 'cancel' as const },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <SettingsRow
          icon="color-palette-outline"
          label={`Tema: ${themeModeLabel(mode)}`}
          onPress={handleThemeChange}
          colors={colors}
        />
        <SettingsRow
          icon="download-outline"
          label="Esporta CSV"
          onPress={handleExportCSV}
          colors={colors}
        />
        <SettingsRow
          icon="trash-outline"
          label="Reset Dati"
          onPress={handleResetData}
          danger
          colors={colors}
        />
      </View>
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <SettingsRow
          icon="information-circle-outline"
          label="Versione 1.0.0"
          onPress={() => {}}
          disabled
          colors={colors}
        />
      </View>
    </View>
  );
}

function SettingsRow({
  icon,
  label,
  onPress,
  danger,
  disabled,
  colors,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  danger?: boolean;
  disabled?: boolean;
  colors: ColorPalette;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.6}
    >
      <Ionicons
        name={icon}
        size={22}
        color={danger ? colors.expense : colors.textSecondary}
      />
      <Text style={[
        styles.rowLabel,
        { color: colors.textPrimary },
        danger && { color: colors.expense },
        disabled && { color: colors.textTertiary },
      ]}>
        {label}
      </Text>
      {!disabled && (
        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACING.md,
  },
  section: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
  },
});
