import { Story, Meta } from '@storybook/react';
import React from 'react';

import Gallery from '.';

export default {
  title: 'Components/templates/Gallery',
  component: Gallery,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <Gallery />
);
