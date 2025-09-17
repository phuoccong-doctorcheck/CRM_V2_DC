import { Story, Meta } from '@storybook/react';
import React from 'react';

import CSkeleton from '.';

export default {
  title: 'Components/atoms/CSkeleton',
  component: CSkeleton,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CSkeleton >
    <a>hhhhhhh</a>
  </CSkeleton>
);
