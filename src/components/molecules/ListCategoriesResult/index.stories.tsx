import { Story, Meta } from '@storybook/react';
import React from 'react';

import ListCategoriesResult from '.';

export default {
  title: 'Components/molecules/ListCategoriesResult',
  component: ListCategoriesResult,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ListCategoriesResult handleTitle={() => { }} />
);
