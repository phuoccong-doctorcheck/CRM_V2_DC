import { Story, Meta } from '@storybook/react';
import React from 'react';

import Checkbox, { CheckBoxProps } from '.';

export default {
  title: 'Components/atoms/Checkbox',
  component: Checkbox,
  args: {
    label: 'Checkbox',
  },
  argTypes: {},
} as Meta<CheckBoxProps>;

export const normal: Story<CheckBoxProps> = (args) => (
  <>
    <Checkbox {...args} />
    <Checkbox isCheckCustom {...args} />
  </>
);
