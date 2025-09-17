/* eslint-disable prefer-const */
import { Story, Meta } from '@storybook/react';
import React from 'react';

import CSteps from '.';

export default {
  title: 'Components/organisms/CSteps',
  component: CSteps,
  argTypes: {},
} as Meta;

const steps = [
  {
    name: 'First',
    component: <p>1</p>,
  },
  {
    name: 'Second',
    component: <p>1</p>,
  },
  {
    name: 'Last',
    component: <p>1</p>,
  },
];

export const normal: Story = () => {
  let number = 0;
  return (
    <CSteps options={steps} active={number} />
  );
};
