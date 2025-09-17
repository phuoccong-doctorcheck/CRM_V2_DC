import { Story, Meta } from '@storybook/react';
import React from 'react';

import StatisticBoxItem from '.';

export default {
  title: 'Components/atoms/StatisticBoxItem',
  component: StatisticBoxItem,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{ padding: 20 }}>

    <StatisticBoxItem />
  </div>
);
