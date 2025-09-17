import { Story, Meta } from '@storybook/react';
import React from 'react';

import SurveyQuestionnaire from '.';

export default {
  title: 'Components/organisms/SurveyQuestionnaire',
  component: SurveyQuestionnaire,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <SurveyQuestionnaire />
);
