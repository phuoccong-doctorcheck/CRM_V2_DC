import { Meta, Story } from '@storybook/react';
import React from 'react';

import Input from '.';

export default {
  title: 'Components/atoms/Input',
  component: Input,
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    disabled: {
      control: {
        type: 'boolean',
        options: [false, true],
      },
      defaultValue: false,
    },
    error: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
  },
} as Meta;

export const DefaultSimple: Story = ({
  label,
  disabled,
  error,
}) => (
  <div style={{ padding: 20, height: '100vh', background: '#e5e5e5' }}>
    <Input
      id="test"
      placeholder="Dummy placeholder"
      disabled={disabled}
      error={error}
      label={label}
      variant="simple"
    />
  </div>
);

export const BorderRadius: Story = ({
  label,
  disabled,
  error,
}) => (
  <div style={{ padding: 20, height: '100vh', background: '#e5e5e5' }}>
    <Input
      id="test"
      placeholder="Dummy placeholder"
      disabled={disabled}
      error={error}
      label={label}
      variant="borderRadius"
    />
  </div>
);

export const HasIcon: Story = ({
  label,
  disabled,
  type,
  error,
  variant,
}) => (
  <div style={{ padding: 20, height: '100vh', background: '#e5e5e5' }}>
    <Input
      id="test"
      placeholder="Dummy placeholder Dummy placeholder "
      disabled={disabled}
      type={type}
      error={error}
      label={label}
      variant={variant}
      iconName="search"
    />
  </div>
);

export const ContactForm: Story = ({
  label,
  disabled,
  error,
}) => (
  <div style={{ padding: 20, height: '100vh', background: '#e5e5e5' }}>
    <Input
      id="test"
      placeholder="Contact Form Test"
      disabled={disabled}
      error={error}
      label={label}
      variant="contactForm"
    />
  </div>
);
export const border8: Story = ({
  disabled,
  error,
}) => (
  <div style={{ padding: 20, height: '100vh', background: '#e5e5e5' }}>
    <Input
      id="test"
      placeholder="Contact Form Test"
      disabled={disabled}
      error={error}
      label="111"
      variant="border8"
    />
  </div>
);
