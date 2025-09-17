import { Story, Meta } from '@storybook/react';
import React from 'react';

import FamilyMembers from '.';

export default {
  title: 'Components/templates/FamilyMembers',
  component: FamilyMembers,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <FamilyMembers />
);
