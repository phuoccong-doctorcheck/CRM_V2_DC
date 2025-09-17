import { Story, Meta } from '@storybook/react';
import React from 'react';

import Loading from '.';

export default {
  title: 'Components/atoms/Loading',
  component: Loading,
  argTypes: {
    sizeSelected: {
      control: {
        type: 'select',
        options: [
          'large',
          'medium',
          'small',
        ],
      },
      defaultValue: '16x26',
    },
  },
} as Meta;

export const normal: Story = ({ sizeSelected }) => (
  <Loading variant="fullScreen" isShow size={sizeSelected} />
);
