/* eslint-disable max-len */
import { Input as CInput } from 'antd';
import { OptionCategorySearch } from 'assets/data';
import Icon, { IconName, IconSize } from 'components/atoms/Icon';
import React, { useState } from 'react';
import mapModifiers from 'utils/functions';

import Dropdown, { DropdownData } from '../Dropdown';

interface InputProps {
  variant?: 'default' | 'borderRadius' | 'contactForm' | 'inputSearch' | 'border8' | 'boxNote' | 'text_editor' | 'todo_list' | 'phone_number' | 'normal' | 'simple';
  type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'phone_number' | 'hide' | 'file';
  status?: 'error' | 'warning' | undefined;
  error?: string;
  label?: string;
  className?: string;
  placeholder?: string;
  suffix?: string;
  id?: string;
  iconName?: IconName;
  iconSize?: IconSize;
  handleClickIcon?: () => void;
  isPassword?: boolean;
  readOnly?: boolean;
  isFlex?: boolean;
  autoFocus?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  isRequired?: boolean;
  autoComplete?: boolean;
  ValDefault?: any,
  value?: string,
  ref?: any,
  isCategorySearch?: boolean;
  isTodo?: boolean;
  isPhoneNumber?: boolean;
  listTypeSearch?: DropdownData[];
  typeCategorySearch?: DropdownData;
  handlegetTypeCategorySearch?: (item: DropdownData) => void;
  handleEnter?: () => void;
  onChange?: (data: any) => void;
  onKeyPress?: (data: any) => void;
  isLoading?: boolean;
  isSearch?: boolean;
  isNotUseError?: boolean;
  count?: boolean;
}

const InputFZ: React.FC<InputProps> = ({ type, error, label, id, variant, iconName, iconSize, handleClickIcon, disabled, isPassword, readOnly, isRequired, ValDefault, isFlex, isCategorySearch, isTodo, value, suffix, className,
  listTypeSearch, handlegetTypeCategorySearch, typeCategorySearch, handleEnter, onChange, placeholder, status, isLoading, ref, autoComplete, multiple, autoFocus, isNotUseError, onKeyPress, isSearch, isPhoneNumber, count,
  ...props
},
) => {
  const [showpass, setShowPass] = useState(false);

  return (
    <div className={mapModifiers('a-input', className, variant, type, disabled && 'disabled', iconName && 'hasIcon', error && 'isError', readOnly && 'readOnly', isFlex && 'flexbox', isCategorySearch && 'search_categories', isLoading && 'loading', isSearch && 'search')} >
      {label && (
        <label style={{marginBottom:"4px"}} className={mapModifiers("a-input_label", isPhoneNumber && Number(value?.length) >= 10 && Number(value?.length) <= 12 && 'flex')} htmlFor={id}>
          {label}
          {isRequired && <span>*</span>}
          {
            isPhoneNumber && !error?.trim() && isRequired &&
            <span className={mapModifiers("a-input_label_count", Number(value?.length) === 10 && 'done')}>
              {Number(value?.length) < 10 ? 'Tối thiểu 10 kí tự' : ''}{Number(value?.length) > 12 ? 'Tối đa 12 kí tự' : ''} {Number(value?.length) >= 10 && Number(value?.length) <= 12 && <Icon iconName="done_circle" size="14x14" />}
            </span>
          }
        </label>
      )}
      <div className={mapModifiers('a-input_wrap', !!isCategorySearch && 'categories', type === 'phone_number' && 'phone_number', variant === 'todo_list' && 'todo_list')}>
        {
          isCategorySearch && (
            <Dropdown
              defaultValue={((listTypeSearch || [])[0]) || OptionCategorySearch[0]}
              values={typeCategorySearch || (listTypeSearch || [])[0]}
              dropdownOption={listTypeSearch || OptionCategorySearch}
              handleSelect={(item) => { if (handlegetTypeCategorySearch) handlegetTypeCategorySearch(item); }}
            />
          )
        }
        <CInput
          {...props}
          id={id}
          className="a-input_input"
          type={isPassword && (showpass ? 'text' : 'password') || type}
          value={value}
          ref={ref}
          size="middle"
          showCount={isPhoneNumber}
          autoFocus={autoFocus}
          status={status}
          disabled={disabled}
          readOnly={readOnly}
          defaultValue={ValDefault}
          placeholder={placeholder}
          multiple={multiple}
          onChange={onChange}
          onKeyPress={onKeyPress}
          suffix={suffix}
          onKeyDown={(event) => {
            // thực hiện khi nhấn enter (13 là mã của phím enter) và phải có sự kiện được truyền vào
            if (event.keyCode === 13 && handleEnter) {
              event.preventDefault();
              handleEnter();
            }
          }}
        />
        {iconName && (
          <button
            className="a-input_icon"
            type="submit"
            onClick={() => {
              if (handleClickIcon && !disabled) handleClickIcon();
              if (isPassword) setShowPass(!showpass);
            }}
          >
            <Icon
              iconName={isLoading ? 'loading_crm' : (isPassword && (showpass ? 'showpass' : 'hidepass') || iconName)}
              size={iconSize}
            />
          </button>
        )}
        {isPassword && (
          <div
            className="a-input_icon"
            onClick={() => {
              if (handleClickIcon && !disabled) handleClickIcon();
              if (isPassword) setShowPass(!showpass);
            }}
          >
            <Icon
              iconName={isPassword && (showpass ? 'showpass' : 'hidepass') || iconName}
              size={iconSize}
            />
          </div>
        )}
      </div>
    
    </div>
  );

};
InputFZ.defaultProps = {
  type: 'text',
  iconSize: '17x17',
  variant: 'default',
  isPassword: false,
  status: undefined,
  isLoading: false,
  isNotUseError: false,
};

export default InputFZ;
