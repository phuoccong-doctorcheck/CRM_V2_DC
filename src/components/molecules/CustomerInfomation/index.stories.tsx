import { Story, Meta } from '@storybook/react';
import React from 'react';

import CustomerInformation from '.';

export default {
  title: 'Components/molecules/CustomerInfomation',
  component: CustomerInformation,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CustomerInformation />
);
