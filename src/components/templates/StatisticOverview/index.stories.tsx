import { Story, Meta } from '@storybook/react';
import React from 'react';

import StatisticOverview from '.';

export default {
  title: 'Components/templates/StatisticOverview',
  component: StatisticOverview,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <StatisticOverview />
);
