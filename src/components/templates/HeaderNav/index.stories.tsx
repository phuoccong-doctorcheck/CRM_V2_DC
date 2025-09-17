import { Story, Meta } from '@storybook/react';
import React from 'react';

import HeaderNav from '.';

export default {
  title: 'Components/templates/HeaderNav',
  component: HeaderNav,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <HeaderNav
    handleClickMenuItem={() => { }}
  />
);
