import { Story, Meta } from '@storybook/react';
import React from 'react';

import PublicHeaderStatistic from '.';

export default {
  title: 'Components/templates/PublicHeaderStatistic',
  component: PublicHeaderStatistic,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <PublicHeaderStatistic valueRangeDate={{
    from: undefined,
    to: undefined
  }} />
);
