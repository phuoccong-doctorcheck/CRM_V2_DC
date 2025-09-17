import { Story, Meta } from '@storybook/react';
import React from 'react';

import TextArea from '.';

export default {
  title: 'Components/atoms/TextArea',
  component: TextArea,
  argTypes: {
    rows: {
      control: 'select',
      options: ['2', '3', '4', '5', '6'],
    },
    error: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
      defaultValue: 'Nội dung',
    },
    disabled: {
      control: 'boolean',
      options: [true, false],
      defaultValue: false,
    },
  },
} as Meta;

export const normal: Story = ({
  rows, value, error, placeholder, disabled,
}) => (
  <div>
    <TextArea
      id="text-area"
      rows={rows}
      error={error}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      label="hiihi"
      readOnly={false}
    />
  </div>
);
