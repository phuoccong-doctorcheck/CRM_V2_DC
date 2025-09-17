import { Story, Meta } from '@storybook/react';
import React from 'react';

import CTabs from '.';

export default {
  title: 'Components/molecules/CTabs',
  component: CTabs,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CTabs
    options={[
      { key: '1', label: '1', children: '1' },
      { key: '2', label: '2', children: '2' },
      { key: '3', label: '3', children: '3' },
    ]}
    centered
    position="left"
  />
);
