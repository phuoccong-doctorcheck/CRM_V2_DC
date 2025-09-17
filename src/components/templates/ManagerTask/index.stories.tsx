import { Story, Meta } from '@storybook/react';
import React from 'react';

import ManagerTask from '.';

export default {
  title: 'Components/templates/ManagerTask',
  component: ManagerTask,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ManagerTask />
);
