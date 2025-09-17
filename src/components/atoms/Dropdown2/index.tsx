/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import mapModifiers from 'utils/functions';

import CEmpty from '../CEmpty';
import Typography from '../Typography';

const { Option } = Select;

export type DropdownData = {
  id: number | string, label: string, value: string, [x: string]: any,
};
type Variant = 'style' | 'normal' | 'simple';
type StatusDropdown = 'error' | 'warning' | undefined;

interface DropdownProps {
  dropdownOption: DropdownData[];
  placeholder?: string;
  label?: string;
  values?: DropdownData;
  handleSelect?: (item: DropdownData) => void;
  // handleClear?: () => void;
  isFlex?: boolean;
  defaultValue?: DropdownData;
  isRequired?: boolean;
  variant?: Variant;
  isState?: boolean;
  error?: string;
  id?: string;
  className?: string;
  isClear?: boolean;
  disabled?: boolean;
  isColor?: boolean;
  allowClear?: boolean;
  isOpen?: boolean;
  openSelect?: boolean;
  setOpenSelect?: any
  positions?: any 
}

const Dropdown2: React.FC<DropdownProps> = ({
  dropdownOption, placeholder, label, values, handleSelect, id, className, isColor, allowClear,isOpen,openSelect,setOpenSelect,positions,
  isFlex, defaultValue, isRequired, variant, isState, error, isClear, disabled, ...props
}) => {
  const selectRef = useRef<any>(null);
  const [statusDropdown, setStateDropdown] = useState<StatusDropdown>(undefined);
  useEffect(() => {
    if ((!!error?.trim() && isRequired)) {
      setStateDropdown('error');
    } else {
      setStateDropdown(undefined);
    }
  }, [error, values]);

  const handleClear = () => {
    if (selectRef.current) {
      selectRef.current.clearValue();
    }
  };
  return (
    <div className={mapModifiers('a-dropdown', isFlex && 'flex', variant, isState && values?.id?.toString()?.toLowerCase(), error && 'error', isColor && 'color')}>
      <div style={{ display: 'flex', alignItems: 'center' }} className={(error && isRequired) ? 'a-dropdown_label_error' : 'a-dropdown_label'}>
        <Typography content={label} />
        {isRequired && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
      </div>
      
      {isOpen === true ? <Select
        ref={selectRef} // Gán ref cho Select
        onSelect={
          (value, option: any) => {
            const newOption = dropdownOption?.find(i => i?.value === option?.value)
            if (handleSelect) handleSelect(newOption as any);
          }
        }

        open={openSelect === undefined ? false : openSelect}
        onDropdownVisibleChange={(open) => setOpenSelect(open)}
        dropdownAlign={{
            points: ['c', 'bc'], // Căn chỉnh theo điểm trên bên trái của input với điểm dưới bên trái của dropdown
            offset: [0,  130], // Bạn có thể điều chỉnh giá trị offset để thay đổi vị trí của dropdown
        }}
        showSearch
        id={id}
        className={className}
        value={values}
        status={statusDropdown}
        placeholder={placeholder ?? ''}
        defaultValue={defaultValue}
        onClear={handleClear}
        disabled={disabled}
        optionFilterProp="children"
        filterOption={(input, option) => {
          return ((option?.children ?? '').toLowerCase()).includes(input.toLowerCase())
        }}
        allowClear={allowClear}
        {...props}
      >
        {!!dropdownOption.length && dropdownOption.map((item) => (
          <Option
            key={item?.id}
            value={item?.value}
          >
            {item?.label}
          </Option>
        ))}
      </Select> : <Select
        ref={selectRef} // Gán ref cho Select
        onSelect={
          (value, option: any) => {
            const newOption = dropdownOption?.find(i => i?.value === option?.value)
            if (handleSelect) handleSelect(newOption as any);
          }
        }
        showSearch
        id={id}
        className={className}
        value={values}
        status={statusDropdown}
        placeholder={placeholder ?? ''}
        defaultValue={defaultValue}
        onClear={handleClear}
        disabled={disabled}
        optionFilterProp="children"
        filterOption={(input, option) => {
          return ((option?.children ?? '').toLowerCase()).includes(input.toLowerCase())
        }}
        allowClear={allowClear}
        {...props}
      >
        {!!dropdownOption.length && dropdownOption.map((item) => (
          <Option
            key={item?.id}
            value={item?.value}
            disabled={item?.disabled}
          >
            {item?.label}
          </Option>
        ))}
      </Select>}
      {(!!error?.trim() && isRequired) && (
        <p className="a-dropdown_error">
          {error}
        </p>
      )}
    </div>
  );
};

Dropdown2.defaultProps = {
  variant: 'normal',
};

export default Dropdown2;
