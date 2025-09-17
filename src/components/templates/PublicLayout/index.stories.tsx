import { Story, Meta } from '@storybook/react';
import React from 'react';

import PublicLayout from '.';

export default {
  title: 'Components/templates/PublicLayout',
  component: PublicLayout,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <PublicLayout />
);
