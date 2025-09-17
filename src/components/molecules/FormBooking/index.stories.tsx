import { Story, Meta } from '@storybook/react';
import React from 'react';

import FormBooking from '.';

export default {
  title: 'Components/molecules/FormBooking',
  component: FormBooking,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <FormBooking />
);
