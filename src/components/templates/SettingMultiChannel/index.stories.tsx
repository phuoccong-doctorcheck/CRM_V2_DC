import { Story, Meta } from '@storybook/react';
import React from 'react';

import SettingMultiChannel from '.';

export default {
  title: 'Components/templates/SettingMultiChannel',
  component: SettingMultiChannel,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <SettingMultiChannel />
);
