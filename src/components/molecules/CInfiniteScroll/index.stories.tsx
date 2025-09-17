import { Story, Meta } from '@storybook/react';
import React from 'react';

import CInfiniteScroll from '.';

export default {
  title: 'Components/molecules/CInfiniteScroll',
  component: CInfiniteScroll,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <CInfiniteScroll dataLength={0} next={function (): void {
    throw new Error('Function not implemented.');
  }} hasMore={false} />
);
