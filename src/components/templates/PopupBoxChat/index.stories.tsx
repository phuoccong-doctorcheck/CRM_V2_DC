import { Story, Meta } from '@storybook/react';
import React from 'react';

import PopupBoxChat from '.';

export default {
  title: 'Components/templates/PopupBoxChat',
  component: PopupBoxChat,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <PopupBoxChat />
);
