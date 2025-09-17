import { Story, Meta } from '@storybook/react';
import React from 'react';

import CEmpty from '.';

export default {
  title: 'Components/atoms/CEmpty',
  component: CEmpty,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CEmpty />
);
