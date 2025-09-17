import { Story, Meta } from '@storybook/react';
import React from 'react';

import { SipProvider } from '.';


export default {
  title: 'Components/templates/SipProvider',
  component: SipProvider,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <SipProvider />
);
