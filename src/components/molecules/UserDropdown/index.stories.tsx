import { Story, Meta } from '@storybook/react';
import React from 'react';

import UserDropdown from '.';

export default {
  title: 'Components/molecules/UserDropdown',
  component: UserDropdown,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <UserDropdown optionsChild={[]} />
);
