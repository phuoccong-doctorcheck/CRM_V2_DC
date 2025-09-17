import { Story, Meta } from '@storybook/react';
import React from 'react';

import RenderChart from '.';

export default {
  title: 'Components/organisms/RenderChart',
  component: RenderChart,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <RenderChart option={undefined} />
);
