import { Story, Meta } from '@storybook/react';
import React from 'react';

import TableReportGrowth from '.';

export default {
  title: 'Components/molecules/TableReportGrowth',
  component: TableReportGrowth,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <TableReportGrowth />
);
