import { Story, Meta } from '@storybook/react';
import React from 'react';

import NotificationSetting from '.';

export default {
  title: 'Components/templates/NotificationSetting',
  component: NotificationSetting,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <NotificationSetting />
);
