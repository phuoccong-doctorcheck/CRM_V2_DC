/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-array-index-key */
import { Select } from 'antd';
import { DropdownData } from 'components/atoms/Dropdown';
import Typography from 'components/atoms/Typography';
import React from 'react';
import mapModifiers from 'utils/functions';

const { Option } = Select;
type Variant = 'style' | 'normal' | 'simple';
type Filter = 'label' | 'value';
type Modes = 'multiple' | 'tags';

interface MultiSelectProps {
  option?: DropdownData[];
  handleChange?: (item: any) => void;
  placeholder?: string;
  lable?: string;
  isFlex?: boolean;
  variant?: Variant;
  typeFilter?: Filter;
  value?: string | string[] | number | number[];
  defaultValue?: string | string[] | number | number[];
  mode?: Modes;
  handleBlur?: (item: any) => void;  // Thêm thuộc tính onBlur cho props
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  option, handleChange, placeholder, lable, isFlex, variant, value, defaultValue, mode, handleBlur 
}) => (
  <div className={mapModifiers('m-multi_select', isFlex && 'flex', variant)}>
    {lable && (
      <div className="m-multi_select_label">
        <Typography content={lable} modifiers={['jet', '16x24', '400', 'capitalize']} />
      </div>
    )}
    <Select
      mode={mode}
      placeholder={placeholder}
      onChange={
        (value: any, option: any) => {
          if (handleChange) {
            if (handleChange)
              handleChange(mode === 'multiple' ? option : value);

          }
        }
      }
        onBlur={(e) => {  // Thêm sự kiện onBlur với đối số
        if (handleBlur) {
          handleBlur(e);  // Truyền event hoặc giá trị vào handleBlur
        }
      }}
      value={value}
      defaultValue={defaultValue}
      optionFilterProp="label"
      options={option}
      onSearch={(value: string) => {
      }}
    />
  </div >
);

MultiSelect.defaultProps = {
  isFlex: false,
  typeFilter: 'label',
  mode: 'multiple'
};

export default MultiSelect;
