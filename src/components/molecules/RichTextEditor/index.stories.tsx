/* eslint-disable import/no-named-as-default */
import { Story, Meta } from '@storybook/react';
import { templateExample } from 'assets/data';
import React from 'react';

import RichTextEditor from '.';

export default {
  title: 'Components/molecules/RichTextEditor',
  component: RichTextEditor,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{ padding: 40 }}>
    <RichTextEditor data={templateExample} notuseHeader />
  </div>
);
