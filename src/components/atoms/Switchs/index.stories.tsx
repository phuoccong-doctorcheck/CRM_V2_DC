import { Story, Meta } from '@storybook/react';
import React, { } from 'react';

import Switchs from '.';

export default {
  title: 'Components/atoms/Switchs',
  component: Switchs,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{ margin: 30 }}>
    <Switchs
      label="Xem số người chứ tương tác"
      textOn="Bật lọc số người chưa tương tác"
      textOff="Tắt lọc số người chưa tương tác"
    />
  </div>
);
