import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { tailwind } from '@/theme';

export const useBottomSheetThemeProps = () => {
  const colorScheme = useColorScheme();

  return useMemo(
    () => ({
      backgroundStyle: {
        backgroundColor:
          colorScheme === 'dark'
            ? (tailwind.color('brand-background-dark') ?? '#1b1b1b')
            : (tailwind.color('brand-background') ?? '#f9f9f9'),
      },
      handleIndicatorStyle: {
        backgroundColor:
          colorScheme === 'dark'
            ? 'hsla(0, 0%, 100%, 0.169)'
            : 'hsla(0, 0%, 0%, 0.133)',
        overflow: 'hidden' as const,
        width: 32,
        height: 4,
        borderRadius: 11,
      },
    }),
    [colorScheme],
  );
};
