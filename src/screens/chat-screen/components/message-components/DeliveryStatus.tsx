import React from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { BottomSheetModal, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';

import { BottomSheetBackdrop, BottomSheetWrapper } from '@/components-next';
import { tailwind } from '@/theme';
import { DoubleCheckIcon, WarningIcon, MessagePendingIcon } from '@/svg-icons';
import { Icon } from '@/components-next/common';
import { MessageStatus, MessageType } from '@/types';
import { Channel } from '@/types';
import { INBOX_TYPES, MESSAGE_TYPES, MESSAGE_STATUS } from '@/constants';
import { ErrorInformation } from './ErrorInformation';
import { useRefsContext } from '@/context';
import { useBottomSheetThemeProps } from '@/hooks/useBottomSheetThemeProps';

type DeliveryStatusProps = {
  channel?: Channel;
  isPrivate: boolean;
  sourceId?: string | null;
  status: MessageStatus;
  messageType: MessageType;
  deliveredColor?: string;
  readColor?: string;
  sentColor?: string;
  errorMessage: string;
};

export const DeliveryStatus = (props: DeliveryStatusProps) => {
  const {
    channel,
    isPrivate,
    status,
    messageType,
    sourceId,
    deliveredColor,
    sentColor,
    errorMessage,
  } = props;
  const colorScheme = useColorScheme();
  const { backgroundStyle, handleIndicatorStyle: bottomSheetHandleIndicatorStyle } = useBottomSheetThemeProps();

  const { deliveryStatusSheetRef } = useRefsContext();

  const isDelivered = status === MESSAGE_STATUS.DELIVERED;
  const isRead = status === MESSAGE_STATUS.READ;
  const isSent = status === MESSAGE_STATUS.SENT;
  const isFailed = status === MESSAGE_STATUS.FAILED;
  const isEmailChannel = channel === INBOX_TYPES.EMAIL;
  const isAWhatsappChannel = channel === INBOX_TYPES.TWILIO || channel === INBOX_TYPES.WHATSAPP;
  const isATelegramChannel = channel === INBOX_TYPES.TELEGRAM;
  const isATwilioChannel = channel === INBOX_TYPES.TWILIO;
  const isAFacebookChannel = channel === INBOX_TYPES.FB;
  const isAWebWidgetChannel = channel === INBOX_TYPES.WEB;
  const isTemplate = messageType === MESSAGE_TYPES.TEMPLATE;
  const isASmsInbox = channel === INBOX_TYPES.SMS;
  const isAPIChannel = channel === INBOX_TYPES.API;
  const isPending = status === MESSAGE_STATUS.PROGRESS;
  const isOutgoing = messageType === MESSAGE_TYPES.OUTGOING;
  const shouldShowStatusIndicator =
    (messageType === MESSAGE_TYPES.OUTGOING || isTemplate) && !isPrivate;
  const isALineChannel = channel === INBOX_TYPES.LINE;

  const animationConfigs = useBottomSheetSpringConfigs({
    mass: 1,
    stiffness: 420,
    damping: 30,
  });

  const showSentIndicator = () => {
    if (!shouldShowStatusIndicator) {
      return false;
    }

    if (isEmailChannel) {
      return !!sourceId;
    }

    if (
      isAWhatsappChannel ||
      isATwilioChannel ||
      isAFacebookChannel ||
      isATelegramChannel ||
      isASmsInbox
    ) {
      return sourceId && isSent;
    }
    if (isALineChannel) {
      return true;
    }

    return false;
  };

  const showDeliveredIndicator = () => {
    if (!shouldShowStatusIndicator) {
      return false;
    }
    if (isAWhatsappChannel || isATwilioChannel || isAFacebookChannel || isASmsInbox) {
      return sourceId && isDelivered;
    }

    if (isAWebWidgetChannel || isAPIChannel) {
      return isSent;
    }

    if (isALineChannel) {
      return isDelivered;
    }

    return false;
  };

  const showReadIndicator = () => {
    if (!shouldShowStatusIndicator) {
      return false;
    }
    if (isAWebWidgetChannel || isAPIChannel) {
      return isRead;
    }

    if (isAWhatsappChannel || isATwilioChannel || isAFacebookChannel) {
      return sourceId && isRead;
    }

    return false;
  };

  const pendingIconColor = isOutgoing
    ? colorScheme === 'dark'
      ? tailwind.color('text-whiteA-A12')
      : tailwind.color('text-blackA-A12')
    : tailwind.color('text-whiteA-A12');

  const readIconColor =
    colorScheme === 'dark'
      ? tailwind.color('text-brand-primary-dark')
      : tailwind.color('text-brand-primary');

  const defaultSentDeliveredColor =
    (colorScheme === 'dark'
      ? tailwind.color('text-whiteA-A12')
      : tailwind.color('text-whiteA-A12')) ?? '#858585';

  if (isPending) {
    return <Icon icon={<MessagePendingIcon />} stroke={pendingIconColor} size={14} />;
  }

  if (isFailed) {
    return (
      <Pressable onPress={() => deliveryStatusSheetRef.current?.present()}>
        <Icon icon={<WarningIcon />} stroke={tailwind.color('text-gray-50')} size={14} />
        <BottomSheetModal
          ref={deliveryStatusSheetRef}
          backdropComponent={BottomSheetBackdrop}
          backgroundStyle={backgroundStyle}
          handleIndicatorStyle={bottomSheetHandleIndicatorStyle}
          enablePanDownToClose
          animationConfigs={animationConfigs}
          handleStyle={tailwind.style('p-0 h-4 pt-[5px]')}
          style={tailwind.style('rounded-[26px] overflow-hidden')}
          snapPoints={['15%']}>
          <BottomSheetWrapper>
            <ErrorInformation errorMessage={errorMessage} />
          </BottomSheetWrapper>
        </BottomSheetModal>
      </Pressable>
    );
  }

  if (showReadIndicator()) {
    return <Icon icon={<DoubleCheckIcon renderSecondTick />} stroke={readIconColor} size={14} />;
  }

  if (showDeliveredIndicator()) {
    return (
      <Icon
        icon={<DoubleCheckIcon renderSecondTick={true} />}
        stroke={tailwind.color(deliveredColor ?? defaultSentDeliveredColor) ?? '#858585'}
        size={14}
      />
    );
  }

  if (showSentIndicator()) {
    return (
      <Icon
        icon={<DoubleCheckIcon />}
        stroke={tailwind.color(sentColor ?? defaultSentDeliveredColor) ?? '#858585'}
        size={14}
      />
    );
  }

  return null;
};
