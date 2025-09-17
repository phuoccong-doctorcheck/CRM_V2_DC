import { Checkbox } from 'antd';
import React from 'react';
import mapModifiers from 'utils/functions';

import Typography from '../Typography';

export interface GroupCheckBoxItem {
  label: string;
  value: string | number;
  [x: string]: any;
}

interface GroupCheckBoxProps {
  options: GroupCheckBoxItem[];
  label?: string;
  onChange?: (checkedValue: GroupCheckBoxItem[]) => void;
  defaultVal?: string[] | number[] | undefined;
  values: string[] | number[] | undefined;
  disabled?: boolean;
  isFlex?: boolean;
}

const GroupCheckBox: React.FC<GroupCheckBoxProps> = ({
  options, label, onChange, values, defaultVal, disabled, isFlex
}) => (
  <div className={mapModifiers('a-group_checkbox', isFlex ? 'flex' : '')}>
    {label && (
      <div className='a-group_checkbox_label'>
        <Typography content={label || ''} />
      </div>
    )}
    <Checkbox.Group
      options={options}
      disabled={disabled}
      value={values as any}
      defaultValue={defaultVal as any}
      onChange={(data: any) => {
        if (onChange) onChange(data);
      }}
    />
  </div>
);
GroupCheckBox.defaultProps = {
};

export default GroupCheckBox;
