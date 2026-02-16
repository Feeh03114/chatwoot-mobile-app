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

type ConversationActionOptionConfig = ConversationActionOptionsType & {
  darkBackgroundActionColor: string;
  darkBackgroundActionPressedColor: string;
  darkBorderActionColor: string;
};

const conversationActionOptions = (colorScheme: 'light' | 'dark' | null | undefined): ConversationActionOptionConfig[] => [
  {
    backgroundActionColor: 'bg-gray-100',
    backgroundActionPressedColor: 'bg-gray-200',
    borderActionColor: 'border-gray-700',
    darkBackgroundActionColor: 'bg-grayDark-100',
    darkBackgroundActionPressedColor: 'bg-grayDark-200',
    darkBorderActionColor: 'border-grayDark-700',
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
    darkBackgroundActionColor: 'bg-amberDark-100',
    darkBackgroundActionPressedColor: 'bg-amberDark-200',
    darkBorderActionColor: 'border-amberDark-700',
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
    darkBackgroundActionColor: 'bg-indigoDark-100',
    darkBackgroundActionPressedColor: 'bg-indigoDark-200',
    darkBorderActionColor: 'border-indigoDark-700',
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
    darkBackgroundActionColor: 'bg-greenDark-100',
    darkBackgroundActionPressedColor: 'bg-greenDark-200',
    darkBorderActionColor: 'border-greenDark-700',
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
  conversationAction: ConversationActionOptionConfig;
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

  const borderColorKey = colorScheme === 'dark'
    ? conversationAction.darkBorderActionColor.replace('border-', '')
    : conversationAction.borderActionColor.replace('border-', '');
  const actionBorderColor = tailwind.color(borderColorKey) ?? 'transparent';

  const activeActionContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(actionActive.value, [0, 1], ['transparent', actionBorderColor]),
    };
  });

  const bgColorClass = colorScheme === 'dark'
    ? conversationAction.darkBackgroundActionColor
    : conversationAction.backgroundActionColor;

  const bgPressedColorClass = colorScheme === 'dark'
    ? conversationAction.darkBackgroundActionPressedColor
    : conversationAction.backgroundActionPressedColor;

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
          tailwind.style(pressed ? bgPressedColorClass : bgColorClass),
        ]}
        onPress={handleActionOptionPress}
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
            'text-md font-inter-normal-20 leading-[17px] tracking-[0.32px] text-center pt-5 capitalize text-gray-950 dark:text-grayDark-950',
          )}>
          {conversationAction.actionText}
        </Animated.Text>
      </Pressable>
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
