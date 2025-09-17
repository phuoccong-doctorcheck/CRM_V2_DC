import { Story, Meta } from '@storybook/react';
import React from 'react';

import ListJobInteractCustomer from '.';

export default {
  title: 'Components/templates/ListJobInteractCustomer',
  component: ListJobInteractCustomer,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ListJobInteractCustomer customer_id={''} />
);
