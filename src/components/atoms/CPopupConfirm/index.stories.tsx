import { Story, Meta } from '@storybook/react';
import React from 'react';

import CPopupConfirm from '.';

export default {
  title: 'Components/atoms/CPopupConfirm',
  component: CPopupConfirm,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CPopupConfirm title="h1" desc="12" textOK="ok" textCancel="cancel" />
);
