import { Story, Meta } from '@storybook/react';
import React from 'react';

import MultiSelect from '.';

export default {
  title: 'Components/molecules/MultiSelect',
  component: MultiSelect,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <MultiSelect option={[]} lable="Multi select" />
);
