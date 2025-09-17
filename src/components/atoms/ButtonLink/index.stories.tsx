import { Story, Meta } from '@storybook/react';
import React from 'react';

import ButtonLink from '.';

export default {
  title: 'Components/atoms/ButtonLink',
  component: ButtonLink,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{ margin: 30 }}>
    <ButtonLink />
  </div>
);
