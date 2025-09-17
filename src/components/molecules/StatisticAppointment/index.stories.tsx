import { Story, Meta } from '@storybook/react';
import React from 'react';

import StatisticAppointment from '.';

export default {
  title: 'Components/molecules/StatisticAppointment',
  component: StatisticAppointment,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <StatisticAppointment />
);
