import { Story, Meta } from '@storybook/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Link from '.';

export default {
  title: 'Components/atoms/Link',
  component: Link,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <BrowserRouter>
    <Link href="/home">
      <span>Home</span>
    </Link>
    &nbsp;
    <Link href="/about">
      <span>About</span>
    </Link>
  </BrowserRouter>

);

export const useExternal: Story = () => (
  <BrowserRouter>
    <Link
      useExternal
      target="_blank"
      href="https://google.com.vn"
    >
      <span>Google</span>
    </Link>
  </BrowserRouter>
);
