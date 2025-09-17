import { Story, Meta } from '@storybook/react';
import React from 'react';

import ModuleStatistic from '.';

export default {
  title: 'Components/templates/ModuleStatistic',
  component: ModuleStatistic,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ModuleStatistic moduleName={'appointment'} />
);
