/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import mapModifiers from 'utils/functions';

interface InputDateOfBirthProps {
  label?: string;
  isRequired?: boolean;
  id?: string;
  isDisable?: boolean;
  handleOnChange?: (date: string) => void;
  error?: string;
  valueDefault?: string;
  onChangInput?: () => void;
}

const InputDateOfBirth: React.FC<InputDateOfBirthProps> = ({
  label, isRequired, id, isDisable, handleOnChange, error, valueDefault, onChangInput
}) => {

  const [values, setValues] = useState<string[]>(['', '', '']);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleChange = (value: string, index: number) => {
    if ((value.length > 4 && index === 2) || (value.length > 2 && index < 2)) {
      return;
    }

    // Focus next input if applicable
    if (value.length > 1 && index < 2 && refs[index + 1].current) {
      refs[index + 1].current?.focus();
    }

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    // Call onComplete if all values are filled
    if (handleOnChange)
      handleOnChange(newValues.join('-'));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Delete previous input value on backspace
    if (e.key === 'Backspace' && index > 0 && values[index] === '') {
      const newValues = [...values];
      newValues[index - 1] = '';
      setValues(newValues);
      refs[index - 1].current?.focus();
    }
  };

  useEffect(() => {
    const outputArray = valueDefault?.split("-");
    setValues(!valueDefault?.trim() ? ['', '', ''] : ((outputArray || []).some((i) => i === 'null') ? ['', '', ''] : outputArray as any));
  }, [valueDefault])

  return (
    <div className={mapModifiers('a-birth_day',
      error && 'error',
      isRequired && 'required',
    )}>
      {label && (
        <label style={{ marginBottom:"4px"}} className="a-birth_day_label" htmlFor={id}>
          {label}
          {isRequired && <span>*</span>}
        </label>
      )}
      <div className="a-birth_day_input">
        {values?.map((value, index) => {
          if (Number(index + 1) < values.length) {
            return (
              <p key={`${index}-${index}`}>
                <input
                  className="a-birth_day_input_input"
                  type="text"
                  inputMode="numeric"
                  placeholder={index === 0 ? 'Ngày' : 'Tháng'}
                  maxLength={2}
                  pattern="[0-9]*"
                  disabled={isDisable}
                  value={value}
                  onChange={(e) => {
                    if (index === 0 && Number(e.target.value) > 31) return;
                    if (index === 1 && Number(e.target.value) > 12) return;
                    handleChange(e.target.value, index)
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={refs[index]}
                /><span style={{ transform: 'scale(1.5)', margin: '0 4px' }}>/</span>
              </p >
            )
          }
          return (
            <input
              className="a-birth_day_input_input"
              key={`${index}-${index}`}
              type="text"
              placeholder='Năm'
              inputMode="numeric"
              maxLength={4}
              pattern="[0-9]*"
              disabled={isDisable}
              value={value ? value : ''}
              onChange={(e) => {
                handleChange(e.target.value.replace(/\D/g, ''), 2)
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={refs[index]}
            />
          )
        })}
      </div >
      {
        error ?
          <span className="a-birth_day_error">
            {error}
          </span>
          : null}
    </div >
  );
}

InputDateOfBirth.defaultProps = {
};

export default InputDateOfBirth;
