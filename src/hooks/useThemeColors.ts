// src/hooks/useThemeColors.ts
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/store/settings/settingsSelectors';
import { tailwind } from '@/theme';

export const useThemeColors = () => {
  const theme = useSelector(selectTheme);
  const deviceScheme = useColorScheme();
  const resolvedTheme = theme === 'system' ? deviceScheme || 'light' : theme;

  const getThemedColor = (lightColor: string, darkColor: string) => {
    if (resolvedTheme === 'dark') {
      return tailwind.color(darkColor);
    }
    return tailwind.color(lightColor);
  };

  return { getThemedColor, theme: resolvedTheme };
};
