import { Story, Meta } from '@storybook/react';
import React from 'react';

import LinkedAccountSetting from '.';

export default {
  title: 'Components/templates/LinkedAccountSetting',
  component: LinkedAccountSetting,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <LinkedAccountSetting />
);
