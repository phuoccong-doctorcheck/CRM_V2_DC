import { Popconfirm } from 'antd';
import React from 'react';

interface CPopupConfirmProps {
  children?: React.ReactNode;
  title: string;
  desc: React.ReactNode | string;
  textOK: string;
  textCancel: string;
  placement?: any;
  icon?: React.ReactNode;
  handleConfirm?: () => void;
  handleCancel?: () => void;
}

const CPopupConfirm: React.FC<CPopupConfirmProps> = ({
  children = undefined, title, desc, textOK, textCancel, handleConfirm, handleCancel, icon, placement
}) => (
  <Popconfirm
    placement={placement}
    title={title}
    description={desc}
    okText={textOK}
    cancelText={textCancel}
    onConfirm={handleConfirm}
    onCancel={handleCancel}
    icon={icon}
  >
    {children}
  </Popconfirm>
);

// CPopupConfirm.defaultProps = {
//   children: undefined,
// };

export default CPopupConfirm;
