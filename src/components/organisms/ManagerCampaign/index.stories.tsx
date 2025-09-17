import { Story, Meta } from '@storybook/react';
import React from 'react';

import ManagerCampaign from '.';

export default {
  title: 'Components/organisms/ManagerCampaign',
  component: ManagerCampaign,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ManagerCampaign />
);
