import { Story, Meta } from '@storybook/react';
import React from 'react';

import CustomerInfo from '.';

export default {
  title: 'Components/organisms/CustomerInfo',
  component: CustomerInfo,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CustomerInfo dataCustomer={undefined as any} />
);
