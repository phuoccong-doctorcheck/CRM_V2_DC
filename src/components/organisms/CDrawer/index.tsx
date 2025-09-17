/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Drawer } from 'antd';
import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import React, { CSSProperties, LegacyRef, useRef } from 'react';
import mapModifiers from 'utils/functions';
// type PositionType = 'top' | 'bottom' | 'start' | 'end';

export type PlacementsDrawer = 'top' | 'right' | 'bottom' | 'left';
type Level = 'level1' | 'level2' | 'level3';
interface CDrawerProps {
  children?: React.ReactNode;
  isOpen: boolean;
  widths?: number | string;
  height?: string | number;
  noOverLay?: boolean;
  isTransition?: boolean;
  handleOnClose?: () => void;
  title?: string;
  positon?: PlacementsDrawer;
  levelDrawer?: Level,
  isHaveHeader?: boolean;
  isHaveHeader_custom?: boolean;
  isHaveHeaders?: boolean;
  isHaveFooter?: boolean;
  padding8?: boolean;
  titleHeader?: React.ReactNode;
  footerCancel?: string;
  footerSubmit?: string;
  className?: string;
  zIndex?: number;
  style?: CSSProperties;
  handleSubmit?: () => void;
}

const CDrawer: React.FC<CDrawerProps> = ({
  children, isOpen, widths, noOverLay, isTransition, positon, handleOnClose, title, levelDrawer, isHaveHeader, height, padding8,
  titleHeader, footerCancel, footerSubmit, handleSubmit, isHaveFooter, isHaveHeader_custom, className, zIndex, style, isHaveHeaders
}) => {
  return (
    <div className={mapModifiers('m-cdrawer_customize', positon, noOverLay && 'hide_mask', padding8 && 'pl')}>
       {/* Cái thanh trắng mà CDrawer có thể hiện lên được là do có chức năng Drawer của thư viên ANTD */}
      <Drawer
        placement={positon}
        open={isOpen}
        className={mapModifiers('m-cdrawer', levelDrawer, positon, isHaveHeader ? 'have_header' : 'not_header', isHaveHeader_custom && 'header_custom', className, isHaveHeaders && 'headers',)}
        onClose={handleOnClose}
        width={widths}
        getContainer={false}
        closable={false}
        height={height}
        zIndex={zIndex}
        style={style}
        closeIcon
      >
        {/* Khúc này hơi thừa vì không thấy sử dụng, và cả footer nữa  */}
        {
          isHaveHeader && (
            <div className="m-cdrawer_header">
              <p>
                {titleHeader}
              </p>
              <div className="m-cdrawer_header_close" onClick={handleOnClose}>
                <Icon iconName="close_drawer" size='16x16' isPointer />
              </div>
            </div>
          )
        }
        <div className="m-cdrawer_content">
          {children}
        </div>
        {/* Khúc này hơi thừa */}
        {
          isHaveFooter && (
            <div className="m-cdrawer_footer">
              <Button modifiers={['foreign']} className="m-form_note" onClick={handleOnClose}>
                <Typography type="span" modifiers={['400', '16x24']} content={footerCancel} />
              </Button>
              <Button modifiers={['primary']} className="m-form_note" onClick={handleSubmit}>
                <Typography type="span" modifiers={['400', '16x24']} content={footerSubmit} />
              </Button>
            </div>
          )
        }
      </Drawer>
    </div>
  );
};

CDrawer.defaultProps = {
  children: undefined,
  widths: 250,
  positon: 'right',
  isHaveHeader: false,
  isHaveFooter: false,
  isHaveHeaders: false
};

export default CDrawer;
