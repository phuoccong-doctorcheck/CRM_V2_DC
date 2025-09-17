import { Story, Meta } from '@storybook/react';
import React from 'react';

import RenderMedicalRecord from '.';

export default {
  title: 'Components/molecules/RenderMedicalRecord',
  component: RenderMedicalRecord,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <RenderMedicalRecord />
);
