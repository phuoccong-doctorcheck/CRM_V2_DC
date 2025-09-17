import { Story, Meta } from '@storybook/react';
import React from 'react';

import LibralySupport from '.';

export default {
  title: 'Components/templates/LibralySupport',
  component: LibralySupport,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <LibralySupport />
);
