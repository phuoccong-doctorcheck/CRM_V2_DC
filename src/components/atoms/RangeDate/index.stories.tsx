import { Story, Meta } from '@storybook/react';
import React from 'react';

import RangeDate from '.';

export default {
  title: 'Components/atoms/RangeDate',
  component: RangeDate,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <RangeDate label="Hello world" />
);
