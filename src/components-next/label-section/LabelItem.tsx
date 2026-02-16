import React, { useMemo } from 'react';
import { StyleSheet, Platform, useColorScheme } from 'react-native';
import Animated from 'react-native-reanimated';

import { tailwind } from '@/theme';
import { Label } from '@/types';

type LabelItemProps = {
  item: Label;
  index: number;
};

export const LabelItem = (props: LabelItemProps) => {
  const { item } = props;
  const colorScheme = useColorScheme();

  const labelShadowStyle = useMemo(() => {
    return Platform.select({
      ios: {
        shadowColor: '#00000040',
        shadowOffset: { width: 0, height: 0.15 },
        shadowRadius: 2,
        shadowOpacity: 0.35,
        elevation: 2,
      },
      android: {
        elevation: 4,
        backgroundColor:
          colorScheme === 'dark'
            ? tailwind.color('brand-background-dark')
            : tailwind.color('white'),
      },
    }) || {};
  }, [colorScheme]);

  
  return (
    <Animated.View
      style={[
        labelShadowStyle,
        tailwind.style('flex flex-row items-center bg-white dark:bg-grayDark-50 px-3 py-[7px] rounded-lg mr-2 mt-3'),
      ]}>
      <Animated.View style={tailwind.style('h-2 w-2 rounded-full', `bg-[${item.color}]`)} />
      <Animated.Text
        style={tailwind.style(
          'text-md font-inter-normal-20 leading-[17px] tracking-[0.32px] pl-1.5 text-gray-950 dark:text-grayDark-950',
        )}>
        {item.title}
      </Animated.Text>
    </Animated.View>
  );
};

