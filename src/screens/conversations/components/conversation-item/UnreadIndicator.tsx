import React from 'react';
import { Text, useColorScheme } from 'react-native';

import { tailwind } from '@/theme';
import { NativeView } from '@/components-next/native-components';

type UnreadIndicatorProps = {
  count: number;
};

export const UnreadIndicator = (props: UnreadIndicatorProps) => {
  const { count } = props;
  const colorScheme = useColorScheme();
  return (
    <NativeView
      style={tailwind.style('h-5 w-5 flex justify-center items-center rounded-full bg-brand-primary dark:bg-brand-primary-dark')}>
      <Text
        style={tailwind.style(
          'text-xs font-inter-semibold-20 leading-[15px] text-center text-white dark:text-grayDark-950',
        )}>
        {count > 9 ? '9+' : count}
      </Text>
    </NativeView>
  );
};
