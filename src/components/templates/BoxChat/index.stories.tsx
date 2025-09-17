import { Story, Meta } from '@storybook/react';
import React from 'react';

import BoxChat from '.';

export default {
  title: 'Components/templates/BoxChat',
  component: BoxChat,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <BoxChat />
);
