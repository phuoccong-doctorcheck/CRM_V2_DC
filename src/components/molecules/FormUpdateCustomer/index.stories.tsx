import { Story, Meta } from '@storybook/react';
import React from 'react';

import FormAddCustomer from '.';

export default {
  title: 'Components/molecules/FormAddCustomer',
  component: FormAddCustomer,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <FormAddCustomer />
);
