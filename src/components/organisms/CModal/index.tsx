import { Modal } from 'antd';
import Typography from 'components/atoms/Typography';
import React, { CSSProperties } from 'react';
import mapModifiers from 'utils/functions';

interface CModalProps {
  children?: React.ReactNode;
  title?: string | React.ReactNode;
  isOpen: boolean;
  textCancel?: string;
  textOK?: string;
  className?: string;
  widths?: number | string;
  footer?: React.ReactNode;
  isHideCancel?: boolean;
  isHideOk?: boolean;
  isHideFooter?: boolean;
  disableCancel?: boolean;
  disableOk?: boolean;
  zIndex?: number;
  onCancel?: () => void;
  onOk?: () => void;
  confirmLoading?: boolean;
  style?: CSSProperties;
  isHeight?: boolean;

}

const CModal: React.FC<CModalProps> = ({
  children, title, isOpen, onCancel, onOk, textCancel, textOK, widths, footer, className, isHeight,
  isHideCancel, isHideFooter, isHideOk, disableCancel, disableOk, zIndex, confirmLoading, style
}) => (
  <div className={mapModifiers('o-cmodal', className)}>
    <Modal
      title={(typeof title === 'string') ? < Typography content={title as any} /> : title}
      open={isOpen}
      onCancel={onCancel}
      onOk={onOk}
      centered
      closable={true}
      cancelText={textCancel}
      okText={textOK}
      width={widths}
      confirmLoading={confirmLoading}
      okButtonProps={{ disabled: disableOk }}
      cancelButtonProps={{ disabled: disableCancel }}
      className={mapModifiers('o-cmodal_custom', className, isHideCancel && 'hide_cancel', isHideFooter && 'hide_footer', isHideOk && 'hide_ok', isHeight && 'higher')}
      footer={footer}
      zIndex={zIndex}
      style={style}
    >
      {children}
    </Modal>
  </div >
);

CModal.defaultProps = {
  children: undefined,
  widths: 400,
  zIndex: 1200
};

export default CModal;
