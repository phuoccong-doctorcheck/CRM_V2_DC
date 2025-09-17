import { Story, Meta } from '@storybook/react';
import React from 'react';

import FormAddMarketingCampaign from '.';

export default {
  title: 'Components/molecules/FormAddMarketingCampaign',
  component: FormAddMarketingCampaign,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <FormAddMarketingCampaign />
);
