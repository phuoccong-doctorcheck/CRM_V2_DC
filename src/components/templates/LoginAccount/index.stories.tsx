import { Story, Meta } from '@storybook/react';
import React from 'react';

import LoginAccount from '.';

export default {
  title: 'Components/templates/LoginAccount',
  component: LoginAccount,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <LoginAccount />
);
