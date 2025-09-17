import { Story, Meta } from '@storybook/react';
import React from 'react';

import AffiliateSocial from '.';

export default {
  title: 'Components/templates/AffiliateSocial',
  component: AffiliateSocial,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <AffiliateSocial />
);
