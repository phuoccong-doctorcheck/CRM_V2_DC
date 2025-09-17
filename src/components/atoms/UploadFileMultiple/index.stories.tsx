import { Story, Meta } from '@storybook/react';
import React from 'react';

import UploadFile from '.';

export default {
  title: 'Components/atoms/UploadFile',
  component: UploadFile,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{ margin: 30 }}>
    <UploadFile />
  </div>
);
