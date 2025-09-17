import { Story, Meta } from '@storybook/react';
import React from 'react';

import FloatFilter from '.';

export default {
  title: 'Components/molecules/FloatFilter',
  component: FloatFilter,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div
    style={{
      position: 'relative',
      width: '90vw',
      height: '90vh',
      margin: 20,
    }}
  >
    <FloatFilter headerTitle='Hello world' open={true}>
      <div>
        <li>text - <button>222</button></li>
        <li>text - <button>222</button></li>
        <li>text - <button>222</button></li>
        <li>text - <button>222</button></li>
        <li>text - <button>222</button></li>
        <li>text - <button>222</button></li>
        <li>text - <button>222</button></li>
        <li>text - <button>222</button></li>
        <li>text - <button>222</button></li>
        <li>text - <button>222</button></li>
      </div>
    </FloatFilter>
  </div>
);
