import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDbIfNeeded } from '../src/db/migrations';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { Suspense } from 'react';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { ThemeProvider, useColors, useTheme } from '../src/theme/ThemeContext';
import { lightColors } from '../src/theme/colors';

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: lightColors.background }}>
      <ActivityIndicator size="large" color={lightColors.primary} />
    </View>
  );
}

function AppStack() {
  const colors = useColors();
  const { isDark } = useTheme();

  const navTheme = {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.primary,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '700' as const },
      heavy: { fontFamily: 'System', fontWeight: '900' as const },
    },
  };

  return (
    <NavThemeProvider value={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="transaction/[id]"
          options={{
            headerShown: true,
            title: 'Dettaglio',
            presentation: 'card',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.textPrimary,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="goal/new"
          options={{
            headerShown: true,
            title: 'Nuovo Obiettivo',
            presentation: 'modal',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.textPrimary,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="goal/[id]"
          options={{
            headerShown: true,
            title: 'Obiettivo',
            presentation: 'card',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.textPrimary,
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Suspense fallback={<LoadingScreen />}>
        <SQLiteProvider
          databaseName="personal-budget.db"
          onInit={migrateDbIfNeeded}
        >
          <AppStack />
        </SQLiteProvider>
      </Suspense>
    </ThemeProvider>
  );
}
