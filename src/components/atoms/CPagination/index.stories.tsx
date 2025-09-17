import { Story, Meta } from '@storybook/react';
import React from 'react';

import CPagination from '.';

export default {
  title: 'Components/atoms/CPagination',
  component: CPagination,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CPagination total={100} pageSize={20} pageSizeOptions={[10, 20, 30, 40, 50]} simple disabled current={1} />
);
