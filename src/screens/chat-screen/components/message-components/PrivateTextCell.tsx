import React from 'react';
import { Animated, Text, useColorScheme } from 'react-native';

import { LockIcon } from '@/svg-icons';
import { tailwind } from '@/theme';
import { unixTimestampToReadableTime } from '@/utils';
import { Icon } from '@/components-next/common';

import { MarkdownDisplay } from './MarkdownDisplay';
import { TEXT_MAX_WIDTH } from '@/constants';

type PrivateTextCellProps = {
  text: string;
  timeStamp: number;
};

export const PrivateTextCell = (props: PrivateTextCellProps) => {
  const { text, timeStamp } = props;
  const colorScheme = useColorScheme();

  const lockIconColor =
    colorScheme === 'dark'
      ? tailwind.color('text-whiteA-A10')
      : tailwind.color('text-blackA-A10');
  const timestampTextColor =
    colorScheme === 'dark'
      ? tailwind.color('text-whiteA-A10')
      : tailwind.color('text-blackA-A10');

  return (
    <Animated.View
      style={[
        tailwind.style(
          'relative max-w-[300px] pl-2 pr-2.5 py-2 rounded-t-2xl rounded-bl-2xl overflow-hidden bg-amber-100 dark:bg-amberDark-100',
          `max-w-[${TEXT_MAX_WIDTH}px]`,
        ),
      ]}>
      <Animated.View style={tailwind.style('flex flex-row')}>
        <Animated.View
          style={tailwind.style('w-[3px] bg-amber-700 dark:bg-amberDark-700 h-auto rounded-[4px]')}
        />
        <Animated.View style={tailwind.style('pl-2.5')}>
          <MarkdownDisplay isPrivate messageContent={text} />
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={tailwind.style(
          'h-[21px] pt-[5px] pb-0.5 flex flex-row items-center justify-end',
        )}>
        <Icon icon={<LockIcon fill={lockIconColor} />} size={12} />
        <Text
          style={[
            tailwind.style('text-xs font-inter-420-20 tracking-[0.32px] pl-1'),
            { color: timestampTextColor },
          ]}>
          {unixTimestampToReadableTime(timeStamp)}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

