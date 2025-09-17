import { Story, Meta } from '@storybook/react';
import React from 'react';

import InputLink from '.';

export default {
  title: 'Components/atoms/InputLink',
  component: InputLink,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <InputLink lable="Liên kết mạng xã hội" />
);
