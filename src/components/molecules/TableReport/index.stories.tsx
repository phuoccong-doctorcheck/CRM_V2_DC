import { Story, Meta } from '@storybook/react';
import React from 'react';

import TableReport from '.';

export default {
  title: 'Components/molecules/TableReport',
  component: TableReport,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <TableReport />
);
