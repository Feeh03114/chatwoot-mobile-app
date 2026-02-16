import React from 'react';
import { Pressable, useColorScheme } from 'react-native';
import Animated from 'react-native-reanimated';
import { Avatar, Icon } from '@/components-next';
import { CaretRight, UnassignedIcon } from '@/svg-icons';
import { tailwind } from '@/theme';
import { Agent } from '@/types';
import i18n from '@/i18n';
type AssigneePanelProps = {
  assignee: Agent | null;
  onPress: () => void;
};
const AssigneePanel = ({ assignee, onPress }: AssigneePanelProps) => {
  const colorScheme = useColorScheme();
  const assigneeName = assignee ? assignee.name : i18n.t('CONVERSATION.ACTIONS.ASSIGNEE.EMPTY');
  const assigneeActionText = assignee
    ? i18n.t('CONVERSATION.ACTIONS.ASSIGNEE.EDIT')
    : i18n.t('CONVERSATION.ACTIONS.ASSIGNEE.ASSIGN');
  const iconColor =
    colorScheme === 'dark'
      ? tailwind.color('text-grayDark-700')
      : tailwind.color('text-gray-700');
  const UnassignedIconColor =
    colorScheme === 'dark'
      ? tailwind.color('text-grayDark-700')
      : tailwind.color('text-gray-700');
  const assigneeAvatar = (assignee: Agent | null) => {
    if (assignee) {
      return (
        <Avatar size={'md'} src={{ uri: assignee?.thumbnail || '' }} name={assignee?.name || ''} />
      );
    }
    return <Icon icon={<UnassignedIcon />} stroke={UnassignedIconColor} />;
  };
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        tailwind.style(pressed ? 'bg-gray-100 dark:bg-grayDark-100' : '', 'rounded-t-[13px]'),
      ]}>
      <Animated.View style={tailwind.style('flex-row items-center justify-between pl-3')}>
        {assigneeAvatar(assignee)}
        <Animated.View
          style={tailwind.style(
            'flex-1 flex-row items-center justify-between py-[11px] ml-[10px] border-b-[1px] border-blackA-A3 dark:border-whiteA-A3',
          )}>
          <Animated.Text
            style={tailwind.style(
              'text-base font-inter-420-20 leading-[22px] tracking-[0.16px] text-gray-950 dark:text-grayDark-950',
            )}>
            {assigneeName}
          </Animated.Text>
          <Animated.View style={tailwind.style('flex-row items-center pr-3')}>
            <Animated.Text
              style={tailwind.style(
                'text-base font-inter-normal-20 leading-[22px] tracking-[0.16px] text-gray-900 dark:text-grayDark-900',
              )}>
              {assigneeActionText}
            </Animated.Text>
            <Icon icon={<CaretRight />} stroke={iconColor} size={20} />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};
export default AssigneePanel;