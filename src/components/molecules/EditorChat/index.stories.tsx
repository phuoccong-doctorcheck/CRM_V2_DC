import { Story, Meta } from '@storybook/react';
import React from 'react';

import EditorChat from '.';

export default {
  title: 'Components/molecules/EditorChat',
  component: EditorChat,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <EditorChat />
);
