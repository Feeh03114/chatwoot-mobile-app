import React from 'react';
import Animated from 'react-native-reanimated';
import { Pressable, useColorScheme } from 'react-native';
import { Icon } from '@/components-next/common';
import { PhotosIcon } from '@/svg-icons';
import { useScaleAnimation } from '@/utils';
import { tailwind } from '@/theme';
import { PhotosCommandButtonProps } from '../types';
import { photoIconEnterAnimation, photoIconExitAnimation } from '@/utils/customAnimations';

export const PhotosCommandButton = (props: PhotosCommandButtonProps) => {
  const { animatedStyle, handlers } = useScaleAnimation();
  const colorScheme = useColorScheme();

  const iconColor =
    colorScheme === 'dark'
      ? (tailwind.color('grayDark-900') ?? '#a1a1a1')
      : (tailwind.color('gray-900') ?? '#1a1a1a');

  return (
    <Pressable
      {...props}
      {...handlers}
      style={({ pressed }) => [tailwind.style(pressed ? 'opacity-70' : '')]}>
      <Animated.View
        entering={photoIconEnterAnimation}
        exiting={photoIconExitAnimation}
        style={[
          tailwind.style('flex items-center justify-center h-10 w-10 rounded-2xl'),
          animatedStyle,
        ]}>
        <Icon icon={<PhotosIcon stroke={iconColor} />} size={24} />
      </Animated.View>
    </Pressable>
  );
};
