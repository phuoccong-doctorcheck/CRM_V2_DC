import { Story, Meta } from '@storybook/react';
import React from 'react';

import PortraitCustomer from '.';

export default {
  title: 'Components/templates/PortraitCustomer',
  component: PortraitCustomer,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <PortraitCustomer type={'CSTH'} data={undefined} customer_id={''} />
);
