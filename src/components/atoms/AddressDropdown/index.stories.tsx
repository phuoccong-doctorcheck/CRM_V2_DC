import { Story, Meta } from '@storybook/react';
import { OptionCountry } from 'assets/data';

import AddressDropdown from '.';

export default {
  title: 'Components/atoms/AddressDropdown',
  component: AddressDropdown,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <AddressDropdown AddressOption={OptionCountry} />
);
