import { Story, Meta } from '@storybook/react';
import React from 'react';

import CEmojiPicker from '.';

export default {
  title: 'Components/molecules/CEmojiPicker',
  component: CEmojiPicker,
  argTypes: {
    typeEmoji: {
      control: {
        type: 'select',
        option: ['google', 'apple', 'facebook', 'twitter', 'native'],
      },
      defaultValue: 'google',
    },
  },
} as Meta;

export const normal: Story = ({ typeEmoji }) => (
  <CEmojiPicker typeEmoji={typeEmoji} />
);
