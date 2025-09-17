import { Story, Meta } from '@storybook/react';
import React from 'react';

import LoadingVoice from '.';

export default {
  title: 'Components/atoms/LoadingVoice',
  component: LoadingVoice,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{
    height: 200,
    width: 200,
    margin: 50,
    background: 'black',
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
  }}
  >
    <LoadingVoice />

  </div>
);
