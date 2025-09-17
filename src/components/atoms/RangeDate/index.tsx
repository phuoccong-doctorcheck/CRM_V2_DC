/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import 'moment/locale/vi';
import 'dayjs/locale/vi';
import { DatePicker } from 'antd';
import locale from 'antd/lib/date-picker/locale/vi_VN';
import dayjs, { Dayjs } from 'dayjs';
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import React from 'react';
import mapModifiers from 'utils/functions';
import { localeVN } from 'utils/staticState';

const { RangePicker } = DatePicker;

type Variant = 'style' | 'normal' | 'simple';
type Picker = 'date' | 'week' | 'month' | 'quarter' | 'year';

export type RangeDateType = {
  from: any,
  to: any,
};
interface RangeDateProps {
  label?: string;
  handleOnChange?: (data: any, data2: any) => void;
  isFlex?: boolean;
  variant?: Variant;
  value?: RangeDateType,
  defaultValue?: RangeDateType,
  placeholder?: [string, string],
  fomat?: string;
  picker?: Picker;
  disabledDate?: any;
}
const RangeDate: React.FC<RangeDateProps> = ({
  label, handleOnChange, isFlex, variant, defaultValue, picker, placeholder,disabledDate,
  value, fomat, ...props
}) => {
  dayjs.extend(weekday);
  dayjs.extend(localeData);

  return (
    <div className={mapModifiers('a-range_time', isFlex && 'flex', variant)}>
      {label && (
        <p className="a-range_time_label">
          {label}
        </p>
      )}
      <RangePicker
        allowClear
        picker={picker}
        locale={localeVN as any}
        placeholder={placeholder ?? ['Từ ngày', 'Đến ngày']}
        allowEmpty={[true, true]}
        value={[dayjs(value?.from) as any, dayjs(value?.to) as any]}
  defaultValue={[dayjs(defaultValue?.from) as any, dayjs(defaultValue?.to) as any]}
        onChange={(e: any) => {
          if (handleOnChange) handleOnChange(dayjs((e || [])[0]?.$d).toDate(), dayjs((e || [])[1]?.$d).toDate());
        }}
        disabledDate={disabledDate} 
        {...props}
        format={fomat}
      />  
    </div>
  );
}

RangeDate.defaultProps = {
  isFlex: false,
  fomat: 'DD-MM-YYYY',
  picker: 'date'
};

export default RangeDate;