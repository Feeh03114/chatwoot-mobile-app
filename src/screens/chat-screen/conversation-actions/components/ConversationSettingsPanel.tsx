import React, { useMemo } from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';
import Animated from 'react-native-reanimated';

import { tailwind } from '@/theme';
import { Agent, ConversationPriority, Team } from '@/types';
import AssigneePanel from './AssigneePanel';
import TeamPanel from './TeamPanel';
import PriorityPanel from './PriorityPanel';

type ConversationSettingsPanelProps = {
  priority: ConversationPriority;
  team: Team | null;
  assignee: Agent | null;
  onChangeAssignee: () => void;
  onChangeTeamAssignee: () => void;
  onChangePriority: () => void;
};

export const ConversationSettingsPanel = ({
  assignee,
  team,
  priority,
  onChangeAssignee,
  onChangeTeamAssignee,
  onChangePriority,
}: ConversationSettingsPanelProps) => {
  const colorScheme = useColorScheme();

  const listShadowStyle = useMemo(() => {
    return Platform.select({
      ios: {
        shadowColor: '#00000040',
        shadowOffset: { width: 0, height: 0.15 },
        shadowRadius: 2,
        shadowOpacity: 0.35,
        elevation: 2,
      },
      android: {
        elevation: 4,
        backgroundColor:
          colorScheme === 'dark'
            ? tailwind.color('grayDark-500')
            : tailwind.color('brand-background'),
      },
    }) || {};
  }, [colorScheme]);
  return (
    <Animated.View
      style={[
        tailwind.style('rounded-[13px] mx-4 bg-brand-background'),
        listShadowStyle,
      ]}>
      <AssigneePanel assignee={assignee} onPress={onChangeAssignee} />
      <TeamPanel team={team} onPress={onChangeTeamAssignee} />
      <PriorityPanel priority={priority} onPress={onChangePriority} />
    </Animated.View>
  );
};

