import React from 'react';
import { Animated, Text } from 'react-native';

import { tailwind } from '@/theme';
import { Channel, MessageStatus, MessageType } from '@/types';
import { unixTimestampToReadableTime } from '@/utils';
import { useThemeColors } from '@/hooks/useThemeColors'; // Adicionar import

import { MarkdownDisplay } from './MarkdownDisplay';
import { TEXT_MAX_WIDTH } from '@/constants';
import { DeliveryStatus } from './DeliveryStatus';

type BotTextCellProps = {
  text: string;
  timeStamp: number;
  status: MessageStatus;
  isAvatarRendered?: boolean;
  channel?: Channel;
  messageType: MessageType;
  sourceId?: string;
  isPrivate: boolean;
  errorMessage?: string;
};
export const BotTextCell = (props: BotTextCellProps) => {
  const {
    text,
    timeStamp,
    status,
    isAvatarRendered,
    channel,
    messageType,
    sourceId,
    isPrivate,
    errorMessage,
  } = props;
  const { getThemedColor } = useThemeColors(); // Adicionar useThemeColors

  const timestampTextColor = getThemedColor('text-gray-700', 'text-grayDark-700'); // Cor do texto do timestamp

  return (
    <Animated.View
      style={[
        tailwind.style(
          'relative max-w-[300px] pl-3 pr-2.5 py-2 rounded-2xl overflow-hidden bg-brand-secondary dark:bg-brand-secondary-dark', // Aplicar dark:
          `max-w-[${TEXT_MAX_WIDTH}px]`,
          isAvatarRendered ? 'rounded-br-none' : '',
        ),
      ]}>
      <MarkdownDisplay isBotText messageContent={text} />

      <Animated.View
        style={tailwind.style(
          'h-[21px] pt-[5px] pb-0.5 flex flex-row items-center justify-end',
        )}>
        <Text
          style={tailwind.style('text-xs font-inter-420-20 tracking-[0.32px] pr-1', timestampTextColor)}> {/* Aplicar cor do timestamp */}
          {unixTimestampToReadableTime(timeStamp)}
        </Text>
        <DeliveryStatus
          isPrivate={isPrivate}
          status={status}
          messageType={messageType}
          channel={channel}
          sourceId={sourceId || ''}
          errorMessage={errorMessage || ''}
          deliveredColor={timestampTextColor} // Aplicar cor temática
          sentColor={timestampTextColor} // Aplicar cor temática
        />
      </Animated.View>
    </Animated.View>
  );
};
