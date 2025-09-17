/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-indent */
import { Input } from 'antd';
import React from 'react';
import mapModifiers from 'utils/functions';

import Icon, { IconName, IconSize } from '../Icon';
import Typography from '../Typography';

const { TextArea: CTextArea } = Input;

type Variant = 'contact' | 'chat' | 'simple';

interface TextAreaProps {
  id: string;
  label?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  error?: string;
  colorError?: 'white';
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  handleOnchange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  modifiers?: GeneralTextStyle[];
  variant?: Variant,
  readOnly: boolean,
  onKeyPress?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler;
  isResize?: boolean,
  showCount?: boolean,
  iconName?: IconName;
  iconSize?: IconSize;
  handleClickIcon?: () => void;
  isEditor?: boolean;
  textAreaRef?: any;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: any;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  required,
  rows = 4,
  placeholder,
  error,
  colorError,
  value,
  disabled,
  handleOnchange = () => { },
  modifiers,
  variant,
  defaultValue,
  readOnly = false,
  onKeyPress,
  isResize,
  iconName,
  iconSize,
  handleClickIcon,
  isEditor = false,
  onKeyDown,
  textAreaRef,
  onFocus,
  onBlur,
  showCount,
  style,
  ...props
}) => (
  <div className={mapModifiers('a-textarea', modifiers, variant, isResize && 'resize', error && 'error',)}>
    {label && (
      <div className="a-textarea_label">
        <label htmlFor={id}>
          <Typography content={label} modifiers={['dimGray', '16x24', '400', 'capitalize']} />
        </label>
        {required && <span className="a-textarea_label-required">*</span>}
      </div>
    )}
    <CTextArea
      className={mapModifiers('a-textarea_input', error && 'error', modifiers, variant)}
      value={value}
      ref={textAreaRef}
      rows={rows}
      showCount={showCount}
      autoSize
      disabled={disabled}
      placeholder={placeholder}
      onChange={handleOnchange}
      id={id}
      readOnly={readOnly}
      onKeyPress={onKeyPress}
      onKeyDown={onKeyDown}
      defaultValue={defaultValue}
      {...props}
      onFocus={onFocus}
      onBlur={onBlur}
      style={style}

    />
    {iconName && (
      <button
        className="a-textarea_icon"
        type="submit"
        onClick={() => {
          if (handleClickIcon && !disabled) handleClickIcon();
        }}
      >
        <Icon
          iconName={iconName}
          size={iconSize}
        />
      </button>
    )}
    {error && (
      <span className={mapModifiers('a-textarea_error', colorError)}>
        {error}
      </span>
    )}
  </div>
);

export default TextArea;
