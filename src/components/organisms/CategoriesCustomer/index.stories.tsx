import { Story, Meta } from '@storybook/react';
import React from 'react';

import CategoriesCustomer from '.';

export default {
  title: 'Components/organisms/CategoriesCustomer',
  component: CategoriesCustomer,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CategoriesCustomer id='' />
);
