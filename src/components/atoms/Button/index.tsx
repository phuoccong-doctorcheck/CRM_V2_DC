/* eslint-disable react/button-has-type */

import Icon, { IconName, IconSize } from 'components/atoms/Icon';
import React from 'react';
import mapModifiers from 'utils/functions';

import imgLoading from 'assets/images/loading.gif';

type Sizes = 'h20' | 'h36' | 'h36-md' | 'h56';
type Variant = 'primary' | 'bgGray' | 'white' | 'foreign' | 'transparent' | 'link' | 'low' | 'orange' | 'red';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  modifiers?: (Variant | Sizes)[];
  iconName?: IconName;
  iconSize?: IconSize;
  textAndIconSpacing?: number;
  sizeImg?: string;
  isLoading?: boolean;
  refButton?: any;
}

const Button: React.FC<ButtonProps> = ({
  children,  modifiers= ['primary', 'h36'], iconName, iconSize, textAndIconSpacing,
  name, id, className, isLoading = false, disabled, type = 'button', sizeImg,
  onClick, refButton,
}) => (
  <button
    id={id}
    name={name}
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={mapModifiers(
      'a-button',
      modifiers,
      className,
      isLoading && 'loading',
    )}
    ref={refButton}
  >
    {
      isLoading ? <img src={imgLoading} alt="loading" width={sizeImg} height={sizeImg} />
        : (
          <>
            {children}
            {iconName && (
              <div className="a-button_icon" style={{ paddingLeft: `${textAndIconSpacing}px` }}>
                <Icon iconName={iconName} size={iconSize} />
              </div>
            )}
          </>
        )
    }
  </button>
);

// Button.defaultProps = {
//   modifiers: ['primary', 'h36'],
//   isLoading: false,
// };

export default Button;
