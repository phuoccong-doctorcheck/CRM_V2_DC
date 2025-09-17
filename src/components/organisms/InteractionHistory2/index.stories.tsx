import { Story, Meta } from '@storybook/react';
import React from 'react';

import InteractionHistory from '.';

export default {
  title: 'Components/organisms/InteractionHistory',
  component: InteractionHistory,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <InteractionHistory options={[]} id='' />
);
