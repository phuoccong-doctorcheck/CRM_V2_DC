import { Story, Meta } from '@storybook/react';
import React from 'react';

import PriceList from '.';

export default {
  title: 'Components/templates/PriceList',
  component: PriceList,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <PriceList />
);
