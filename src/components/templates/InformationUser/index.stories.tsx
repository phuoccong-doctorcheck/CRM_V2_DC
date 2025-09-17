import { Story, Meta } from '@storybook/react';
import React from 'react';

import InformationUser from '.';

export default {
  title: 'Components/templates/InformationUser',
  component: InformationUser,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <InformationUser />
);
