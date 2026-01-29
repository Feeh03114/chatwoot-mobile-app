/* eslint-disable react/display-name */
import React, { memo } from 'react';
import { LinearTransition } from 'react-native-reanimated';

import { Icon } from '@/components-next/common';
import { AnimatedNativeView } from '@/components-next/native-components';
import { CheckedIcon, UncheckedIcon } from '@/svg-icons';
import { tailwind } from '@/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

type ConversationSelectProps = {
  isSelected: boolean;
  currentState: string;
};

export const ConversationSelect = memo((props: ConversationSelectProps) => {
  const { isSelected, currentState } = props;
  const { getThemedColor } = useThemeColors();

  const checkedFillColor = getThemedColor('brand-primary', 'brand-primary-dark');
  const checkedStrokeColor = getThemedColor('text-whiteA-A9', 'text-whiteA-A9');
  const uncheckedStrokeColor = getThemedColor('text-gray-800', 'text-grayDark-800');

  return currentState === 'Select' ? (
    <AnimatedNativeView
      layout={LinearTransition.springify().damping(28).stiffness(200)}
      style={tailwind.style('h-full pt-[23px] pr-3')}>
      <Icon
        icon={
          isSelected ? (
            <CheckedIcon fillColor={checkedFillColor} strokeColor={checkedStrokeColor} />
          ) : (
            <UncheckedIcon stroke={uncheckedStrokeColor} />
          )
        }
        size={20}
      />
    </AnimatedNativeView>
  ) : null;
});
