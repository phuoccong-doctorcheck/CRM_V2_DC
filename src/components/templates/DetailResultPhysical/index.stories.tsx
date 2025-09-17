import { Story, Meta } from '@storybook/react';
import React from 'react';

import DetailResultPhysical from '.';

export default {
  title: 'Components/templates/DetailResultPhysical',
  component: DetailResultPhysical,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <DetailResultPhysical id={''} />
);
