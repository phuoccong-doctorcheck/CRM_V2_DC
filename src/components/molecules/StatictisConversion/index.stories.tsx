import { Story, Meta } from '@storybook/react';
import React from 'react';

import StatictisConversion from '.';

export default {
  title: 'Components/molecules/StatictisConversion',
  component: StatictisConversion,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <StatictisConversion
    configStatisticConversionCS={{}}
    configStatisticCategoriesConversion={{}}
    dataRenderCategoryConversion={undefined} />
);
