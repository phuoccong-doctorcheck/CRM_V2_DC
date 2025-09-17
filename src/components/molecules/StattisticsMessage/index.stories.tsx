import { Story, Meta } from '@storybook/react';
import React from 'react';

import StattisticsMessage from '.';

export default {
  title: 'Components/molecules/StattisticsMessage',
  component: StattisticsMessage,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <StattisticsMessage />
);
