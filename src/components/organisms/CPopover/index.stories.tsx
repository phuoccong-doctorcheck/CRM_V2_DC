import { Story, Meta } from '@storybook/react';
import React from 'react';

import CPopover from '.';

export default {
  title: 'Components/organisms/CPopover',
  component: CPopover,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{ padding: 120 }}>
    <CPopover title='Hello world' content={(<ul>
      <li>12</li>
      <li>34</li>
      <li>56</li>
      <li>78</li>
    </ul>)}>
      <button>hover</button>
    </CPopover>
  </div>
);
