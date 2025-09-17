import { Story, Meta } from '@storybook/react';
import React from 'react';

import ExternalFile from '.';

export default {
  title: 'Components/templates/ExternalFile',
  component: ExternalFile,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ExternalFile />
);
