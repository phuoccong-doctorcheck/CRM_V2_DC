/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { Select } from 'antd';
import React from 'react';
import mapModifiers from 'utils/functions';

import Typography from '../Typography';

const { Option } = Select;

export type AddressData = {
  key?: string;
  label: React.ReactNode;
  value: string;
  [x: string]: any;
};

type Variant = 'style' | 'normal' | 'simple';

interface AddressDropdownProps {
  AddressOption: AddressData[];
  placeholder?: string;
  label?: string;
  values?: AddressData;
  defaulValues?: AddressData;
  handleSelect?: (id: string, item: AddressData) => void;
  variant?: Variant;
}

const AddressDropdown: React.FC<AddressDropdownProps> = ({
  AddressOption, placeholder, label, values, handleSelect, variant = "normal", defaulValues,
}) => (
  <div className={mapModifiers('a-dropdown_address', variant)}>
    <div className={mapModifiers('a-dropdown_address_label')} style={{marginBottom:"4px"}}>
      <Typography content={label} modifiers={['400', '14x21', 'capitalize']} />
    </div>
    <Select
      onSelect={(value, option: AddressData) => {
        if (handleSelect) handleSelect(value as unknown as string, option);
      }}
      value={values}
      placeholder={placeholder}
      defaultValue={defaulValues}
      optionFilterProp="children"
      showSearch
      filterOption={(input, option) => {
        return ((option?.children ?? '').toLowerCase()).includes(input.toLowerCase())
      }}
    >
      {AddressOption.length && AddressOption.map((item) => (
        <Option
          key={item.key}
          value={item.value}
        >
          {item.label}
        </Option>
      ))}
    </Select>
  </div>
);

// AddressDropdown.defaultProps = {
//   variant: 'normal',
// };

export default AddressDropdown;
