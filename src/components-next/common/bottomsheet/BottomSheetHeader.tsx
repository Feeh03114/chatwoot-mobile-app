import React from 'react';
import Animated from 'react-native-reanimated';

import { tailwind } from '@/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

type BottomSheetHeaderProps = {
  headerText: string;
};

export const BottomSheetHeader = (props: BottomSheetHeaderProps) => {
  const { headerText } = props;
  const { getThemedColor } = useThemeColors();

  const headerTextColor = getThemedColor('text-gray-700', 'text-grayDark-700');

  return (
    <Animated.View style={tailwind.style('flex-row justify-center items-center')}>
      <Animated.Text
        style={tailwind.style(
          'text-md font-inter-medium-24 leading-[17px] tracking-[0.32px]',
          headerTextColor,
        )}>
        {headerText}
      </Animated.Text>
    </Animated.View>
  );
};
