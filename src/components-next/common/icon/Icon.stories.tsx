import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

import { ConversationIconFilled, ConversationIconOutline } from '@/svg-icons';

const meta = {
  title: 'Icon',
  component: Icon,
  args: {
          icon: <ConversationIconFilled color="black" />,    size: 'xl',
  },
  decorators: [
    Story => (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          padding: 16,
        }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

// Basic icon with default size
export const BasicIcon: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <Icon icon={<ConversationIconOutline color="black" />} />
    </View>
  ),
};

export const IconSizes: Story = {
  render: () => (
    <View style={{ gap: 32, alignItems: 'center' }}>
      <Icon icon={<ConversationIconOutline color="black" />} size={10} />
      <Icon icon={<ConversationIconOutline color="black" />} size={12} />
      <Icon icon={<ConversationIconOutline color="black" />} size={16} />
      <Icon icon={<ConversationIconOutline color="black" />} size={20} />
      <Icon icon={<ConversationIconOutline color="black" />} size={24} />
      <Icon icon={<ConversationIconOutline color="black" />} size={32} />
    </View>
  ),
};

// Filled vs Outline comparison
export const IconVariants: Story = {
  render: () => (
    <View style={{ gap: 16, flexDirection: 'row' }}>
      <Icon icon={<ConversationIconFilled color="black" />} size={24} />
      <Icon icon={<ConversationIconOutline color="black" />} size={24} />
    </View>
  ),
};
