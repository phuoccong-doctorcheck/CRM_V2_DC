import { Story, Meta } from '@storybook/react';
import React from 'react';

import ChartReportCompare from '.';

export default {
  title: 'Components/molecules/ChartReportCompare',
  component: ChartReportCompare,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ChartReportCompare />
);
