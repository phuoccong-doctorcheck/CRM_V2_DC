/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import Typography from 'components/atoms/Typography';
import React, { forwardRef } from 'react';
import mapModifiers from 'utils/functions';

export interface CheckBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  isCheckCustom?: boolean;
  desc?: string;
  isChecked?: boolean;
  onChange?: (data?: any) => void;
  style?: object;
  className?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({
    isCheckCustom, label, desc, isChecked, onChange, style, className, ...props
  }, ref) => (
    <div className={mapModifiers("a-checkbox", className)} style={style}>
      {
        isCheckCustom
          ? (
            <div className="a-checkbox_center">
              <input type="checkbox" onChange={onChange} checked={isChecked} id="cbx" />
              <label htmlFor="cbx" className="a-checkbox_toggle">
                <span />
              </label>
              <span className="a-checkbox_text">
                <Typography content={label} modifiers={['14x21', 'jet', '500']} />
                <Typography modifiers={['400', '14x21', 'jet']}>{desc}</Typography>
              </span>
            </div>
          ) : (
            <label className="a-checkbox_label">
              <input
                type="checkbox"
                checked={isChecked}
                ref={ref}
                onChange={onChange}
                {...props}
              />
              <span className="a-checkbox_text">{label}</span>
            </label>
          )
      }
    </div>
  ),
);

export default React.memo(Checkbox);
