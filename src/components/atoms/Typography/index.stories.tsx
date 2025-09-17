import { Story, Meta } from '@storybook/react';
import React from 'react';

import Typography from '.';

export default {
  title: 'Components/atoms/Typography',
  component: Typography,
  argTypes: {
    isOneline: {
      control: {
        type: 'boolean',
        options: [true, false],
      },
    },
    type: {
      options: ['h1', 'h3', 'h4', 'h5', 'h6', 'p', 'span'],
      control: { type: 'select' },
      defaultValue: 'h1',
    },
    colors: {
      control: {
        type: 'select',
        options: [
          'white',
          'black',
          'blueNavy',
          'dimGray',
          'jet',
        ],
      },
      defaultValue: 'black',
    },
    fontweight: {
      control: {
        type: 'select',
        options: [
          '400',
          '700',
        ],
      },
      defaultValue: '700',
    },
    variants: {
      control: {
        type: 'radio',
        options: ['uppercase', 'capitalize', 'underline', 'italic', 'center', 'justify'],
      },
    },
    text: {
      control: {
        type: 'text',
      },
      defaultValue: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis minus eius vero, non ipsam nostrum. Minus praesentium ad unde, assumenda quam obcaecati vel, fuga magnam in quia libero magni aut?',
    },
    sizes: {
      options: ['24x29', '64x84'],
      control: {
        type: 'select',
      },
    },
  },
} as Meta;

export const normal: Story = ({
  sizes,
  colors,
  variants,
  text,
  fontweight,
  type,
  isOneline,
}) => (
  <Typography type={type} isOneLine={isOneline} modifiers={[colors, variants, sizes, fontweight]}>
    {text}
  </Typography>
);
