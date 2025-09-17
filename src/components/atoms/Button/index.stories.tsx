import { Story, Meta } from '@storybook/react';
import { IconName, IconSize } from 'components/atoms/Icon';
import React from 'react';

import Button from '.';

export default {
  title: 'Components/atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['primary'],
      },
      defaultValue: 'primary',
    },
    sizes: {
      control: {
        type: 'select',
        options: ['h30', 'h36', 'h56'],
      },
      defaultValue: 'h36',
    },
    iconName: {
      control: {
        type: 'select',
        options: ['search', 'nextBlue', 'nextWhite'],
      },
    },
    iconSize: {
      control: {
        type: 'select',
        options: ['10x10', '14x14', '16x16', '18x18', '20x15', '20x20'],
      },
    },
    textButton: {
      control: {
        type: 'text',
      },
      defaultValue: 'Click me',
    },
    textAndIconSpacing: {
      control: {
        type: 'number',
      },
      defaultValue: 13,
    },
    loading: {
      control: {
        type: 'boolean',
        options: [false, true],
      },
      defaultValue: false,
    },
    disabled: {
      control: {
        type: 'boolean',
        options: [false, true],
      },
      defaultValue: false,
    },
    handleClick: { action: 'clicked' },
  },
} as Meta;

export const normal: Story = ({
  variant, sizes, iconName, iconSize, textAndIconSpacing,
  textButton, loading, handleClick, disabled,
}) => (
  <Button
    isLoading={loading}
    modifiers={[variant, sizes]}
    iconName={iconName as IconName}
    iconSize={iconSize as IconSize}
    textAndIconSpacing={textAndIconSpacing}
    onClick={handleClick}
    disabled={disabled}
  >
    {textButton}
  </Button>
);
