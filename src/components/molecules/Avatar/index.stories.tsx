import { Story, Meta } from '@storybook/react';
import React from 'react';

import Avatar from '.';

export default {
  title: 'Components/molecules/Avatar',
  component: Avatar,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <Avatar />
);
