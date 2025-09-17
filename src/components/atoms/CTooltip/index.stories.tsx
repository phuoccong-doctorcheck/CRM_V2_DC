import { Story, Meta } from '@storybook/react';
import React from 'react';

import CTooltip from '.';

export default {
  title: 'Components/atoms/CTooltip',
  component: CTooltip,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CTooltip placements="top" title="" />
);
