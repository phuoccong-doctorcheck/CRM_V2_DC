/* eslint-disable @typescript-eslint/no-unused-vars */
import { Switch } from 'antd';
import React from 'react';
import mapModifiers from 'utils/functions';

import Icon from '../Icon';
import Typography from '../Typography';

type Variant = 'default' | 'simple' | 'style';

interface SwitchsProps {
  className?: string;
  onChange?: (checked: boolean, event: any) => void;
  checked?: boolean;
  label?: string;
  textOn?: string;
  textOff?: string;
  defaultChecked?: boolean;
  isLarge?: boolean;
  disabled?: boolean;
  variant?: Variant;
}

const Switchs: React.FC<SwitchsProps> = ({
  onChange, className, checked, textOn, textOff, label, defaultChecked, isLarge, disabled, variant
}) => (
  <div className={mapModifiers('a-switchs', isLarge ? 'large' : 'normal', variant)}>
    <div className="a-switchs_label">
      <Typography content={label} modifiers={['400', 'jet']} />
    </div>
    <Switch
      checkedChildren={<Typography content={textOff} modifiers={['400', 'white']} />}
      unCheckedChildren={<Typography content={textOn} modifiers={['400', 'white']} />}
      defaultChecked={defaultChecked}
      checked={checked}
      onChange={onChange}
      className={className}
      disabled={disabled}
    />
  </div>
);
Switchs.defaultProps = {
  defaultChecked: false,
};

export default Switchs;
