/* eslint-disable react-hooks/rules-of-hooks */
import { Story, Meta } from '@storybook/react';
import React from 'react';

import CDrawer from '.';

export default {
  title: 'Components/organisms/CDrawer',
  component: CDrawer,
  argTypes: {
    isOpen: {
      control: {
        type: 'boolean',
        options: [false, true],
      },
      defaultValue: false,
    },
    isRight: {
      control: {
        type: 'boolean',
        options: [false, true],
      },
      defaultValue: false,
    },
    widths: {
      control: {
        type: 'number',
      },
      defaultValue: 400,
    },
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Hello word',
    },
  },
} as Meta;

export const normal: Story = ({
  widths, title, isOpen,
}) => (
  <CDrawer
    isOpen={isOpen}
    widths={widths}
    title={title}
  >
    <p>1</p>
  </CDrawer>
);
