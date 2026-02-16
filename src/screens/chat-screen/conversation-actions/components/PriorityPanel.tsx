import React from 'react';
import { Pressable, useColorScheme } from 'react-native';
import Animated from 'react-native-reanimated';
import { Icon } from '@/components-next';
import { CaretRight, PriorityIcon, NoPriorityIcon } from '@/svg-icons';
import { tailwind } from '@/theme';
import { ConversationPriority } from '@/types';
import i18n from '@/i18n';

type PriorityPanelProps = {
  priority: ConversationPriority;
  onPress: () => void;
};

const PriorityPanel = ({ priority, onPress }: PriorityPanelProps) => {
  const colorScheme = useColorScheme();
  const priorityName = priority ? priority : i18n.t('CONVERSATION.ACTIONS.PRIORITY.EMPTY');
  const iconColor =
    colorScheme === 'dark'
      ? tailwind.color('text-grayDark-700')
      : tailwind.color('text-gray-700');
  const PriorityIconColor =
    colorScheme === 'dark'
      ? tailwind.color('text-orangeDark-500')
      : tailwind.color('text-orange-500');
  const NoPriorityIconColor =
    colorScheme === 'dark'
      ? tailwind.color('text-grayDark-800')
      : tailwind.color('text-gray-300');

  const priorityAvatar = (priority: ConversationPriority) => {
    if (priority) {
      return <Icon icon={<PriorityIcon />} fill={PriorityIconColor} />;
    }
    return <Icon icon={<NoPriorityIcon />} fill={NoPriorityIconColor} />;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        tailwind.style(
          pressed ? 'bg-gray-100 dark:bg-grayDark-100' : '',
          'rounded-t-[13px]',
        ),
      ]}>
      <Animated.View style={tailwind.style('flex-row items-center justify-between pl-3')}>
        {priorityAvatar(priority)}
        <Animated.View
          style={tailwind.style(
            'flex-1 flex-row items-center justify-between py-[11px] ml-[10px] border-b-[1px] border-blackA-A3 dark:border-whiteA-A3',
          )}>
          <Animated.Text
            style={tailwind.style(
              'text-base font-inter-420-20 leading-[22.4px] tracking-[0.16px] text-gray-950 dark:text-grayDark-950 capitalize',
            )}>
            {priorityName}
          </Animated.Text>
          <Animated.View style={tailwind.style('flex-row items-center pr-3')}>
            <Animated.Text
              style={tailwind.style(
                'text-base font-inter-normal-20 leading-[22px] tracking-[0.16px] text-gray-900 dark:text-grayDark-900',
              )}>
              {i18n.t('CONVERSATION.ACTIONS.PRIORITY.EDIT')}
            </Animated.Text>
            <Icon icon={<CaretRight />} stroke={iconColor} size={20} />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default PriorityPanel;