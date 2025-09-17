import { Story, Meta } from '@storybook/react';
import React from 'react';

import ChangePassword from '.';

export default {
  title: 'Components/molecules/ChangePassword',
  component: ChangePassword,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ChangePassword />
);
