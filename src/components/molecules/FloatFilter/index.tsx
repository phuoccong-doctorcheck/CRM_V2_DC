/* eslint-disable @typescript-eslint/no-unused-vars */
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import useClickOutside from 'hooks/useClickOutside';
import React, { useRef } from 'react';
import mapModifiers from 'utils/functions';

interface FloatFilterProps {
  children?: React.ReactNode;
  headerTitle?: string
  open?: boolean;
  handleClose?: () => void;
  position?: 'left' | 'right' | 'right-center' | 'left-center';
  isHideCloseBtn?: boolean;
}

const FloatFilter: React.FC<FloatFilterProps> = ({ children, headerTitle, open, handleClose, position, isHideCloseBtn }) => {
  const refFloat = useRef<HTMLDivElement>(null)
  return (
    <div className={mapModifiers("m-float_filter", open ? 'open' : 'close', position)} ref={refFloat}>
      <div className={mapModifiers("m-float_filter_wrrapper")}>
        <div className="m-float_filter_header">
          <Typography content={headerTitle} />
          {!isHideCloseBtn && (

            <div className="m-float_filter_header_close">
              <Icon iconName='close' onClick={handleClose} />
            </div>
          )}
        </div>
        <div className="m-float_filter_content">
          <div className="m-float_filter_content_wrap">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

FloatFilter.defaultProps = {
  children: undefined,
  position: 'left',
  isHideCloseBtn: false,
};

export default FloatFilter;
