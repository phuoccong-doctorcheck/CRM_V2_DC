import { Story, Meta } from '@storybook/react';
import React from 'react';

import ResultCampaignSms from '.';

export default {
  title: 'Components/organisms/ResultCampaignSms',
  component: ResultCampaignSms,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ResultCampaignSms
    listCampaignDetail={[]}
  />
);
