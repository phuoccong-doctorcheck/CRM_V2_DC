import { Story, Meta } from '@storybook/react';
import React from 'react';

import CFloatButton from '.';

export default {
  title: 'Components/atoms/CFloatButton',
  component: CFloatButton,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CFloatButton option={[]} />
);
