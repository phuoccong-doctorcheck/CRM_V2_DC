import { Story, Meta } from '@storybook/react';
import React from 'react';

import CDatePickers from '.';

export default {
  title: 'Components/atoms/CDatePickers',
  component: CDatePickers,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CDatePickers value={new Date()} />
);
