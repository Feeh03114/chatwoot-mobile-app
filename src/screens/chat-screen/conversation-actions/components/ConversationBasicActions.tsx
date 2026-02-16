import React, { useEffect } from 'react';
import { Dimensions, Pressable, useColorScheme } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Icon } from '@/components-next';
import { OpenIcon, ResolvedFilledIcon, PendingFilledIcon, SnoozedFilledIcon } from '@/svg-icons';
import { tailwind } from '@/theme';
import { useHaptic, useScaleAnimation } from '@/utils';
import { ConversationStatus } from '@/types';

import { ConversationActionType } from '../ConversationActions';

type ConversationStateType = 'open' | 'pending' | 'snooze' | 'resolve';

type ConversationActionOptionsType = {
  backgroundActionColor: string;
  backgroundActionPressedColor: string;
  borderActionColor: string;
  actionIcon: React.JSX.Element;
  actionText: ConversationStateType;
  actionStatus: ConversationStatus | 'open';
  fillColor?: string;
  strokeColor?: string;
};

const SCREEN_WIDTH = Dimensions.get('screen').width;
const ACTION_WIDTH = (SCREEN_WIDTH - 32 - 12 * 3) / 4;

const conversationActionOptions = (colorScheme: 'light' | 'dark' | null | undefined): ConversationActionOptionsType[] => [
  {
    backgroundActionColor: 'bg-gray-100',
    backgroundActionPressedColor: 'bg-gray-200',
    borderActionColor: 'border-gray-700',
    actionIcon: <OpenIcon />,
    actionText: 'open',
    actionStatus: 'open',
    strokeColor:
      colorScheme === 'dark'
        ? tailwind.color('grayDark-700')
        : tailwind.color('gray-700'),
  },
  {
    backgroundActionColor: 'bg-amber-100',
    backgroundActionPressedColor: 'bg-amber-200',
    borderActionColor: 'border-amber-700',
    actionIcon: <PendingFilledIcon />,
    actionText: 'pending',
    actionStatus: 'pending',
    fillColor:
      colorScheme === 'dark'
        ? tailwind.color('amberDark-700')
        : tailwind.color('amber-700'),
  },
  {
    backgroundActionColor: 'bg-indigo-100',
    backgroundActionPressedColor: 'bg-indigo-200',
    borderActionColor: 'border-indigo-700',
    actionIcon: <SnoozedFilledIcon />,
    actionText: 'snooze',
    actionStatus: 'snoozed',
    fillColor:
      colorScheme === 'dark'
        ? tailwind.color('indigoDark-700')
        : tailwind.color('indigo-700'),
  },
  {
    backgroundActionColor: 'bg-green-100',
    backgroundActionPressedColor: 'bg-green-200',
    borderActionColor: 'border-green-700',
    actionIcon: <ResolvedFilledIcon />,
    actionText: 'resolve',
    actionStatus: 'resolved',
    fillColor:
      colorScheme === 'dark'
        ? tailwind.color('greenDark-700')
        : tailwind.color('green-700'),
  },
];

type ConversationActionOptionProps = {
  index: number;
  conversationAction: ConversationActionOptionsType;
  status: ConversationStatus | undefined;
  isMuted: boolean | false;
  updateConversationStatus: (type: ConversationActionType, status?: ConversationStatus) => void;
  colorScheme: 'light' | 'dark' | null | undefined;
};

const ConversationActionOption = (props: ConversationActionOptionProps) => {
  const { index, conversationAction, status, updateConversationStatus, isMuted, colorScheme } = props;

  const hapticSelection = useHaptic();

  const handleActionOptionPress = () => {
    hapticSelection?.();
    updateConversationStatus('status', conversationAction.actionStatus as ConversationStatus);
  };
  const actionActive = useSharedValue(0);

  const { handlers, animatedStyle } = useScaleAnimation();

  useEffect(() => {
    if (conversationAction.actionStatus === status) {
      actionActive.value = withSpring(1);
    } else {
      actionActive.value = withSpring(0);
    }
  }, [
    actionActive,
    conversationAction.actionStatus,
    conversationAction.actionText,
    status,
    isMuted,
  ]);

  const actionBorderColor =
    colorScheme === 'dark'
      ? tailwind.color(conversationAction.borderActionColor.replace('border-', '') + '-dark')
      : tailwind.color(conversationAction.borderActionColor.replace('border-', ''));

  const activeActionContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(actionActive.value, [0, 1], ['transparent', actionBorderColor ?? 'transparent']),
    };
  });

  const backgroundActionColor =
    colorScheme === 'dark'
      ? tailwind.style(
          conversationAction.backgroundActionColor.replace('bg-', 'bg-') + '-dark',
        ).backgroundColor
      : tailwind.style(conversationAction.backgroundActionColor).backgroundColor;

  const backgroundActionPressedColor =
    colorScheme === 'dark'
      ? tailwind.style(
          conversationAction.backgroundActionPressedColor.replace('bg-', 'bg-') + '-dark',
        ).backgroundColor
      : tailwind.style(conversationAction.backgroundActionPressedColor).backgroundColor;

  return (
    <Animated.View
      style={[
        tailwind.style('flex-1', index !== conversationActionOptions(colorScheme).length - 1 ? 'mr-3' : ''),
        animatedStyle,
      ]}>
      <Pressable
        key={index}
                  style={({ pressed }) => [
                    tailwind.style('flex items-center justify-between rounded-xl pt-7 pb-3', `w-[${ACTION_WIDTH}px]`),
                    {
                      backgroundColor: colorScheme === 'dark'
                        ? tailwind.color(conversationAction.backgroundActionColor.replace('bg-', 'bg-') + '-dark')
                        : tailwind.color(conversationAction.backgroundActionColor),
                    },
                    pressed && {
                      backgroundColor: colorScheme === 'dark'
                        ? tailwind.color(conversationAction.backgroundActionPressedColor.replace('bg-', 'bg-') + '-dark')
                        : tailwind.color(conversationAction.backgroundActionPressedColor),
                    },
                  ]}        onPress={handleActionOptionPress}
        {...handlers}>
        <Animated.View
          style={[
            tailwind.style('absolute inset-0 border-2 rounded-xl'),
            activeActionContainerStyle,
          ]}
        />
        <Icon
          icon={conversationAction.actionIcon}
          size={32}
          fill={conversationAction.fillColor}
          stroke={conversationAction.strokeColor}
        />
                  <Animated.Text
                    style={tailwind.style(
                      'text-md font-inter-normal-20 leading-[17px] tracking-[0.32px] text-center pt-5 capitalize',
                      colorScheme === 'dark' ? tailwind.color('text-grayDark-950') : tailwind.color('text-gray-950'),
                    )}>
                    {conversationAction.actionText}
                  </Animated.Text>      </Pressable>
    </Animated.View>
  );
};

type ConversationBasicActionsProps = {
  status: ConversationStatus | undefined;
  updateConversationStatus: (type: ConversationActionType, status?: ConversationStatus) => void;
  isMuted: boolean | false;
};

export const ConversationBasicActions = (props: ConversationBasicActionsProps) => {
  const { status, updateConversationStatus, isMuted } = props;
  const colorScheme = useColorScheme();

  return (
    <Animated.View style={tailwind.style('flex flex-row justify-around px-4 pt-5')}>
      {conversationActionOptions(colorScheme).map((conversationAction, index) => (
        <ConversationActionOption
          key={index}
          conversationAction={conversationAction}
          status={status}
          isMuted={isMuted}
          updateConversationStatus={updateConversationStatus}
          index={index}
          colorScheme={colorScheme}
        />
      ))}
    </Animated.View>
  );
};
