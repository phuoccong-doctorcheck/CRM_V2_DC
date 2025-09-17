/* eslint-disable @typescript-eslint/no-unused-vars */
import { Story, Meta } from '@storybook/react';
import React from 'react';

import { DropdownData } from '../Dropdown';

import GroupRadio, { GroupRadioType } from '.';

export default {
  title: 'Components/atoms/GroupRadio',
  component: GroupRadio,
  argTypes: {},
} as Meta;

const ExampleRadioGroup: GroupRadioType[] = [
  {
    id: 0, label: 'high', value: '0', color: '#ccc', level: '1',
  },
  {
    id: 1, label: 'medium', value: '1', color: '#333', level: '2',
  },
  {
    id: 2, label: 'low', value: '2', color: '#4444', level: '3',
  },
];

export const normal: Story = () => (
  <GroupRadio options={ExampleRadioGroup} defaultVal={ExampleRadioGroup[0]} />
);
