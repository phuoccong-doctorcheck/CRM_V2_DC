/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePicker } from 'antd';
import locale from 'antd/lib/date-picker/locale/vi_VN';
import moment from 'moment';
import dayjs from 'dayjs';
import 'moment/locale/vi';
import 'dayjs/locale/vi';
import React, { useEffect } from 'react';

import Typography from '../Typography';

import mapModifiers from 'utils/functions';
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { localeVN } from 'utils/staticState';

dayjs.extend(weekday);
type Variant = 'style' | 'normal' | 'simple';
type Status = 'error' | 'warning' | undefined;

interface CDatePickersProps {
  handleOnChange?: (data: any, dateString?: string) => void;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  isFlex?: boolean;
  value?: any; // Accept null or undefined
  ValDefault?: Date | string; // Accept null or undefined
  variant?: Variant;
  isShowTime?: boolean;
  fomat?: string | string[];
  error?: string;
  status?: Status;
  autoFocus?: boolean;
  isNotConver?: boolean;
  isBirthDate?: boolean;
  multiple?: boolean;
  disabledDate?: any;
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  
  [x: string]: any;
}

const CDatePickers: React.FC<CDatePickersProps> = ({
  label, isRequired, placeholder, isFlex, handleOnChange, status, ValDefault, variant, isShowTime, fomat, error, value, autoFocus, isBirthDate, multiple,disabledDate ,picker, ...props
}) => {
  moment.locale('vi');
  dayjs.extend(localeData);
  const formattedValue = value ? (isBirthDate ? dayjs(moment(value)?.format('DDMMYYYY'), fomat as any) : dayjs(moment(value)?.format(fomat as any), fomat as any)) : undefined;
  const formattedDefault = ValDefault ? (isBirthDate ? dayjs(moment().format('DDMMYYYY'), fomat as any) : dayjs(moment(ValDefault).format(fomat as any), fomat as any)) : undefined;

  return (
    <div
      className={mapModifiers(
        'a-date_picker',
        isFlex && 'flex',
        variant,
        error && 'error'
      )}
    >
      <div className="a-date_picker_label" style={{marginBottom:"4px"}}>
        <Typography type='p' content={label} modifiers={['14x21', 'capitalize']} />
        {isRequired && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
      </div>
      <DatePicker
        disabledDate={disabledDate}
        allowClear
        locale={localeVN as any}
        autoFocus={autoFocus}
        showTime={
          isShowTime
            ? {
              format: 'HH:mm',
              minuteStep: 15,
              hideDisabledOptions: true,
               defaultValue: undefined, 
              disabledHours: () => {
                const disabledHours = [];
                for (let i = 0; i < 5; i++) {
                  disabledHours.push(i);
                }
                for (let i = 19; i < 24; i++) {
                  disabledHours.push(i);
                }
                return disabledHours;
              },
            }
            : undefined
        }
        placeholder={placeholder}
        status={status}
        value={formattedValue}
        defaultValue={formattedDefault}
        format={fomat || 'DD/MM/YYYY'}
        picker={picker}
        multiple={multiple}
        onChange={(date) => {
          if (handleOnChange) {
            handleOnChange(date);
          }
        }}
        {...props}
      />
      <p className="a-date_picker-error_title">{error}</p>
    </div>
  );
};

CDatePickers.defaultProps = {
  variant: 'normal',
  isShowTime: false,
  autoFocus: false,
  isBirthDate: false,
  status: undefined,
};

export default CDatePickers;