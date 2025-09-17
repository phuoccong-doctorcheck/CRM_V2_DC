import { Story, Meta } from '@storybook/react';
import React from 'react';

import CampaignTemplateSetting from '.';

export default {
  title: 'Components/templates/CampaignTemplateSetting',
  component: CampaignTemplateSetting,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CampaignTemplateSetting />
);
