import { Story, Meta } from '@storybook/react';
import React from 'react';

import ContactChannel from '.';

export default {
  title: 'Components/organisms/ContactChannel',
  component: ContactChannel,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ContactChannel
    listPageOption={undefined as any}
  />
);
