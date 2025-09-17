/* eslint-disable react/button-has-type */
import useClickOutside from 'hooks/useClickOutside';
import React, { useEffect, useRef, useState } from 'react';
import mapModifiers from 'utils/functions';


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

const DropdownButtonQue: React.FC<DropdownButtonProps> = ({ textButton, children, className, isOpenDop,iconButton }) => {
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
      <div onClick={() => setIsOpen(!isOpen)}   className='blue-hover-effect'
                style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"5px", border:"1px solid #e3e1e1", padding:"5px", borderRadius:"5px", cursor:"pointer"}}>
       {iconButton && iconButton} <p style={{ textTransform: "none", fontWeight:600}}> {textButton}</p>
      </div>
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

DropdownButtonQue.defaultProps = {
};

export default DropdownButtonQue;
