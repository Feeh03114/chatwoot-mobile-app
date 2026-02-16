/* eslint-disable react/display-name */
import React, { memo } from 'react';
import { useColorScheme } from 'react-native';
import { LinearTransition } from 'react-native-reanimated';

import { Icon } from '@/components-next/common';
import { AnimatedNativeView } from '@/components-next/native-components';
import { CheckedIcon, UncheckedIcon } from '@/svg-icons';
import { tailwind } from '@/theme';

type ConversationSelectProps = {
  isSelected: boolean;
  currentState: string;
};

export const ConversationSelect = memo((props: ConversationSelectProps) => {
  const { isSelected, currentState } = props;
  const colorScheme = useColorScheme();

  const checkedFillColor =
    colorScheme === 'dark'
      ? tailwind.color('brand-primary-dark')
      : tailwind.color('brand-primary');
  const checkedStrokeColor =
    colorScheme === 'dark'
      ? tailwind.color('text-whiteA-A9')
      : tailwind.color('text-whiteA-A9');
  const uncheckedStrokeColor =
    colorScheme === 'dark'
      ? tailwind.color('text-grayDark-800')
      : tailwind.color('text-gray-800');

  return currentState === 'Select' ? (
    <AnimatedNativeView
      layout={LinearTransition.springify().damping(28).stiffness(200)}
      style={tailwind.style('h-full pt-[23px] pr-3')}>
      <Icon
        icon={
          isSelected ? (
            <CheckedIcon fill={checkedFillColor} stroke={checkedStrokeColor} />
          ) : (
            <UncheckedIcon stroke={uncheckedStrokeColor} />
          )
        }
        size={20}
      />
    </AnimatedNativeView>
  ) : null;
});
