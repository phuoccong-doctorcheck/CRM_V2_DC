import { Story, Meta } from '@storybook/react';
import React from 'react';

import Telephone from '.';

export default {
  title: 'Components/templates/Telephone',
  component: Telephone,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <Telephone />
);
