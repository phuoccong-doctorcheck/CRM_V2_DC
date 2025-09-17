import { Story, Meta } from '@storybook/react';
import React from 'react';

import InfoMessage from '.';

export default {
  title: 'Components/organisms/InfoMessage',
  component: InfoMessage,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <InfoMessage />
);
