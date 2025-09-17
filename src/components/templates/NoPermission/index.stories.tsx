import { Story, Meta } from '@storybook/react';
import React from 'react';

import NoPermission from '.';

export default {
  title: 'Components/templates/NoPermission',
  component: NoPermission,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <NoPermission />
);
