import { Story, Meta } from '@storybook/react';
import React from 'react';

import RangePoint from '.';

export default {
  title: 'Components/atoms/RangePoint',
  component: RangePoint,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <RangePoint />
);
