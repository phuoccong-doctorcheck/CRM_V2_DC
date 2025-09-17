import { Story, Meta } from '@storybook/react';
import React from 'react';

import MenuItem from '.';

export default {
  title: 'Components/molecules/MenuItem',
  component: MenuItem,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <MenuItem optionMenu={[]} />
);
