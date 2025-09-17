/* eslint-disable react/button-has-type */
import useClickOutside from 'hooks/useClickOutside';
import React, { useEffect, useRef, useState } from 'react';
import mapModifiers from 'utils/functions';

import Button from '../Button';
import Typography from '../Typography';

export interface DropdownButtonType {
  key: string | number;
  label: React.ReactNode | string;
  onClick: () => void;
}

interface DropdownButtonProps {
  textButton?: string;
  children: React.ReactNode;
  className?: string;
  isOpenDop?: boolean;
  iconButton?: any
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ textButton, children, className, isOpenDop,iconButton }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ButtonRef = useRef<HTMLDivElement>(null);
  useClickOutside(ButtonRef, () => {
    if (isOpen) setIsOpen(false);
  });

  useEffect(() => {
    setIsOpen(isOpenDop as boolean);
  }, [isOpenDop])

  return (
    <div className={mapModifiers('a-dropdown_button', isOpen && 'open', className)} ref={ButtonRef}>
      <Button onClick={() => setIsOpen(!isOpen)} className="a-dropdown_button_button">
       {iconButton && iconButton} <Typography content={textButton} modifiers={['400']} />
      </Button>
      {
        isOpen && (
          <div className="a-dropdown_button-open_list">
            {children}
          </div>
        )
      }
    </div>
  );
};

DropdownButton.defaultProps = {
};

export default DropdownButton;
