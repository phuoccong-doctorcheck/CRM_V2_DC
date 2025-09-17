import { Story, Meta } from '@storybook/react';
import React from 'react';

import Image from '.';

export default {
  title: 'Components/atoms/Image',
  component: Image,
  argTypes: {
    srcImg: {
      control: {
        type: 'text',
      },
      defaultValue: 'https://source.unsplash.com/random',
    },
    ratio: {
      control: {
        type: 'select',
        options: ['1x1', '4x3', '16x9', '3x2', '300x100'],
      },
      defaultValue: '1x1',
    },
    size: {
      control: {
        type: 'select',
        options: ['cover', 'contain', 'inherit', 'initial'],
      },
      defaultValue: 'cover',
    },
    maxWidth: {
      control: {
        type: 'text',
      },
      defaultValue: '1000px',
    },
  },
} as Meta;

export const normal: Story = ({
  srcImg, ratio, maxWidth, size,
}) => (
  <div
    style={{
      maxWidth,
      width: '100%',
    }}
  >
    <Image src={srcImg} ratio={ratio} alt="image" size={size} />
  </div>
);
