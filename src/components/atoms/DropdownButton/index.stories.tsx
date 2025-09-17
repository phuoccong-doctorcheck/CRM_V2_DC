import { Story, Meta } from '@storybook/react';
import React from 'react';

import DropdownButton from '.';

export default {
  title: 'Components/atoms/DropdownButton',
  component: DropdownButton,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <DropdownButton textButton="Hello world">
    <a>a</a>
    <a>1</a>
    <a>2</a>
    <a>3</a>
    <a>4</a>
  </DropdownButton>
);
