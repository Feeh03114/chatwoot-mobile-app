import React from 'react';
import { Animated, Text, Dimensions, useColorScheme } from 'react-native';

import { tailwind } from '@/theme';
import { Channel, Message, MessageStatus, MessageType } from '@/types';
import { unixTimestampToReadableTime } from '@/utils';

import { MarkdownDisplay } from './MarkdownDisplay';
import { MESSAGE_STATUS, INBOX_TYPES, TEXT_MAX_WIDTH } from '@/constants';
import { DeliveryStatus } from './DeliveryStatus';
import { EmailMeta } from './EmailMeta';

type MessageTextCellProps = {
  text: string;
  timeStamp: number;
  isIncoming: boolean;
  isOutgoing: boolean;
  isActivity: boolean;
  status: MessageStatus;
  isAvatarRendered?: boolean;
  channel?: Channel;
  messageType: MessageType;
  sourceId?: string;
  isPrivate: boolean;
  errorMessage: string;
  sender: Message['sender'];
  contentAttributes: Message['contentAttributes'];
};

export const MessageTextCell = (props: MessageTextCellProps) => {
  const {
    text,
    timeStamp,
    isIncoming,
    isOutgoing,
    status,
    isAvatarRendered,
    channel,
    messageType,
    sourceId,
    isPrivate,
    errorMessage,
    sender,
    contentAttributes,
  } = props;

  const colorScheme = useColorScheme();

  const isMessageFailed = status === MESSAGE_STATUS.FAILED;
  const isEmailMessage = channel === INBOX_TYPES.EMAIL;
  const windowWidth = Dimensions.get('window').width;
  const EMAIL_MESSAGE_WIDTH = windowWidth - 52;

  const bubbleStyle = isMessageFailed
    ? 'bg-ruby-700 dark:bg-rubyDark-700'
    : isIncoming
    ? 'bg-brand-primary dark:bg-brand-primary-dark'
    : 'bg-brand-secondary dark:bg-brand-secondary-dark'; // isOutgoing

  const timestampTextStyle =
    isMessageFailed || isIncoming
      ? 'text-whiteA-A11' // Same for light and dark on dark bubbles
      : 'text-gray-700 dark:text-grayDark-700'; // isOutgoing

  const deliveryStatusColor =
    colorScheme === 'dark'
      ? tailwind.color('text-grayDark-700')
      : tailwind.color('text-gray-700');

  return (
    <Animated.View
      style={[
        tailwind.style(
          'relative pl-3 pr-2.5 py-2 rounded-2xl overflow-hidden',
          isEmailMessage ? `max-w-[${EMAIL_MESSAGE_WIDTH}px]` : `max-w-[${TEXT_MAX_WIDTH}px]`,
          bubbleStyle, // Aplicar cor de fundo da bolha
          isAvatarRendered
            ? isOutgoing
              ? 'rounded-br-none'
              : isIncoming
              ? 'rounded-bl-none'
              : ''
            : '',
        ),
      ]}>
      {contentAttributes && <EmailMeta {...{ contentAttributes, sender }} />}
      <MarkdownDisplay {...{ isIncoming, isOutgoing, isMessageFailed }} messageContent={text} />
      <Animated.View
        style={tailwind.style(
          'h-[21px] pt-[5px] pb-0.5 flex flex-row items-center justify-end',
        )}>
        <Text
          style={tailwind.style(
            'text-xs font-inter-420-20 tracking-[0.32px] pr-1',
            timestampTextStyle, // Aplicar cor do timestamp
          )}>
          {unixTimestampToReadableTime(timeStamp)}
        </Text>
        <DeliveryStatus
          isPrivate={isPrivate}
          status={status}
          messageType={messageType}
          channel={channel}
          sourceId={sourceId}
          errorMessage={errorMessage}
          deliveredColor={deliveryStatusColor} // Aplicar cor temática
          sentColor={deliveryStatusColor} // Aplicar cor temática
        />
      </Animated.View>
    </Animated.View>
  );
};
