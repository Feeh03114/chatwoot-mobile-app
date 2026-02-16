import React from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Pressable, useColorScheme } from 'react-native';
import { Icon } from '@/components-next/common';
import { SendIcon } from '@/svg-icons';
import { useScaleAnimation } from '@/utils';
import { tailwind } from '@/theme';
import { useAppSelector } from '@/hooks';
import { selectIsPrivateMessage } from '@/store/conversation/sendMessageSlice';
import { SendMessageButtonProps } from '../types';
import { sendIconEnterAnimation, sendIconExitAnimation } from '@/utils/customAnimations';

export const SendMessageButton = (props: SendMessageButtonProps) => {
  const { animatedStyle, handlers } = useScaleAnimation();
  const isPrivateMessage = useAppSelector(selectIsPrivateMessage);
  const colorScheme = useColorScheme();

  const iconColor =
    colorScheme === 'dark'
      ? tailwind.color('text-grayDark-950')
      : tailwind.color('text-gray-50');

  return (
    <Pressable {...props} {...handlers}>
      <Animated.View
        layout={LinearTransition.springify().damping(20).stiffness(180)}
        entering={sendIconEnterAnimation}
        exiting={sendIconExitAnimation}
        style={[tailwind.style('flex items-center justify-center h-10 w-10'), animatedStyle]}>
        <Animated.View
          style={tailwind.style(
            'flex items-center justify-center h-7 w-7 rounded-full',
            isPrivateMessage
              ? 'bg-amber-700 dark:bg-amberDark-700'
              : 'bg-gray-950 dark:bg-grayDark-500',
          )}>
          <Icon icon={<SendIcon />} stroke={iconColor} size={16} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};
