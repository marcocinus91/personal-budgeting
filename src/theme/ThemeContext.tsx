import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, type ColorPalette } from './colors';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  colors: ColorPalette;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
  mode: 'system',
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const isDark = useMemo(() => {
    if (mode === 'light') return false;
    if (mode === 'dark') return true;
    return systemScheme === 'dark';
  }, [mode, systemScheme]);

  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(
    () => ({ colors, isDark, mode, setMode }),
    [colors, isDark, mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useColors(): ColorPalette {
  return useContext(ThemeContext).colors;
}

export function useTheme() {
  return useContext(ThemeContext);
}
