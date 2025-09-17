import { Story, Meta } from '@storybook/react';
import React from 'react';

import TagSetting from '.';

export default {
  title: 'Components/templates/TagSetting',
  component: TagSetting,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <TagSetting />
);
