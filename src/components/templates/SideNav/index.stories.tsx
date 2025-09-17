import { Story, Meta } from '@storybook/react';
import React from 'react';

import SideNav from '.';

export default {
  title: 'Components/templates/SideNav',
  component: SideNav,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <SideNav />
);
