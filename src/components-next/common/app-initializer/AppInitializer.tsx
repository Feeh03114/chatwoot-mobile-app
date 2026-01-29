// src/components-next/common/app-initializer/AppInitializer.tsx
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';

// import { useDispatch } from 'react-redux'; // Não vamos mais usar useDispatch diretamente

import { getBestLocale } from '@/i18n';
// import { setLocale, setTheme } from '@/store/settings/settingsSlice'; // 1. Remover import direto de setLocale, setTheme
import { settingsSlice } from '@/store/settings/settingsSlice'; // 2. Importar settingsSlice
import { store } from '@/store'; // 3. Importar store global

import { tailwind } from '@/theme'; // Importar a instância global de tailwind

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const deviceLocale = getBestLocale();
    store.dispatch(settingsSlice.actions.setLocale(deviceLocale));
    store.dispatch(settingsSlice.actions.setTheme(colorScheme || 'light'));
  }, [colorScheme]);

  return <>{children}</>;
}