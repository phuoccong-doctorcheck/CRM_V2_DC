import { Story, Meta } from '@storybook/react';
import React from 'react';

import ListCallHistory from '.';

export default {
  title: 'Components/organisms/ListCallHistory',
  component: ListCallHistory,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ListCallHistory id={''} />
);
