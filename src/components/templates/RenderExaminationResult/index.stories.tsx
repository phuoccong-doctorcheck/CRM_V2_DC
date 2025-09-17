import { Story, Meta } from '@storybook/react';
import React from 'react';

import RenderExaminationResult from '.';

export default {
  title: 'Components/templates/RenderExaminationResult',
  component: RenderExaminationResult,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <RenderExaminationResult />
);
