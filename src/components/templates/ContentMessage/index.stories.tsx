import { Story, Meta } from '@storybook/react';
import React from 'react';

import ContentMessage from '.';

export default {
  title: 'Components/templates/ContentMessage',
  component: ContentMessage,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ContentMessage />
);
