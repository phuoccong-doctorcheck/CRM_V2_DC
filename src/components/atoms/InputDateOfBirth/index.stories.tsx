import { Story, Meta } from '@storybook/react';
import React from 'react';

import InputDateOfBirth from '.';

export default {
  title: 'Components/atoms/InputDateOfBirth',
  component: InputDateOfBirth,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <InputDateOfBirth
    handleOnChange={(val) => console.log(val)}
    label='ngày sinh'
    error=''
  />
);
