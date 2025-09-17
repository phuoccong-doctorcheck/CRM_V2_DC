import { Story, Meta } from '@storybook/react';
import React from 'react';

import Dropdown, { DropdownData } from '.';

export default {
  title: 'Components/atoms/Dropdown',
  component: Dropdown,
  argTypes: {},
} as Meta;

const options = [
  { id: 0, value: 'chocolate', label: 'Chocolate' },
  { id: 1, value: 'strawberry', label: 'Strawberry' },
  { id: 2, value: 'vanilla', label: 'Vanilla' },
];

export const normal: Story = () => (
  <Dropdown dropdownOption={options as DropdownData[]} label="aaa" />
);
