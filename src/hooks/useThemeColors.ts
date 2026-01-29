// src/hooks/useThemeColors.ts
import { useSelector } from 'react-redux';
import { selectTheme } from '@/store/settings/settingsSelectors';
import { tailwind } from '@/theme';

export const useThemeColors = () => {
  const theme = useSelector(selectTheme);

  const getThemedColor = (lightColor: string, darkColor: string) => {
    if (theme === 'dark') {
      return tailwind.color(darkColor);
    }
    return tailwind.color(lightColor);
  };

  return { getThemedColor, theme };
};
